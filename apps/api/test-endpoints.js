// Test script for API endpoints
import * as dotenv from 'dotenv';
dotenv.config();

const apiUrl = process.env.API_URL || 'http://localhost:4000';

async function testEndpoints() {
    console.log('Testing API Endpoints...\n');

    // Test 1: MCP Health Check
    console.log('1. Testing GET /mcp/db/health...');
    try {
        const response = await fetch(`${apiUrl}/mcp/db/health`);
        const data = await response.json();
        console.log('   ✓ Health check:', data);
    } catch (err) {
        console.error('   ✗ Health check failed:', err.message);
    }

    // Test 2: Agent Query (requires valid dataset)
    console.log('\n2. Testing POST /agent/query...');
    console.log('   Note: This requires a valid datasetId in your database');

    const testQuery = {
        datasetId: 'YOUR_DATASET_ID_HERE', // Replace with real ID
        question: 'Show me the first 5 records',
        limit: 5
    };

    try {
        const response = await fetch(`${apiUrl}/agent/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testQuery)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('   ✓ Query succeeded!');
            console.log('   SQL:', data.sql);
            console.log('   Rows:', data.results.rowCount);
        } else {
            const error = await response.json();
            console.log('   ⚠ Query failed (expected if dataset not found):', error);
        }
    } catch (err) {
        console.error('   ✗ Query request failed:', err.message);
    }

    console.log('\n✅ Endpoint tests completed!');
}

testEndpoints().catch(console.error);
