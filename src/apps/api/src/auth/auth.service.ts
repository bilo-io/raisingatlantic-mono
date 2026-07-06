import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { AuthProvider, UserRole } from '../users/constants';
import { SystemLogsService } from '../system-logs/system-logs.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import type { AuthTokenPayload } from '../common/guards/jwt-auth.guard';

const BCRYPT_ROUNDS = 12;

export type PublicUser = Omit<User, 'passwordHash'>;

export interface AuthResult {
  user: PublicUser;
  token: string;
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
  ) {}

  async register(dto: RegisterDto, ipAddress?: string): Promise<AuthResult> {
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
    return this.buildResult(saved);
  }

  async login(dto: LoginDto, ipAddress?: string): Promise<AuthResult> {
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

    await this.audit('LOGIN_SUCCESS', 'Login succeeded', user.id, ipAddress, {
      provider: 'email',
    });
    return this.buildResult(user);
  }

  async loginWithGoogle(
    dto: GoogleLoginDto,
    ipAddress?: string,
  ): Promise<AuthResult> {
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
      await this.audit('LOGIN_FAILURE', 'Google login failed', undefined, ipAddress, {
        reason: 'invalid_google_token',
      });
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

    await this.audit('LOGIN_SUCCESS', 'Login succeeded', user.id, ipAddress, {
      provider: 'google',
    });
    return this.buildResult(user);
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
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
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
