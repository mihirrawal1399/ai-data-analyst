import { Pool, PoolClient, QueryResult } from 'pg';

export class DbClient {
    private pool: Pool | null = null;
    private isConnecting = false;
    private connectionPromise: Promise<void> | null = null;

    /**
     * Lazy initialization - only connect when first query is executed
     */
    private async ensureConnected(): Promise<void> {
        if (this.pool) return;

        // If already connecting, wait for that connection
        if (this.isConnecting && this.connectionPromise) {
            await this.connectionPromise;
            return;
        }

        this.isConnecting = true;
        this.connectionPromise = this.createConnection();

        try {
            await this.connectionPromise;
        } finally {
            this.isConnecting = false;
            this.connectionPromise = null;
        }
    }

    private async createConnection(): Promise<void> {
        console.log('[DbClient] Establishing database connection...');

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });

        this.setupEventHandlers();

        // Test the connection
        try {
            const client = await this.pool.connect();
            client.release();
            console.log('[DbClient] Database connection established');
        } catch (error) {
            console.error('[DbClient] Failed to establish connection:', error);
            await this.pool.end();
            this.pool = null;
            throw error;
        }
    }

    private setupEventHandlers(): void {
        if (!this.pool) return;

        this.pool.on('error', async (err) => {
            console.error('[DbClient] Unexpected pool error:', err);
            // Auto-reconnect on pool errors
            await this.reconnect();
        });
    }

    private async reconnect(): Promise<void> {
        console.log('[DbClient] Reconnecting to database...');

        // Close existing pool
        if (this.pool) {
            try {
                await this.pool.end();
            } catch (err) {
                console.error('[DbClient] Error closing pool:', err);
            }
            this.pool = null;
        }

        // Reset connection state and reconnect on next query
        this.isConnecting = false;
        this.connectionPromise = null;
    }

    async connect(): Promise<PoolClient> {
        await this.ensureConnected();
        if (!this.pool) {
            throw new Error('Database pool not initialized');
        }
        return this.pool.connect();
    }

    async disconnect(): Promise<void> {
        if (this.pool) {
            console.log('[DbClient] Closing database connection...');
            await this.pool.end();
            this.pool = null;
        }
    }

    async query(text: string, params?: any[]): Promise<QueryResult> {
        await this.ensureConnected();
        if (!this.pool) {
            throw new Error('Database pool not initialized');
        }
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

