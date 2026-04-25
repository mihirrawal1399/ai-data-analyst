# Deployment Checklist

This is the shortest path to a live low-cost deployment.

## 1. Create Neon Database

- Create a free Neon project.
- Copy the pooled connection string.
- Keep SSL enabled.

## 2. Create Fly Apps

Install and log in:

```bash
winget install Fly.Flyctl
fly auth login
```

Create apps:

```bash
fly apps create aida-api
fly apps create aida-mcp-db
fly apps create aida-worker
```

If a name is unavailable, choose a new name and update the matching files in `deploy/fly`.

## 3. Set Fly Secrets

```bash
fly secrets set DATABASE_URL="<neon_connection_string>" API_SERVICE_KEY="<strong_random_key>" --config deploy/fly/fly.api.toml
fly secrets set DATABASE_URL="<neon_connection_string>" --config deploy/fly/fly.mcp-db.toml
fly secrets set API_SERVICE_KEY="<strong_random_key>" --config deploy/fly/fly.worker.toml
```

Use hardcoded AI for zero-cost testing:

```bash
fly secrets set LLM_PROVIDER="HARD_CODED" --config deploy/fly/fly.api.toml
```

Or use BYOK live testing:

```bash
fly secrets set LLM_PROVIDER="OPENAI" OPENAI_API_KEY="<key>" --config deploy/fly/fly.api.toml
```

## 4. Deploy Backend

```bash
fly deploy --config deploy/fly/fly.mcp-db.toml
fly deploy --config deploy/fly/fly.api.toml
fly deploy --config deploy/fly/fly.worker.toml
```

The API container runs Prisma migrations on startup.

## 5. Check Backend

```bash
curl https://aida-api.fly.dev/
curl https://aida-api.fly.dev/mcp/db/health
fly logs --app aida-worker
```

## 6. Deploy Web on Vercel

Project settings:

- Root directory: `apps/web`
- Framework: Next.js

Vercel env vars:

```env
NEXT_PUBLIC_API_URL=https://aida-api.fly.dev
NEXTAUTH_URL=https://<your-vercel-domain>
NEXTAUTH_SECRET=<strong_secret>
```

## 7. Wire GitHub CD

Create a Fly org-scoped deploy token:

```bash
fly tokens create org --name "aida-github-cd" --expiry 2160h
```

Add repository secret:

- `FLY_API_TOKEN`

Then push to `main` to trigger `.github/workflows/cd-fly.yml`.

## 8. Smoke Test

- Open web URL.
- Create guest session.
- Upload a CSV.
- Run one query.
- Create one automation and wait for one worker cycle.
