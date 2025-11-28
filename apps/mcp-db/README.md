# MCP Database Tool

This is a Model Context Protocol (MCP) tool for PostgreSQL database interactions.
It provides safe, read-only access to the database for AI agents.

## Setup

1. Copy `.env.example` to `.env` and update `DATABASE_URL`.
2. Install dependencies: `npm install`

## Build

```bash
npm run build
```

## Run

```bash
npm start
```

## Tools

The server exposes the following tools:

- `database`: Main tool for DB interaction.
  - Actions:
    - `getSchema`: List all tables and their schemas.
    - `getTables`: List all table names.
    - `getColumns`: List columns for a specific table.
    - `describeTable`: Get detailed table info.
    - `executeQuery`: Execute a safe SQL query (SELECT only).
    - `ping`: Check server status.

## Testing

Run the test script:

```bash
node test-mcp.js
```