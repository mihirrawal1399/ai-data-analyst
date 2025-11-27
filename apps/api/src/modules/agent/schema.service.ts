import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Client } from 'pg';

@Injectable()
export class SchemaService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get dataset schema from Prisma
     */
    async getDatasetSchema(datasetId: string) {
        const dataset = await this.prisma.dataset.findUnique({
            where: { id: datasetId },
            include: {
                tables: {
                    include: {
                        columns: true,
                    },
                },
            },
        });

        if (!dataset) {
            throw new Error('Dataset not found');
        }

        return dataset;
    }

    /**
     * Get sample rows from a table
     */
    async getSampleRows(tableName: string, limit = 3): Promise<any[]> {
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        try {
            const result = await client.query(
                `SELECT * FROM "${tableName}" LIMIT $1`,
                [limit]
            );
            return result.rows;
        } finally {
            await client.end();
        }
    }

    /**
     * Format schema as text for LLM prompt
     */
    formatSchemaForLLM(dataset: any): string {
        let schemaText = '';

        for (const table of dataset.tables) {
            schemaText += `\nTable: ${table.name}\n`;
            schemaText += 'Columns:\n';

            for (const column of table.columns) {
                schemaText += `  - ${column.name} (${column.dataType})${column.isNullable ? ' [nullable]' : ''}\n`;
            }
        }

        return schemaText;
    }

    /**
     * Format sample rows as text for LLM prompt
     */
    formatSampleRowsForLLM(rows: any[]): string {
        if (rows.length === 0) {
            return 'No sample data available';
        }

        return JSON.stringify(rows, null, 2);
    }
}
