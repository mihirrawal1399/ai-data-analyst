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

## Current deploy target (Phase 1)

- Web on Vercel Hobby
- DB on Neon Free
- API + MCP DB + Worker on Oracle Always Free VM

## Next after launch

- Conversational chat UX
- Paid plans and billing
- Team workspaces
- Observability and scaling hardening
- Optional queue-based worker architecture for higher throughput
