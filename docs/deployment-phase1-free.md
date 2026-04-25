# Deployment Guide - Phase 1 (Low Cost)

This guide targets a low-cost deployment for resume/demo usage:

- Web: Vercel Hobby
- Database: Neon Free
- Backend services (`api`, `mcp-db`, `worker`): Fly.io Machines

## 1. Architecture

```text
User -> Vercel (Next.js web)
     -> Fly.io API app
        -> Fly.io private MCP DB app
        -> Neon Postgres
     -> Fly.io worker app -> Fly.io API app
```

Why this shape:
- Vercel is still the easiest and cheapest frontend host.
- Neon keeps Postgres managed and free for light usage.
- Fly.io supports always-on backend and worker processes without managing a VM.
- The MCP DB tool is private on Fly's internal network; only the API is public.

## 2. Fastest Path

Use `docs/deployment-fly.md` as the runbook.

## 3. Expected Cost

For resume/experimental usage, expect roughly `$7-12/month` on Fly before tax/region variance:

- API: `shared-cpu-1x`, `512MB`
- MCP DB: `shared-cpu-1x`, `256MB`
- Worker: `shared-cpu-1x`, `256MB`

If API memory needs to be raised to `1GB`, budget closer to `$10-16/month`.

## 4. Vercel Web Deployment

Deploy `apps/web` in Vercel and set:

```env
NEXT_PUBLIC_API_URL=https://aida-api.fly.dev
NEXTAUTH_URL=https://<your-vercel-domain>
NEXTAUTH_SECRET=<strong_secret>
```

## 5. GitHub Actions CD

Workflow file:

- `.github/workflows/cd-fly.yml`

Required GitHub secret:

- `FLY_API_TOKEN`

The workflow deploys the MCP DB app, API app, runs Prisma migrations on the API app, then deploys the worker app.

## 6. Scale Path

If this becomes real SaaS traffic:

- Increase API memory to `1GB` or `2GB`
- Convert worker polling into queue/scheduled jobs
- Add observability and error tracking
- Add `pgvector` memory for long-term semantic retrieval if dashboard chat history grows
