import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QueryUsageTracking {
    [userId: string]: {
        count: number;
        resetAt: number;
    };
}

const guestQueryTracker: QueryUsageTracking = {};
const GUEST_QUERY_LIMIT = 3;
const SESSION_DURATION = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Track guest user query usage
 */
export async function trackGuestQuery(userId: string): Promise<boolean> {
    const now = Date.now();

    // Clean up expired entries
    if (guestQueryTracker[userId] && guestQueryTracker[userId].resetAt < now) {
        delete guestQueryTracker[userId];
    }

    // Initialize or get entry
    if (!guestQueryTracker[userId]) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'GUEST') {
            return true; // Not a guest, allow
        }

        const sessionStart = user.createdAt.getTime();
        guestQueryTracker[userId] = {
            count: 0,
            resetAt: sessionStart + SESSION_DURATION,
        };
    }

    const entry = guestQueryTracker[userId];

    // Check if session expired
    if (entry.resetAt < now) {
        return false; // Session expired
    }

    // Check limit
    if (entry.count >= GUEST_QUERY_LIMIT) {
        return false; // Limit exceeded
    }

    // Increment counter
    entry.count++;
    return true;
}

/**
 * Get remaining queries for guest user
 */
export async function getGuestQueryRemaining(userId: string): Promise<number> {
    const entry = guestQueryTracker[userId];
    if (!entry) {
        return GUEST_QUERY_LIMIT;
    }

    const remaining = GUEST_QUERY_LIMIT - entry.count;
    return Math.max(0, remaining);
}

/**
 * Check if guest session is expired
 */
export async function isGuestSessionExpired(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== 'GUEST') {
        return false;
    }

    const sessionAge = Date.now() - user.createdAt.getTime();
    return sessionAge > SESSION_DURATION;
}
