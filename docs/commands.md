# Development Commands

## Monorepo

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## Per app

```bash
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter mcp-db dev
pnpm --filter worker dev
```

## Database (API)

```bash
pnpm --filter api prisma generate
pnpm --filter api prisma migrate dev
pnpm --filter api prisma migrate deploy
pnpm --filter api prisma studio
```

## Tests

```bash
pnpm --filter api test
```

## Basic health checks

```bash
curl http://localhost:4000/
curl http://localhost:5001/health
curl http://localhost:4000/mcp/db/health
```

## Important current behavior

- API root endpoint is `/` (no dedicated `/health` route yet).
- MCP DB endpoint is `/mcp_db`.
- Worker is polling-based and uses `API_SERVICE_KEY` via `x-api-key`.
- `apps/mcp-email` is currently not an active runtime service.
