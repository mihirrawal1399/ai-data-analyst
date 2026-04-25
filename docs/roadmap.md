# Project Roadmap

This roadmap captures what is done and what is next.

## Completed foundation

- Turborepo monorepo setup
- `apps/web` (Next.js)
- `apps/api` (NestJS)
- `apps/mcp-db` (safe DB tool)
- `apps/worker` (polling automation worker)
- Shared types package

## Completed core modules

- Dataset upload pipeline with type inference + dynamic tables
- NL -> SQL flow through agent + MCP DB
- Charts + dashboards
- Automation CRUD + scheduling + execution history
- Guest/free auth and quota guards
- Insights generation layer

## Current deploy target

- Web on Vercel Hobby
- DB on Neon Free
- API + MCP DB + Worker on Fly.io Machines

## Next after launch

- Dashboard-aware conversational chat UX
- Relational chat history tied to dashboards, charts, datasets, and queries
- Optional `pgvector` semantic recall after chat/report history becomes large
- Paid plans and billing
- Team workspaces
- Observability and scaling hardening
- Queue or scheduled-job worker architecture for higher throughput
