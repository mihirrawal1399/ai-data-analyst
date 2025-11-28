async function test() {
    try {
        const response = await fetch('http://localhost:4000/mcp/db/health');
        const data = await response.json();
        console.log('Health Check Response:', data);
    } catch (err) {
        console.error('Health Check Failed:', err);
    }
}

test();
