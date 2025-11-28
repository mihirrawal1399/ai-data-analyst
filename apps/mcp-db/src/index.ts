import { startServer, DBTool } from './server';
import { loadEnv } from './utils/env';

loadEnv();

const PORT = parseInt(process.env.MCP_DB_PORT || '3001', 10);

async function main() {
    await startServer({
        tools: [DBTool],
        port: PORT
    });
}

main().catch(console.error);
