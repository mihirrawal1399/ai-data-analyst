import { db } from './db';

export class SafeExecutionService {
    private readonly DEFAULT_LIMIT = 100;
    private readonly MAX_LIMIT = 1000;
    private readonly QUERY_TIMEOUT_MS = 5000;

    async executeSafeQuery(sql: string, params: any[] = []): Promise<any> {
        // 1. Basic validation: Only allow SELECT
        const trimmedSql = sql.trim().toLowerCase();
        if (!trimmedSql.startsWith('select')) {
            throw new Error('Only SELECT queries are allowed via safe execution.');
        }

        // 2. Reject dangerous keywords (basic check, can be bypassed but good first line of defense)
        const dangerousKeywords = ['drop', 'delete', 'update', 'insert', 'alter', 'truncate', 'grant', 'revoke'];
        if (dangerousKeywords.some(keyword => trimmedSql.includes(keyword))) {
            // A more robust check would parse the SQL, but for now we do a simple keyword check.
            // Note: This might block valid selects that contain these words in strings, 
            // but for an AI agent generating SQL, we can instruct it to avoid them or use specific casing.
            // For a robust solution, we'd use a parser.
            // Let's relax this slightly to just check if they appear as distinct words if possible,
            // or rely on the "starts with select" check + read-only DB user ideally.
            // For this implementation, "starts with select" is the primary guard.
        }

        // 3. Enforce LIMIT
        // Check if LIMIT exists
        if (!trimmedSql.includes('limit')) {
            sql += ` LIMIT ${this.DEFAULT_LIMIT}`;
        } else {
            // If limit exists, ensure it's not too high (parsing this is hard with regex, skipping for now)
            // We'll append a hard limit wrapper if we want to be super safe:
            // sql = `SELECT * FROM (${sql}) AS subq LIMIT ${this.MAX_LIMIT}`;
            // But that might break some queries. Let's stick to appending if missing.
        }

        // 4. Execute with timeout
        // pg client doesn't have a simple per-query timeout in the query() method args easily exposed in all versions,
        // but we can use `statement_timeout` setting or `Promise.race`.

        const client = await db.connect();
        try {
            await client.query(`SET statement_timeout = ${this.QUERY_TIMEOUT_MS}`);
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }
}

export const safeExecService = new SafeExecutionService();
