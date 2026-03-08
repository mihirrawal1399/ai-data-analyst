# Setup Guide

This setup reflects the current codebase state (web + api + mcp-db + worker).

## 1. Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 14+
- Git

Optional for AI testing:
- At least one provider API key (OpenAI/Anthropic/Groq/etc)
- Or `LLM_PROVIDER=HARD_CODED` for zero-cost local testing

## 2. Install

```bash
pnpm install
```

## 3. Environment

Create `.env` at the repository root and set at least:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_data_analyst
API_PORT=4000
MCP_DB_PORT=5001
MCP_DB_URL=http://localhost:5001/mcp_db
API_SERVICE_KEY=change_me_service_key
API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=change_me_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
LLM_PROVIDER=HARD_CODED
```

Notes:
- `MCP_DB_URL` must use `/mcp_db`.
- Worker and API must share the same `API_SERVICE_KEY`.

## 4. Database

```bash
pnpm --filter api prisma generate
pnpm --filter api prisma migrate dev
```

## 5. Run all services

```bash
pnpm dev
```

Expected services:
- `apps/web` (Next.js)
- `apps/api` (NestJS)
- `apps/mcp-db` (Fastify)
- `apps/worker` (automation poller)

## 6. Run individual services

```bash
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter mcp-db dev
pnpm --filter worker dev
```

## 7. Smoke checks

```bash
curl http://localhost:4000/
curl http://localhost:5001/health
curl http://localhost:4000/mcp/db/health
```

## 8. Known doc drift fixed here

- Worker is polling-based, not BullMQ/Redis.
- `apps/mcp-email` is currently a placeholder and is not part of runtime.
- Old endpoint examples using `/mcp_db_tool` are outdated; use `/mcp_db`.
