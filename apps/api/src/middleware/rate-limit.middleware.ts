import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetAt: number;
    };
}

/**
 * Simple in-memory rate limiter
 * For production, consider Redis-based limiter
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private store: RateLimitStore = {};
    private readonly maxRequests = 100; // requests per window
    private readonly windowMs = 15 * 60 * 1000; // 15 minutes

    use(req: Request, res: Response, next: NextFunction) {
        const identifier = this.getIdentifier(req);
        const now = Date.now();

        // Clean up expired entries
        if (this.store[identifier] && this.store[identifier].resetAt < now) {
            delete this.store[identifier];
        }

        // Initialize or get entry
        if (!this.store[identifier]) {
            this.store[identifier] = {
                count: 0,
                resetAt: now + this.windowMs,
            };
        }

        const entry = this.store[identifier];

        // Check limit
        if (entry.count >= this.maxRequests) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // Increment counter
        entry.count++;

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', this.maxRequests - entry.count);
        res.setHeader('X-RateLimit-Reset', new Date(entry.resetAt).toISOString());

        next();
    }

    private getIdentifier(req: Request): string {
        // Use user ID if authenticated, otherwise IP
        const userId = req.headers['x-user-id'];
        if (userId) {
            return `user:${userId}`;
        }
        return `ip:${req.ip || req.socket.remoteAddress}`;
    }
}
