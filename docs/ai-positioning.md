# AI Positioning

AI Data Analyst is not trying to beat ChatGPT, Claude, or DeepSeek at general conversation. Those products are broad AI chat assistants. This project is a focused analytics product that wraps LLMs in a safer data workflow.

## What General AI Chats Already Do Well

Modern AI chats can analyze uploaded files, produce summaries, and create charts. ChatGPT-style tools are strong for ad-hoc data exploration, Claude-style tools are strong for artifact/report workflows, and DeepSeek-style tools are strong general-purpose reasoning and coding assistants.

Those products are excellent for ad-hoc work, but they are not the same thing as a deployable SaaS analytics backend.

## What This Product Does Differently

AI Data Analyst adds product and architecture around the model:

- Persistent users, guest sessions, and quotas
- Uploaded datasets stored in Postgres, not only temporary chat attachments
- Safe SQL execution through an MCP DB tool
- Chart and dashboard objects that survive beyond a single chat
- Automation results and scheduled analyses
- Backend/frontend separation suitable for SaaS deployment
- BYOK provider flexibility instead of hard dependency on one model vendor

The LLM is used as an analysis engine, not as the whole product.

## Dashboard And Chat Memory Strategy

For a dashboard chat, the first version should stay relational:

- `conversations`
- `messages`
- links to `datasetId`, `dashboardId`, `chartId`, and `queryId`
- saved SQL, chart config, and insight summaries

When a user asks a question from a dashboard, the agent should receive:

- recent messages
- dashboard metadata
- chart configs
- dataset schema
- prior query summaries

That is enough for MVP and keeps the system explainable.

## Why No Separate Vector DB Yet

A vector database is useful when the product needs semantic retrieval across lots of unstructured history, notes, reports, or documentation. For the current MVP, most state is structured and should stay in Postgres.

If chat history grows, the best upgrade path is `pgvector` inside Postgres/Neon:

- fewer moving parts than a separate vector DB
- same tenant/security boundary as the rest of the app data
- enough semantic retrieval for resume/demo and early SaaS usage

A separate vector DB becomes worth it later if we add large document collections, enterprise knowledge bases, cross-workspace semantic search, or very high retrieval scale.
