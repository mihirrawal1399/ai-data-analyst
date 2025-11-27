import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AutomationsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; userId: string; schedule: string; payload?: any }) {
        return this.prisma.automation.create({
            data: {
                name: data.name,
                userId: data.userId,
                schedule: data.schedule,
                payload: data.payload || null,
            },
        });
    }

    async findAll() {
        return this.prisma.automation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.automation.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }

    async update(id: string, data: { name?: string; schedule?: string; payload?: any }) {
        return this.prisma.automation.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.automation.delete({
            where: { id },
        });
    }
}
