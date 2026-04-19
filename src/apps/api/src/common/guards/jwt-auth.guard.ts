import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // For now, this is a placeholder that always returns true
    // In a real app, this would verify the JWT and attach the user to the request
    return true;
  }
}
