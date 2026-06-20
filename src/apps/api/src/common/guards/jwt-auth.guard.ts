import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { decodeUnsignedFixtureToken } from '../auth/dev-fixture-token';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    sub: string;
    role: string;
    tenantId?: string;
    practiceIds?: string[];
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (token) {
      const claims = decodeUnsignedFixtureToken(token);
      if (claims) {
        // Unsigned (`alg: "none"`) fixture tokens are a dev-only affordance so
        // the mobile app can run EXPO_PUBLIC_USE_API=true against a local API
        // without a real IdP. They must never be honoured in production.
        if (process.env.NODE_ENV === 'production') {
          throw new UnauthorizedException('Unsigned tokens are not accepted');
        }
        if (claims.exp && claims.exp * 1000 < Date.now()) {
          throw new UnauthorizedException('Token expired');
        }
        request.user = {
          id: claims.sub,
          sub: claims.sub,
          role: claims.role,
          tenantId: claims.tenantId,
          practiceIds: claims.practiceIds,
        };
      }
      // Signed tokens fall through unverified for now.
      // TODO(M4.4 / DEV.md §2): verify the signature and attach the user.
    }

    // No token (or a signed token pending real verification): preserve the
    // permissive placeholder so public routes and existing tests are
    // unaffected. RolesGuard still enforces @Roles() once a user is attached.
    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest): string | null {
    const header = request.headers.authorization;
    if (typeof header !== 'string') return null;
    const [scheme, value] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !value) return null;
    return value;
  }
}
