import { Pool, PoolClient, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export class DbClient {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });

        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    async connect(): Promise<PoolClient> {
        return this.pool.connect();
    }

    async disconnect(): Promise<void> {
        await this.pool.end();
    }

    async query(text: string, params?: any[]): Promise<QueryResult> {
        return this.pool.query(text, params);
    }

    // Helper to sanitize identifiers (basic protection)
    sanitizeIdentifier(identifier: string): string {
        if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
            throw new Error(`Invalid identifier: ${identifier}`);
        }
        return `"${identifier}"`;
    }
}

export const db = new DbClient();
