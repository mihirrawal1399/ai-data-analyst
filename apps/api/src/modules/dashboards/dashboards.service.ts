import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DashboardsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; userId: string; layout?: any }) {
        return this.prisma.dashboard.create({
            data: {
                name: data.name,
                userId: data.userId,
                layout: data.layout || null,
            },
        });
    }

    async findAll() {
        return this.prisma.dashboard.findMany({
            include: {
                charts: true,
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
        return this.prisma.dashboard.findUnique({
            where: { id },
            include: {
                charts: true,
                user: true,
            },
        });
    }

    async update(id: string, data: { name?: string; layout?: any }) {
        return this.prisma.dashboard.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.dashboard.delete({
            where: { id },
        });
    }
}
