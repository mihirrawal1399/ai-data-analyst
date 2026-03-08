# System Architecture

This file reflects the current implementation.

## Goals

- Natural language to SQL with safe execution
- Dataset upload and dynamic table mapping
- Charts, dashboards, and automation workflows
- Guest and free auth flows with quota guardrails

## High-level

```text
Next.js Web
  -> NestJS API
    -> Agent service
      -> MCP DB tool
        -> PostgreSQL

Worker (polling)
  -> API automations endpoints
```

## Components

### Web (`apps/web`)
- Dataset upload, query, chart, dashboard, automation UI
- NextAuth credential flow + guest session route

### API (`apps/api`)
- Domain modules: datasets, queries, charts, dashboards, automations, auth
- Agent orchestration and provider abstraction
- Guardrails: auth guard, role guard, quota guard

### MCP DB (`apps/mcp-db`)
- Independent Fastify service
- Safe DB operations over `/mcp_db`

### Worker (`apps/worker`)
- Polls due automations from API
- Executes and updates scheduling metadata
- Handles retries/failures without process crash

### Database
- Prisma-managed app tables + dynamic dataset tables

## Notes

- `apps/mcp-email` is currently a placeholder.
- Worker currently uses polling (not queue/BullMQ runtime).
