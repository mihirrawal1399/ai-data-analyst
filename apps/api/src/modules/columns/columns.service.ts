import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ColumnsService {
    constructor(private prisma: PrismaService) { }

    async findByTable(tableId: string) {
        return this.prisma.datasetColumn.findMany({
            where: { tableId },
            include: {
                table: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.datasetColumn.findUnique({
            where: { id },
            include: {
                table: true,
                dataset: true,
            },
        });
    }
}
