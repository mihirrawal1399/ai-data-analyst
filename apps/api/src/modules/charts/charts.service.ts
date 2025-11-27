import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ChartsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { dashboardId: string; title?: string; type: string; config: any }) {
        return this.prisma.chart.create({
            data: {
                dashboardId: data.dashboardId,
                title: data.title || null,
                type: data.type,
                config: data.config,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.chart.findUnique({
            where: { id },
            include: {
                dashboard: true,
            },
        });
    }

    async update(id: string, data: { title?: string; type?: string; config?: any }) {
        return this.prisma.chart.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.chart.delete({
            where: { id },
        });
    }
}
