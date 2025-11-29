# AI Data Analyst - Development Commands

Comprehensive command reference for the monorepo, organized by project and use case.

---

## Table of Contents
- [Monorepo Commands](#monorepo-commands)
- [API (NestJS) Commands](#api-nestjs-commands)
- [MCP DB Tool Commands](#mcp-db-tool-commands)
- [Database & Prisma](#database--prisma)
- [Testing](#testing)
- [Maintenance & Cleanup](#maintenance--cleanup)
- [Environment Setup](#environment-setup)

---

## Monorepo Commands

### Installation
```bash
# Install all dependencies across the monorepo
pnpm install
```

### Development (All Projects)
```bash
# Run all projects in development mode (parallel)
pnpm dev

# Alternative: using turbo directly
turbo run dev --parallel
```

### Build All
```bash
# Build all projects
pnpm build

# Alternative: using turbo
turbo run build
```

### Lint & Format
```bash
# Lint all projects
pnpm lint

# Format all projects
pnpm format
```

---

## API (NestJS) Commands

### From Root Directory

```bash
# Development (watch mode)
pnpm --filter api dev
# OR
pnpm --filter api start:dev

# Production start
pnpm --filter api start:prod

# Build
pnpm --filter api build

# Run tests
pnpm --filter api test

# Run tests in watch mode
pnpm --filter api test:watch

# Run tests with coverage
pnpm --filter api test:cov

# Run e2e tests
pnpm --filter api test:e2e

# Lint and fix
pnpm --filter api lint

# Format code
pnpm --filter api format

# Debug mode
pnpm --filter api start:debug
```

### From `apps/api/` Directory

```bash
# Development
pnpm dev
# OR
pnpm start:dev

# Production
pnpm start:prod

# Build
pnpm build

# Tests
pnpm test
pnpm test:watch
pnpm test:cov

# Lint & Format
pnpm lint
pnpm format
```

### API Testing Scripts

```bash
# From apps/api/
node test-endpoints.js          # Test agent query and health endpoints
node test-api-health.js         # Test API health only
```

---

## MCP DB Tool Commands

### From Root Directory

```bash
# Development (TypeScript watch mode)
pnpm --filter mcp-db dev

# Build
pnpm --filter mcp-db build

# Production start (requires build first)
pnpm --filter mcp-db start
```

### From `apps/mcp-db/` Directory

```bash
# Development (ts-node)
pnpm dev
# OR
npm run dev

# Build TypeScript
pnpm build
# OR
npm run build

# Production start (compiled)
pnpm start
# OR
npm start

# Quick start for development
npm start       # Runs compiled version
```

### MCP DB Testing

```bash
# From apps/mcp-db/
node test-mcp.js                # Test MCP DB tool endpoints
node test-enhanced-mcp.js       # Test enhanced features (errors, validation)
```

---

## Database & Prisma

### Prisma Commands

#### From Root Directory

```bash
# Generate Prisma client
pnpm --filter api prisma generate

# Run migrations
pnpm --filter api prisma migrate dev

# Run specific migration
pnpm --filter api prisma migrate dev --name init

# Pull database schema
pnpm --filter api prisma db pull

# Push schema changes (without migration)
pnpm --filter api prisma db push

# Open Prisma Studio
pnpm --filter api prisma studio

# Reset database (⚠️ deletes all data)
pnpm --filter api prisma migrate reset

# Format schema file
pnpm --filter api prisma format

# Validate schema file
pnpm --filter api prisma validate
```

#### From `apps/api/` Directory

```bash
# All prisma commands work the same
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma migrate dev --name add_users_table
pnpm prisma db pull
pnpm prisma studio
pnpm prisma migrate reset
```

### Direct Database Access

```bash
# Using pg client (if needed)
# Set DATABASE_URL in .env first
psql $DATABASE_URL
```

---

## Testing

### Unit Tests

```bash
# API unit tests
pnpm --filter api test

# Watch mode
pnpm --filter api test:watch

# With coverage
pnpm --filter api test:cov
```

### Integration Tests

```bash
# API e2e tests
pnpm --filter api test:e2e

# MCP DB tool tests
cd apps/mcp-db
node test-mcp.js
```

### Manual Testing

```bash
# Test API health
curl http://localhost:4000/health

# Test MCP DB health
curl http://localhost:5001/health
# OR
curl http://localhost:5001/mcp_db -X POST -H "Content-Type: application/json" \
  -d '{"tool":"database","action":"ping","params":{}}'

# Test agent query
curl -X POST http://localhost:4000/agent/query \
  -H "Content-Type: application/json" \
  -d '{"datasetId":"your-uuid","question":"Show all records"}'

# Test MCP DB health from API
curl http://localhost:4000/mcp/db/health
```

---

## Maintenance & Cleanup

### Clean Node Modules

```bash
# Delete all node_modules (from root)
pnpm recursive exec -- rm -rf node_modules
rm -rf node_modules

# Alternative for Windows PowerShell
Get-ChildItem -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force
```

### Clean Lockfile

```bash
# Delete and regenerate lockfile
rm pnpm-lock.yaml
pnpm install
```

### Clean pnpm Store

```bash
# Prune unused packages from store
pnpm store prune

# Check store path
pnpm store path

# (Nuclear option) Delete entire store
# Find path first: pnpm store path
# Then manually delete the directory
# Windows: C:\Users\rawal\AppData\Local\pnpm\store\v3
```

### Clean Build Artifacts

```bash
# Clean API dist
rm -rf apps/api/dist

# Clean MCP DB dist
rm -rf apps/mcp-db/dist

# Rebuild everything
pnpm build
```

---

## Environment Setup

### PowerShell Execution Policy (Windows)

```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit environment variables
# Make sure to set:
# - DATABASE_URL
# - MCP_DB_PORT
# - MCP_DB_URL
```

### First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Generate Prisma client
pnpm --filter api prisma generate

# 4. Run migrations
pnpm --filter api prisma migrate dev

# 5. Build MCP DB tool
pnpm --filter mcp-db build

# 6. Start all services
pnpm dev
```

---

## Quick Reference

### Start Everything

```bash
# From root - starts API and MCP DB in parallel
pnpm dev
```

### Start Individual Services

```bash
# Terminal 1: API
pnpm --filter api dev

# Terminal 2: MCP DB
pnpm --filter mcp-db dev
```

### Stop Services

```bash
# Ctrl+C in each terminal
# OR killall node (Linux/Mac)
# OR taskkill /F /IM node.exe (Windows)
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port (Windows)
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Find process using port (Linux/Mac)
lsof -i :4000
kill -9 <PID>
```

### Module Not Found

```bash
# Regenerate node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Regenerate Prisma client
pnpm --filter api prisma generate
```

### Database Connection Issues

```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# Test connection
psql $DATABASE_URL

# Reset database
pnpm --filter api prisma migrate reset
```

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf apps/api/dist apps/mcp-db/dist
pnpm build

# Regenerate types
pnpm --filter api prisma generate
```

---

## Development Workflow

### Typical Flow

1. **Start services**
   ```bash
   pnpm dev
   ```

2. **Make changes to code**

3. **Test changes**
   ```bash
   # Run relevant tests
   pnpm --filter api test
   
   # Or test manually
   curl http://localhost:4000/agent/query -X POST ...
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: your changes"
   ```

### Adding Dependencies

```bash
# Add to API
pnpm add package-name --filter api

# Add to MCP DB
pnpm add package-name --filter mcp-db

# Add to root
pnpm add package-name -w

# Add dev dependency
pnpm add -D package-name --filter api
```

### Removing Dependencies

```bash
# Remove from API
pnpm remove package-name --filter api

# Remove from MCP DB
pnpm remove package-name --filter mcp-db
```

---

## Useful Utilities

### Project Structure Snapshot

```bash
# Generate project structure
node ./scripts/snapshot-structure.js
```

### Check Dependencies

```bash
# List all dependencies
pnpm list

# Check for outdated packages
pnpm outdated

# Update dependencies
pnpm update
```

---

## Production Deployment

### Build for Production

```bash
# Build all projects
pnpm build

# Verify builds
ls apps/api/dist
ls apps/mcp-db/dist
```

### Production Start

```bash
# Start API in production
cd apps/api
NODE_ENV=production pnpm start:prod

# Start MCP DB in production
cd apps/mcp-db
NODE_ENV=production pnpm start
```

### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start API
pm2 start apps/api/dist/main.js --name api

# Start MCP DB
pm2 start apps/mcp-db/dist/index.js --name mcp-db

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all
```
