import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * AuthGuard validates that a request has a valid user session
 * For NextAuth JWT sessions, we expect the frontend to pass user info
 */
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // Check for Service API Key (for worker/internal services)
        const validApiKey = process.env.API_SERVICE_KEY;
        const apiKey = request.headers['x-api-key'];

        if (validApiKey && apiKey === validApiKey) {
            request.user = {
                id: 'system-service',
                role: 'ENTERPRISE', // Service has full access
            };
            return true;
        }

        // Extract user from headers (sent by frontend after NextAuth verification)
        const userId = request.headers['x-user-id'];
        const userRole = request.headers['x-user-role'];

        if (!userId || !userRole) {
            throw new UnauthorizedException('Authentication required');
        }

        // Attach user to request for downstream use
        request.user = {
            id: userId,
            role: userRole,
        };

        return true;
    }
}
