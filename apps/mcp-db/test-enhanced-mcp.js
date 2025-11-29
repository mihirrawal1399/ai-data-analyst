// Test script for MCP DB Tool enhancements
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.MCP_DB_PORT;
const baseUrl = `http://localhost:${port}/mcp_db`;

async function testMCP() {
    console.log('Testing MCP DB Tool Enhancements...\n');

    // Test 1: Ping
    console.log('1. Testing ping...');
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
        console.log('   ✓ Ping:', data);
    } catch (err) {
        console.error('   ✗ Ping failed:', err.message);
    }

    // Test 2: Validation Error (missing param)
    console.log('\n2. Testing validation error (missing tableName)...');
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool: 'database',
                action: 'getColumns',
                params: {}
            })
        });
        const data = await response.json();
        console.log('   Error response:', data);
        if (data.error && data.code === 'VALIDATION_ERROR') {
            console.log('   ✓ Validation error handling works!');
        }
    } catch (err) {
        console.error('   ✗ Test failed:', err.message);
    }

    // Test 3: Unknown Action Error
    console.log('\n3. Testing unknown action error...');
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool: 'database',
                action: 'unknownAction',
                params: {}
            })
        });
        const data = await response.json();
        console.log('   Error response:', data);
        if (data.error && data.code === 'NOT_FOUND') {
            console.log('   ✓ Unknown action error handling works!');
        }
    } catch (err) {
        console.error('   ✗ Test failed:', err.message);
    }

    // Test 4: Dataset Table Mapping (if dataset exists)
    console.log('\n4. Testing dataset table mapping...');
    console.log('   Note: This requires a valid dataset UUID in your database.');
    console.log('   Skipping for now - test manually with real dataset ID.');

    console.log('\n✅ Basic tests completed!');
}

testMCP().catch(console.error);
