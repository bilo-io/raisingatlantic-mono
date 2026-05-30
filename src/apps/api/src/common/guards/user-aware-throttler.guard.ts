import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id?: string | number };
}

/**
 * Tracks throttle quotas per authenticated user when a JWT-resolved
 * `req.user.id` is present, falling back to `req.ip` for anonymous
 * traffic. This prevents one shared NAT'd IP (school, clinic, kiosk)
 * from starving every user behind it.
 */
@Injectable()
export class UserAwareThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: AuthenticatedRequest): Promise<string> {
    const userId = req.user?.id;
    const tracker =
      userId !== undefined && userId !== null
        ? `user:${String(userId)}`
        : `ip:${req.ip ?? 'unknown'}`;
    return Promise.resolve(tracker);
  }
}
