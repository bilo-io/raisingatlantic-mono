import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MoreThan, Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { generateTotpSecret, totpUri, verifyTotp } from './totp';
import { User } from '../users/users.model';
import { AuthProvider, UserRole } from '../users/constants';
import { SystemLogsService } from '../system-logs/system-logs.service';
import { INotificationDispatcher } from '@core/notifications/interfaces/dispatcher.interface';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import type {
  AuthTokenPayload,
  AuthTokenScope,
} from '../common/guards/jwt-auth.guard';

const BCRYPT_ROUNDS = 12;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const MFA_TOKEN_EXPIRY = '5m';
const TOTP_ISSUER = 'Raising Atlantic';

// CLAUDE.md: MFA is mandatory for these roles — login never yields a full
// session for them until TOTP is enrolled and verified.
const MFA_REQUIRED_ROLES: readonly UserRole[] = [
  UserRole.CLINICIAN,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

// Single source of truth for the columns that must never leave the API —
// sanitize() strips exactly this list and PublicUser is derived from it.
const SENSITIVE_USER_FIELDS = [
  'passwordHash',
  'mfaSecret',
  'emailVerificationTokenHash',
  'emailVerificationTokenExpiresAt',
  'passwordResetTokenHash',
  'passwordResetTokenExpiresAt',
] as const;

export type PublicUser = Omit<User, (typeof SENSITIVE_USER_FIELDS)[number]>;

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export interface MfaChallengeResult {
  mfaRequired?: true;
  mfaSetupRequired?: true;
  mfaToken: string;
}

export type LoginResult = AuthResult | MfaChallengeResult;

export function isMfaChallenge(
  result: LoginResult,
): result is MfaChallengeResult {
  return 'mfaToken' in result;
}

@Injectable()
export class AuthService {
  private googleClient?: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly systemLogs: SystemLogsService,
    @Inject(NOTIFICATION_TOKENS.Dispatcher)
    private readonly notifications: INotificationDispatcher,
  ) {}

  async register(dto: RegisterDto, ipAddress?: string): Promise<LoginResult> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = this.usersRepository.create({
      title: dto.title,
      name: dto.name,
      email,
      phone: dto.phone,
      role: dto.role,
      passwordHash,
      authProvider: AuthProvider.EMAIL,
      emailVerified: false,
    });
    const saved = await this.usersRepository.save(user);

    await this.audit('REGISTER', 'New account registered', saved.id, ipAddress);
    // Fire-and-forget: verification is enforced at the next login, so a mail
    // failure must not fail registration.
    void this.requestEmailVerification(saved.email, ipAddress).catch(() => {});
    // Same gating as login: privileged roles get an mfa_setup challenge, never
    // an ungated session straight from registration. The just-registered
    // account is unverified by definition, so it gets the one grace pass —
    // every later login enforces verification.
    return this.finishLogin(saved, 'email', ipAddress, {
      allowUnverified: true,
    });
  }

  async login(dto: LoginDto, ipAddress?: string): Promise<LoginResult> {
    const email = dto.email.toLowerCase().trim();
    // passwordHash is `select: false`; opt in explicitly for verification only.
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    if (!user?.passwordHash) {
      await this.audit('LOGIN_FAILURE', 'Login failed', undefined, ipAddress, {
        reason: 'no_password_account',
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      await this.audit('LOGIN_FAILURE', 'Login failed', user.id, ipAddress, {
        reason: 'invalid_credentials',
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.finishLogin(user, 'email', ipAddress);
  }

  // Shared post-identity step for every session-minting path: email
  // verification first (unless the caller explicitly grants the registration
  // grace), then MFA gating. Privileged roles never get a session without TOTP.
  private async finishLogin(
    user: User,
    provider: 'email' | 'google',
    ipAddress?: string,
    opts?: { allowUnverified?: boolean },
  ): Promise<LoginResult> {
    if (
      !opts?.allowUnverified &&
      user.authProvider === AuthProvider.EMAIL &&
      !user.emailVerified
    ) {
      void this.requestEmailVerification(user.email, ipAddress).catch(() => {});
      await this.audit('LOGIN_FAILURE', 'Login failed', user.id, ipAddress, {
        reason: 'email_not_verified',
      });
      throw new ForbiddenException({
        message: 'Verify your email address to sign in',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    if (user.mfaEnabled) {
      return { mfaRequired: true, mfaToken: this.scopedToken(user, 'mfa') };
    }
    if (MFA_REQUIRED_ROLES.includes(user.role)) {
      return {
        mfaSetupRequired: true,
        mfaToken: this.scopedToken(user, 'mfa_setup'),
      };
    }

    await this.audit('LOGIN_SUCCESS', 'Login succeeded', user.id, ipAddress, {
      provider,
    });
    return this.buildResult(user);
  }

  async loginWithGoogle(
    dto: GoogleLoginDto,
    ipAddress?: string,
  ): Promise<LoginResult> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new ServiceUnavailableException('Google sign-in is not configured');
    }

    this.googleClient ??= new OAuth2Client(clientId);
    let email: string;
    let googleId: string;
    let name: string | undefined;
    let picture: string | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.email || !payload.sub) {
        throw new Error('Incomplete Google token payload');
      }
      email = payload.email.toLowerCase();
      googleId = payload.sub;
      name = payload.name;
      picture = payload.picture;
    } catch {
      await this.audit(
        'LOGIN_FAILURE',
        'Google login failed',
        undefined,
        ipAddress,
        {
          reason: 'invalid_google_token',
        },
      );
      throw new UnauthorizedException('Invalid Google credentials');
    }

    let user = await this.usersRepository.findOne({ where: { googleId } });
    if (!user) {
      // Link to an existing email account if one exists, else create fresh.
      user = await this.usersRepository.findOne({ where: { email } });
      if (user) {
        user.googleId = googleId;
        user.emailVerified = true;
      } else {
        user = this.usersRepository.create({
          email,
          name: name ?? email,
          phone: '',
          imageUrl: picture,
          role: UserRole.PARENT,
          googleId,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
        });
      }
      user = await this.usersRepository.save(user);
    }

    return this.finishLogin(user, 'google', ipAddress);
  }

  async getMe(userId: string): Promise<PublicUser> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Session user no longer exists');
    }
    return this.sanitize(user);
  }

  async logout(userId?: string, ipAddress?: string): Promise<void> {
    await this.audit('LOGOUT', 'User logged out', userId, ipAddress);
  }

  // ── Email verification ────────────────────────────────────────────────────

  // Always resolves, whether or not the account exists — response timing and
  // shape must not reveal registered addresses (user enumeration).
  async requestEmailVerification(
    email: string,
    ipAddress?: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user || user.emailVerified) return;

    const token = this.issueFlowToken();
    // Partial update: this runs fire-and-forget from register/login and must
    // never clobber concurrent changes to other user fields.
    await this.usersRepository.update(user.id, {
      emailVerificationTokenHash: token.hash,
      emailVerificationTokenExpiresAt: new Date(
        Date.now() + VERIFICATION_TOKEN_TTL_MS,
      ),
    });

    await this.notifications.email({
      to: user.email,
      subject: 'Verify your Raising Atlantic email address',
      text: `Confirm your email address to activate your account:\n\n${this.appUrl()}/verify-email?token=${token.raw}\n\nThe link expires in 24 hours. If you didn't create an account, ignore this email.`,
    });
    await this.audit(
      'EMAIL_VERIFY_SENT',
      'Verification email sent',
      user.id,
      ipAddress,
    );
  }

  async verifyEmail(rawToken: string, ipAddress?: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: {
        emailVerificationTokenHash: this.hashToken(rawToken),
        emailVerificationTokenExpiresAt: MoreThan(new Date()),
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification link');
    }
    await this.usersRepository.update(user.id, {
      emailVerified: true,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
    });
    await this.audit('EMAIL_VERIFIED', 'Email verified', user.id, ipAddress);
  }

  // ── Password reset ────────────────────────────────────────────────────────

  async requestPasswordReset(email: string, ipAddress?: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) return;

    const token = this.issueFlowToken();
    await this.usersRepository.update(user.id, {
      passwordResetTokenHash: token.hash,
      passwordResetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    await this.notifications.email({
      to: user.email,
      subject: 'Reset your Raising Atlantic password',
      text: `Someone requested a password reset for your account. If this was you, set a new password here:\n\n${this.appUrl()}/reset-password?token=${token.raw}\n\nThe link expires in 1 hour. If you didn't request this, ignore this email — your password is unchanged.`,
    });
    await this.audit(
      'PASSWORD_RESET_REQUESTED',
      'Password reset requested',
      user.id,
      ipAddress,
    );
  }

  async resetPassword(
    rawToken: string,
    newPassword: string,
    ipAddress?: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: {
        passwordResetTokenHash: this.hashToken(rawToken),
        passwordResetTokenExpiresAt: MoreThan(new Date()),
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired reset link');
    }
    await this.usersRepository.update(user.id, {
      passwordHash: await bcrypt.hash(newPassword, BCRYPT_ROUNDS),
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      // Completing the reset proves control of the mailbox.
      emailVerified: true,
    });
    await this.audit('PASSWORD_RESET', 'Password reset', user.id, ipAddress);
  }

  // ── MFA (TOTP) ───────────────────────────────────────────────────────────

  async setupMfa(
    userId: string,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('Session user no longer exists');
    if (user.mfaEnabled) {
      throw new ConflictException('MFA is already enabled for this account');
    }
    const secret = generateTotpSecret();
    await this.usersRepository.update(user.id, { mfaSecret: secret });
    return {
      secret,
      otpauthUrl: totpUri(secret, TOTP_ISSUER, user.email),
    };
  }

  async enableMfa(
    userId: string,
    code: string,
    ipAddress?: string,
  ): Promise<User> {
    const user = await this.userWithMfaSecret(userId);
    if (!user?.mfaSecret) {
      throw new BadRequestException('Run MFA setup before enabling');
    }
    if (!verifyTotp(user.mfaSecret, code)) {
      await this.audit(
        'MFA_CHALLENGE_FAILURE',
        'MFA enrolment code rejected',
        user.id,
        ipAddress,
      );
      throw new UnauthorizedException('Invalid authenticator code');
    }
    await this.usersRepository.update(user.id, { mfaEnabled: true });
    user.mfaEnabled = true;
    await this.audit('MFA_ENROLLED', 'MFA enabled', user.id, ipAddress);
    return user;
  }

  async verifyMfaChallenge(
    mfaToken: string,
    code: string,
    ipAddress?: string,
  ): Promise<AuthResult> {
    let payload: AuthTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<AuthTokenPayload>(mfaToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired MFA token');
    }
    if (payload.scope !== 'mfa') {
      throw new UnauthorizedException('Invalid or expired MFA token');
    }

    const user = await this.userWithMfaSecret(payload.sub);
    if (!user?.mfaSecret || !user.mfaEnabled) {
      throw new UnauthorizedException('MFA is not enabled for this account');
    }
    if (!verifyTotp(user.mfaSecret, code)) {
      await this.audit(
        'MFA_CHALLENGE_FAILURE',
        'MFA challenge code rejected',
        user.id,
        ipAddress,
      );
      throw new UnauthorizedException('Invalid authenticator code');
    }

    await this.audit('LOGIN_SUCCESS', 'Login succeeded', user.id, ipAddress, {
      provider: 'email',
      mfa: true,
    });
    return this.buildResult(user);
  }

  // Public wrapper so the controller can issue a session after MFA enrolment
  // completes for an `mfa_setup`-scoped caller. Audits like any other login.
  async sessionFor(user: User, ipAddress?: string): Promise<AuthResult> {
    await this.audit('LOGIN_SUCCESS', 'Login succeeded', user.id, ipAddress, {
      provider: 'email',
      mfa: true,
    });
    return this.buildResult(user);
  }

  private async userWithMfaSecret(userId: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.mfaSecret')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  private issueFlowToken(): { raw: string; hash: string } {
    const raw = randomBytes(32).toString('hex');
    return { raw, hash: this.hashToken(raw) };
  }

  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  private scopedToken(user: User, scope: AuthTokenScope): string {
    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      scope,
    };
    return this.jwtService.sign(payload, { expiresIn: MFA_TOKEN_EXPIRY });
  }

  private appUrl(): string {
    return (
      this.configService.get<string>('PUBLIC_APP_URL') ??
      'https://app.raisingatlantic.com'
    );
  }

  private buildResult(user: User): AuthResult {
    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { user: this.sanitize(user), token };
  }

  private sanitize(user: User): PublicUser {
    const clean: Record<string, unknown> = { ...user };
    for (const field of SENSITIVE_USER_FIELDS) {
      delete clean[field];
    }
    return clean as PublicUser;
  }

  // Audit trail for auth events. Pseudonymous user id only — never email,
  // password, or token (the pino redaction list also guards these globally).
  private async audit(
    type: string,
    message: string,
    userId?: string,
    ipAddress?: string,
    extra?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.systemLogs.createLog({
        type,
        message,
        metadata: { userId, ...extra },
        ipAddress,
      });
    } catch {
      // Auditing must never block an auth response.
    }
  }
}
