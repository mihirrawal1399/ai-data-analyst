import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Load environment variables for MCP DB Tool.
 * Precedence:
 *   1. Local .env in apps/mcp-db (if exists)
 *   2. ROOT_ENV_PATH if defined
 *   3. Root .env (../../../../.env)
 */
export function loadEnv(): void {
    const localEnvPath = path.resolve(__dirname, '../../.env');
    const rootEnvPath = process.env.ROOT_ENV_PATH
        ? path.resolve(process.env.ROOT_ENV_PATH)
        : path.resolve(__dirname, '../../../../.env');

    let envPath: string | undefined;
    if (fs.existsSync(localEnvPath)) {
        envPath = localEnvPath;
        console.log('[Env] Using local .env for MCP DB Tool:', envPath);
    } else if (fs.existsSync(rootEnvPath)) {
        envPath = rootEnvPath;
        console.log('[Env] Using root .env for MCP DB Tool:', envPath);
    } else {
        console.warn('[Env] No .env file found for MCP DB Tool. Relying on existing process.env.');
    }

    if (envPath) {
        const result = dotenv.config({ path: envPath });
        if (result.error) {
            console.error('[Env] Failed to load env file:', result.error);
        }
    }

    // Validate required variables for the tool
    const required = ['DATABASE_URL', 'MCP_DB_PORT'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
        throw new Error(`Missing required env vars for MCP DB Tool: ${missing.join(', ')}`);
    }
}
