# Monorepo Folder Structure

Updated: 2025-11-23T13:56:38.997Z

```text
// Directory tree (3 levels, limited to 200 entries)
├── .vscode/
│     └── settings.json
├── apps/
│     ├── api/
│     │       ├── src/
│     │       │         ├── app.controller.spec.ts
│     │       │         ├── app.controller.ts
│     │       │         ├── app.module.ts
│     │       │         ├── app.service.ts
│     │       │         └── main.ts
│     │       ├── .env
│     │       ├── .prettierrc
│     │       ├── eslint.config.mjs
│     │       ├── nest-cli.json
│     │       ├── package.json
│     │       ├── pnpm-lock.yaml
│     │       ├── README.md
│     │       ├── tsconfig.build.json
│     │       └── tsconfig.json
│     ├── mcp-db/
│     │       ├── src/
│     │       └── README.md
│     ├── mcp-email/
│     │       ├── src/
│     │       └── README.md
│     ├── web/
│     │       ├── .next/
│     │       │         ├── dev/
│     │       │         └── types/
│     │       ├── public/
│     │       │         ├── file.svg
│     │       │         ├── globe.svg
│     │       │         ├── next.svg
│     │       │         ├── vercel.svg
│     │       │         └── window.svg
│     │       ├── src/
│     │       │         └── app/
│     │       ├── .gitignore
│     │       ├── eslint.config.mjs
│     │       ├── next-env.d.ts
│     │       ├── next.config.ts
│     │       ├── package.json
│     │       ├── pnpm-lock.yaml
│     │       ├── postcss.config.mjs
│     │       ├── README.md
│     │       └── tsconfig.json
│     └── worker/
│     │       ├── src/
│     │       └── README.md
├── docs/
│     ├── architecture.md
│     ├── commands.md
│     ├── mcp-tools.md
│     ├── monorepo-structure.md
│     ├── roadmap.md
│     ├── scripts.md
│     └── setup.md
├── packages/
│     ├── shared-types/
│     │       ├── index.ts
│     │       └── README.md
│     └── storage/
│     │       ├── index.js
│     │       └── README.md
├── scripts/
│     └── snapshot-structure.js
├── .env
├── .env.example
├── .gitattributes
├── .gitignore
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── turbo.json
```