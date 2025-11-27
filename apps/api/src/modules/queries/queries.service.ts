import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Client } from 'pg';

@Injectable()
export class QueriesService {
    constructor(private prisma: PrismaService) { }

    async executeQuery(datasetId: string, sql: string) {
        // Basic SQL injection protection - only allow SELECT statements
        const trimmedSql = sql.trim().toLowerCase();
        if (!trimmedSql.startsWith('select')) {
            throw new Error('Only SELECT queries are allowed');
        }

        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        try {
            const result = await client.query(sql);

            // Log the query
            await this.prisma.queryLog.create({
                data: {
                    datasetId,
                    question: 'Manual SQL Query',
                    sql,
                    resultPreview: result.rows.slice(0, 10), // Store first 10 rows
                },
            });

            return {
                rows: result.rows,
                rowCount: result.rowCount,
                fields: result.fields.map(f => ({ name: f.name, dataType: f.dataTypeID })),
            };
        } finally {
            await client.end();
        }
    }

    async getHistory(datasetId: string) {
        return this.prisma.queryLog.findMany({
            where: { datasetId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
}
