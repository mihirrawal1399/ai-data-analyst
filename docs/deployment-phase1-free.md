# Deployment Guide - Phase 1 (Zero Cost)

This guide targets a near-zero-cost deployment:

- Web: Vercel Hobby
- Database: Neon Free
- Backend services (`api`, `mcp-db`, `worker`): Oracle Cloud Always Free VM

## 1. Architecture

```text
User -> Vercel (Next.js web)
     -> Oracle VM (Nginx + api + mcp-db + worker)
     -> Neon Postgres
```

Why this shape:
- Worker must stay alive for polling/scheduling.
- Many free container platforms sleep; a free always-on VM avoids missed automations.

## 2. VM setup (one-time)

On Oracle VM install:
- Docker
- Docker Compose plugin
- Git

Clone the repo:

```bash
git clone <your-repo-url> /opt/ai-data-analyst
cd /opt/ai-data-analyst
```

Create VM env file:

```bash
cp docs/env.oracle-vm.example deploy/oracle-vm/.env
# edit deploy/oracle-vm/.env with real values
```

Start stack:

```bash
docker compose -f deploy/oracle-vm/docker-compose.oracle-vm.yml up -d --build
```

## 3. Service exposure

- Nginx exposes API on VM port `80`.
- `mcp-db` remains private inside Docker network.

Map DNS:
- `api.yourdomain.com` -> Oracle VM public IP

## 4. Vercel web deployment

Deploy `apps/web` in Vercel and set:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://<your-vercel-domain>
NEXTAUTH_SECRET=<strong_secret>
```

## 5. GitHub Actions CD (Oracle VM)

Workflow file:
- `.github/workflows/cd-oracle-vm.yml`

Required GitHub secrets:
- `ORACLE_VM_HOST`
- `ORACLE_VM_PORT` (usually `22`)
- `ORACLE_VM_USER`
- `ORACLE_VM_SSH_KEY`
- `VM_REPO_URL`
- `VM_APP_DIR` (optional, defaults to `/opt/ai-data-analyst`)

What it does on every push to `main`:
1. SSH into VM
2. Clone repo if missing
3. Pull latest `main`
4. Run `docker compose ... up -d --build --remove-orphans`

## 6. Post-deploy checks

- Open web app and create guest session.
- Upload demo CSV and run queries.
- Verify `GET /mcp/db/health` on API.
- Create one automation and confirm worker executes it.

## 7. Limits and scale path

- Vercel Hobby is for personal/non-commercial usage.
- For heavier usage, move backend to paid managed containers and add queue/observability.
