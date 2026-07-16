import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  RequestWithAuth,
  extractAccessToken,
  resolveToken,
} from './jwt-auth.guard';

/**
 * Guard for the MFA setup/enable routes only. Accepts either a full session
 * (a parent opting in to MFA) or an `mfa_setup`-scoped token (a privileged
 * user who must enrol before receiving a session). Challenge-scoped (`mfa`)
 * tokens are NOT accepted — those belong exclusively to /auth/mfa/verify,
 * which takes the token in the request body.
 */
@Injectable()
export class JwtMfaFlowGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = extractAccessToken(request);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    const payload = await resolveToken(
      token,
      this.jwtService,
      this.configService,
    );
    if (!payload || (payload.scope && payload.scope !== 'mfa_setup')) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    request.user = payload;
    return true;
  }
}
