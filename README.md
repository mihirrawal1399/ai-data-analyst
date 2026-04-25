# AI Data Analyst

Production-style AI data analysis platform built as a monorepo.

## What it does

- Upload CSV datasets
- Ask natural-language questions and run safe SQL
- Build charts and dashboards
- Run scheduled automations
- Support guest + free user flows with quota guards

## Monorepo apps

- `apps/web` - Next.js frontend
- `apps/api` - NestJS backend
- `apps/mcp-db` - safe DB access tool (`/mcp_db`)
- `apps/worker` - automation polling worker
- `apps/mcp-email` - placeholder (not active runtime)

## Quick start

```bash
pnpm install
pnpm --filter api prisma generate
pnpm --filter api prisma migrate dev
pnpm dev
```

## Docs

- Setup: `docs/setup.md`
- Architecture: `docs/architecture.md`
- Commands: `docs/commands.md`
- MCP tools: `docs/mcp-tools.md`
- Low-cost deploy: `docs/deployment-fly.md`
- Deployment checklist: `docs/deployment-checklist.md`
- AI positioning: `docs/ai-positioning.md`
- Environment reference: `docs/env-reference.md`

## Deploy artifacts

- Fly configs: `deploy/fly/fly.*.toml`
- Service Dockerfiles: `deploy/fly/Dockerfile.*`

## CI/CD

- CI: `.github/workflows/ci.yml`
- CD (Fly.io): `.github/workflows/cd-fly.yml`

## Notes

- For zero-cost AI testing, set `LLM_PROVIDER=HARD_CODED`.
- For BYOK live tests, provide your provider key and switch `LLM_PROVIDER`.
