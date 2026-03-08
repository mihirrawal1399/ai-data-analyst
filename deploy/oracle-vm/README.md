# Oracle VM Deployment Files

This folder contains deployment artifacts specifically for an Oracle Cloud Always Free VM.

## Files

- `docker-compose.oracle-vm.yml`
- `Dockerfile.api`
- `Dockerfile.mcp-db`
- `Dockerfile.worker`
- `nginx.conf`

## Required VM-side `.env`

Create `deploy/oracle-vm/.env` on the VM with:

```env
DATABASE_URL=<neon_connection_string>
DATABASE_SSL=true

API_PORT=4000
MCP_DB_PORT=5001
MCP_DB_URL=http://mcp-db:5001/mcp_db
API_SERVICE_KEY=<shared_secret>

API_BASE_URL=http://api:4000
WORKER_POLL_INTERVAL=60000
WORKER_LOG_LEVEL=info

LLM_PROVIDER=HARD_CODED
# For BYOK testing:
# LLM_PROVIDER=OPENAI
# OPENAI_API_KEY=<key>
```

## Start

From repo root on VM:

```bash
docker compose -f deploy/oracle-vm/docker-compose.oracle-vm.yml up -d --build
```

API will be exposed through Nginx on port 80.
