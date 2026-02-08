import { PrismaClient } from '@prisma/client';

export async function createGuestSession() {
    const prisma = new PrismaClient();

    try {
        const guestUser = await prisma.user.create({
            data: {
                role: 'GUEST',
                email: null,
                password: null,
            },
        });

        return {
            id: guestUser.id,
            role: 'GUEST',
            expiresAt: Date.now() + 6 * 60 * 60 * 1000, // 6 hours
        };
    } finally {
        await prisma.$disconnect();
    }
}

export async function isGuestSessionExpired(createdAt: Date): Promise<boolean> {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    return createdAt < sixHoursAgo;
}
