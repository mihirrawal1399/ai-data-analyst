import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { Client } from 'pg';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';

interface ColumnInfo {
  name: string;
  dataType: 'TEXT' | 'INT' | 'FLOAT' | 'DATE' | 'BOOL';
}

@Injectable()
export class DatasetsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Infer column type from sample values
   */
  private inferColumnType(values: string[]): ColumnInfo['dataType'] {
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

    if (nonNullValues.length === 0) return 'TEXT';

    // Check if all values are booleans
    const boolPattern = /^(true|false|yes|no|1|0)$/i;
    if (nonNullValues.every(v => boolPattern.test(v))) {
      return 'BOOL';
    }

    // Check if all values are integers
    const intPattern = /^-?\d+$/;
    if (nonNullValues.every(v => intPattern.test(v))) {
      return 'INT';
    }

    // Check if all values are floats
    const floatPattern = /^-?\d+\.?\d*$/;
    if (nonNullValues.every(v => floatPattern.test(v))) {
      return 'FLOAT';
    }

    // Check if all values are dates
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (nonNullValues.every(v => datePattern.test(v) && !isNaN(Date.parse(v)))) {
      return 'DATE';
    }

    return 'TEXT';
  }

  /**
   * Sanitize SQL identifier to prevent SQL injection
   */
  private sanitizeIdentifier(identifier: string): string {
    // Remove any characters that aren't alphanumeric or underscore
    return identifier.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  /**
   * Map inferred type to PostgreSQL type
   */
  private mapToPostgresType(dataType: ColumnInfo['dataType']): string {
    const typeMap = {
      TEXT: 'TEXT',
      INT: 'INTEGER',
      FLOAT: 'DOUBLE PRECISION',
      DATE: 'DATE',
      BOOL: 'BOOLEAN',
    };
    return typeMap[dataType];
  }

  async handleUpload(body: { name: string; userId: string }, file: { buffer: Buffer }) {
    const fileSize = file.buffer.length;
    const useLargeFileMode = fileSize > 10 * 1024 * 1024; // 10MB threshold

    let client: Client | null = null;
    let dataset: any = null;
    let table: any = null;

    try {
      // 1. Parse CSV with streaming for large files
      const records: any[] = [];
      const csvText = file.buffer.toString('utf8');

      await new Promise<void>((resolve, reject) => {
        const parser = parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });

        const stream = Readable.from(csvText);

        stream.pipe(parser)
          .on('data', (record) => {
            records.push(record);
          })
          .on('error', (error) => {
            reject(error);
          })
          .on('end', () => {
            resolve();
          });
      });

      if (records.length === 0) {
        throw new Error('CSV file is empty or has no valid records');
      }

      // 2. Validate CSV header consistency
      const columns = Object.keys(records[0]);
      if (columns.length === 0) {
        throw new Error('CSV file has no columns');
      }

      // Validate all records have the same columns
      for (let i = 0; i < records.length; i++) {
        const recordColumns = Object.keys(records[i]);
        if (recordColumns.length !== columns.length) {
          throw new Error(`Row ${i + 1} has inconsistent number of columns`);
        }
      }

      // 3. Infer column types from data
      const columnTypes: ColumnInfo[] = columns.map(col => {
        const values = records.map(r => r[col]);
        const dataType = this.inferColumnType(values);
        return {
          name: this.sanitizeIdentifier(col),
          dataType,
        };
      });

      // 4. Create metadata in Prisma
      dataset = await this.prisma.dataset.create({
        data: {
          name: body.name,
          userId: body.userId,
        },
      });

      const tableName = `dataset_${dataset.id.replace(/-/g, '')}`;

      table = await this.prisma.datasetTable.create({
        data: {
          name: tableName,
          datasetId: dataset.id,
          rowCount: records.length,
        },
      });

      // 5. Connect to PostgreSQL
      client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();

      // 6. Create table with inferred types
      const columnDefinitions = columnTypes.map(col =>
        `"${col.name}" ${this.mapToPostgresType(col.dataType)}`
      ).join(', ');

      const createTableSQL = `
        CREATE TABLE "${tableName}" (
          id SERIAL PRIMARY KEY,
          ${columnDefinitions}
        );
      `;

      await client.query(createTableSQL);

      // 7. Insert rows in batches (500 rows per batch)
      const BATCH_SIZE = 500;
      let insertedRows = 0;

      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);

        // Build multi-row insert
        const valuePlaceholders: string[] = [];
        const allValues: any[] = [];
        let paramIndex = 1;

        for (const row of batch) {
          const rowValues = columnTypes.map(col => {
            const originalColName = columns.find(c => this.sanitizeIdentifier(c) === col.name);
            const value = row[originalColName!];

            // Convert values based on type
            if (value === null || value === undefined || value === '') {
              return null;
            }

            switch (col.dataType) {
              case 'INT':
                return parseInt(value, 10);
              case 'FLOAT':
                return parseFloat(value);
              case 'BOOL':
                return ['true', 'yes', '1'].includes(value.toLowerCase());
              case 'DATE':
                return value;
              default:
                return value;
            }
          });

          const placeholders = rowValues.map(() => `$${paramIndex++}`).join(', ');
          valuePlaceholders.push(`(${placeholders})`);
          allValues.push(...rowValues);
        }

        const insertSQL = `
          INSERT INTO "${tableName}" (${columnTypes.map(c => `"${c.name}"`).join(', ')})
          VALUES ${valuePlaceholders.join(', ')}
        `;

        await client.query(insertSQL, allValues);
        insertedRows += batch.length;
      }

      // 8. Save column metadata
      await this.prisma.datasetColumn.createMany({
        data: columnTypes.map((col, index) => ({
          name: columns[index], // Use original column name
          dataType: col.dataType,
          isNullable: true,
          datasetId: dataset.id,
          tableId: table.id,
        })),
      });

      await client.end();
      client = null;

      return {
        datasetId: dataset.id,
        tableId: table.id,
        tableName: table.name,
        rowsInserted: insertedRows,
        columns: columnTypes.map((col, index) => ({
          name: columns[index],
          type: col.dataType,
        })),
      };

    } catch (error) {
      // Rollback on error
      if (client) {
        try {
          if (table) {
            await client.query(`DROP TABLE IF EXISTS "${table.name}" CASCADE`);
          }
        } catch (dropError) {
          console.error('Error dropping table during rollback:', dropError);
        }
        await client.end();
      }

      if (table) {
        try {
          await this.prisma.datasetTable.delete({ where: { id: table.id } });
        } catch (deleteError) {
          console.error('Error deleting table metadata during rollback:', deleteError);
        }
      }

      if (dataset) {
        try {
          await this.prisma.dataset.delete({ where: { id: dataset.id } });
        } catch (deleteError) {
          console.error('Error deleting dataset during rollback:', deleteError);
        }
      }

      throw new Error(`Dataset upload failed: ${error.message}`);
    }
  }
}
