# Fly.io Deployment

This is the recommended low-cost deployment path for the resume/demo version of AI Data Analyst.

## Target Stack

- `apps/web`: Vercel Hobby
- Postgres: Neon Free
- `apps/api`: Fly.io Machine
- `apps/mcp-db`: Fly.io private Machine
- `apps/worker`: Fly.io Machine

The MCP DB tool stays private on Fly's internal network. Only the API is public.

## Estimated Cost

For resume/experimental usage, expect roughly `$7-12/month` on Fly before taxes/region variance:

- API: `shared-cpu-1x`, `512MB`
- MCP DB: `shared-cpu-1x`, `256MB`
- Worker: `shared-cpu-1x`, `256MB`

Vercel and Neon should stay free for light demo usage. If the API needs `1GB`, budget closer to `$10-16/month`.

## One-Time Setup

Install Fly CLI:

```bash
winget install Fly.Flyctl
```

Log in:

```bash
fly auth login
```

Create the apps:

```bash
fly apps create aida-api
fly apps create aida-mcp-db
fly apps create aida-worker
```

If any app name is taken, choose another name and update:

- `deploy/fly/fly.api.toml`
- `deploy/fly/fly.mcp-db.toml`
- `deploy/fly/fly.worker.toml`
- `.github/workflows/cd-fly.yml` if the API app name changes

## Secrets

Set shared backend secrets directly on Fly:

```bash
fly secrets set DATABASE_URL="<neon_connection_string>" API_SERVICE_KEY="<strong_random_key>" --config deploy/fly/fly.api.toml
fly secrets set DATABASE_URL="<neon_connection_string>" --config deploy/fly/fly.mcp-db.toml
fly secrets set API_SERVICE_KEY="<strong_random_key>" --config deploy/fly/fly.worker.toml
```

For zero-cost AI smoke testing:

```bash
fly secrets set LLM_PROVIDER="HARD_CODED" --config deploy/fly/fly.api.toml
```

For BYOK testing, set the provider and key:

```bash
fly secrets set LLM_PROVIDER="OPENAI" OPENAI_API_KEY="<key>" --config deploy/fly/fly.api.toml
```

## Deploy

Deploy MCP DB first, then API, then worker:

```bash
fly deploy --config deploy/fly/fly.mcp-db.toml
fly deploy --config deploy/fly/fly.api.toml
fly deploy --config deploy/fly/fly.worker.toml
```

The API Dockerfile runs `pnpm --filter api prisma migrate deploy` on startup.

## Web on Vercel

Deploy `apps/web` on Vercel and set:

```env
NEXT_PUBLIC_API_URL=https://aida-api.fly.dev
NEXTAUTH_URL=https://<your-vercel-domain>
NEXTAUTH_SECRET=<strong_secret>
```

## GitHub CD

The Fly CD workflow deploys all three Fly apps when code is pushed to `main`.

Required repository secret:

- `FLY_API_TOKEN`

Fly app secrets such as `DATABASE_URL`, `API_SERVICE_KEY`, and provider keys are set directly on Fly with `fly secrets set` during one-time setup.

Create an org-scoped token so the workflow can deploy all three apps:

```bash
fly tokens create org --name "aida-github-cd" --expiry 2160h
```

## Smoke Checks

```bash
curl https://aida-api.fly.dev/
curl https://aida-api.fly.dev/mcp/db/health
fly logs --app aida-worker
```
