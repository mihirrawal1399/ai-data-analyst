import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async signup(email: string, password: string) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new free user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'FREE',
            },
        });

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async createGuestUser() {
        const guestUser = await this.prisma.user.create({
            data: {
                role: 'GUEST',
            },
        });

        return {
            success: true,
            session: {
                id: guestUser.id,
                role: 'GUEST',
                expiresAt: Date.now() + 6 * 60 * 60 * 1000, // 6 hours
            },
        };
    }

    async verifyCredentials(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
}
