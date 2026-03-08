# MCP Tools

Current status in this repository:

## 1) MCP Database Tool (`apps/mcp-db`)

Purpose:
- Safe, controlled DB access for agent workflows.

Endpoint:
- `POST /mcp_db`

Request shape:

```json
{
  "tool": "database",
  "action": "executeQuery",
  "params": { "sql": "SELECT * FROM table LIMIT 10" }
}
```

Supported actions:
- `ping`
- `getSchema`
- `getTables`
- `getColumns`
- `describeTable`
- `executeQuery`
- `getDatasetTable`

Security constraints:
- Read-only SQL intent
- Validation and error wrapping
- Query row limits via env (`MCP_DB_QUERY_LIMIT`)

## 2) MCP Email Tool (`apps/mcp-email`)

Status:
- Placeholder only in this repo right now.
- No runtime server implementation yet.

## Interaction flow

```text
API Agent -> MCP DB Tool -> PostgreSQL
Worker -> API -> Agent -> MCP DB Tool -> PostgreSQL
```
