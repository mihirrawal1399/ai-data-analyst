import { db } from './db';

export interface ColumnInfo {
    column_name: string;
    data_type: string;
    is_nullable: string;
    column_default: string | null;
}

export interface TableInfo {
    table_name: string;
    columns: ColumnInfo[];
}

export class SchemaService {
    async listTables(): Promise<string[]> {
        const sql = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
        const result = await db.query(sql);
        return result.rows.map(row => row.table_name);
    }

    async listColumns(tableName: string): Promise<ColumnInfo[]> {
        const sql = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = $1
      ORDER BY ordinal_position;
    `;
        const result = await db.query(sql, [tableName]);
        return result.rows;
    }

    async describeTable(tableName: string): Promise<TableInfo> {
        const columns = await this.listColumns(tableName);
        return {
            table_name: tableName,
            columns,
        };
    }

    async getSchema(): Promise<TableInfo[]> {
        const tables = await this.listTables();
        const schema: TableInfo[] = [];
        for (const table of tables) {
            const info = await this.describeTable(table);
            schema.push(info);
        }
        return schema;
    }
}

export const schemaService = new SchemaService();
