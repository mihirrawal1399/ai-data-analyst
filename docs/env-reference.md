# Environment Reference

Use this as the canonical env configuration for current code.

## Shared / backend

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_data_analyst
DATABASE_SSL=false
API_SERVICE_KEY=change_me_service_key
```

## API (`apps/api`)

```env
API_PORT=4000
MCP_DB_PORT=5001
MCP_DB_URL=http://localhost:5001/mcp_db

LLM_PROVIDER=HARD_CODED
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=2000
LLM_TEMPERATURE=0.1

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
GROQ_API_KEY=
COHERE_API_KEY=
NVIDIA_NIM_API_KEY=
GITHUB_TOKEN=
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.1:8b
```

## MCP DB (`apps/mcp-db`)

```env
MCP_DB_PORT=5001
MCP_DB_QUERY_LIMIT=200
# ROOT_ENV_PATH=./.env
```

## Worker (`apps/worker`)

```env
API_BASE_URL=http://localhost:4000
WORKER_POLL_INTERVAL=60000
WORKER_LOG_LEVEL=info
```

## Web (`apps/web`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=change_me_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```
