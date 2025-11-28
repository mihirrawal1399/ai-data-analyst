// Load environment variables (root .env)
import * as dotenv from 'dotenv';
dotenv.config();

// Determine MCP DB tool URL using env variable
const port = process.env.MCP_DB_PORT;
const baseUrl = `http://localhost:${port}/mcp_db`;

async function test() {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool: 'database',
                action: 'ping',
                params: {}
            })
        });

        const data = await response.json();
        console.log('Ping response:', data);
    } catch (err) {
        console.error('Test failed:', err);
    }
}

test();
