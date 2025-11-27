import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Client } from 'pg';

@Injectable()
export class TablesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.datasetTable.findMany({
            include: {
                dataset: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                columns: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.datasetTable.findUnique({
            where: { id },
            include: {
                dataset: true,
                columns: true,
            },
        });
    }

    async remove(id: string) {
        const table = await this.prisma.datasetTable.findUnique({
            where: { id },
        });

        if (!table) {
            throw new Error('Table not found');
        }

        // Drop the actual PostgreSQL table
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        try {
            await client.query(`DROP TABLE IF EXISTS "${table.name}" CASCADE`);
        } finally {
            await client.end();
        }

        // Delete metadata from Prisma
        return this.prisma.datasetTable.delete({
            where: { id },
        });
    }
}
