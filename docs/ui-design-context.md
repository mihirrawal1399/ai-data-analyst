# AI Data Analyst - UI Design Context

## Overview
AI Data Analyst is a SaaS platform allowing users to upload datasets, query them with natural language, and generate AI-powered insights and dashboards.
The design aesthetic is **Vaporwave / Blackrock**, characterized by dark backgrounds, neon accents (cyan, fuchsia), glassmorphism, and a professional yet futuristic feel.

## Design System Tokens

### Colors
- **Background**: `#0a0a0f` (Deep space black)
- **Primary**:
  - Cyan: `#00e0e0` (Action buttons, highlights)
  - Fuchsia: `#ff68a6` (Accents, gradients)
  - Purple: `#8a5cff` (Glows, borders)
- **Surface**: `rgba(255, 255, 255, 0.05)` (Cards, panels)
- **Text**:
  - Headings: `text-white` or gradient clip
  - Body: `text-slate-400`

### Typography
- Font: Inter (sans-serif)
- Headings: Bold/Extrabold, often tracking-tight
- Monospace: Used for data numbers and IDs

### Spacing System
- `p-4` / `p-6`: Standard card padding
- `gap-4` / `gap-6`: Standard grid/flex gaps
- `h-12`: Standard input/button height (large touch targets)

---

## Page Inventory & User Flows

### 1. Public Pages
- **Home (`/`)**: Marketing landing page. Hero section, features, CTAs.
- **Login (`/login`)**: Email/password + Guest demo access.
- **Signup (`/signup`)**: Account creation.

### 2. Core Workflow (Authenticated)
- **Dashboard List (`/dashboards`)**:
  - Entry point after login.
  - View created dashboards.
  - Empty state encourages creating a dataset first.

- **Datasets Management (`/datasets`)**:
  - View uploaded CSVs.
  - Upload new datasets.
  - Delete datasets.

- **Dataset Exploration (`/datasets/[id]`)**:
  - Dataset metadata (rows, size).
  - Quick actions: Query, Insights, Create Chart.
  - **Missing**: Data preview table (currently a placeholder).

- **Query Interface (`/query`)**:
  - Chat-like interface for NL-to-SQL.
  - Select dataset -> Ask question -> View result/chart.
  - Sidebar for query history.

- **Automations (`/automations`)**:
  - Schedule recurring insight reports.
  - View execution results timeline.

---

## UI/UX Patterns
- **Glassmorphism**: Cards use `bg-slate-900/60` with `backdrop-blur` to separate content from the complex background.
- **Gradients**: Buttons and text often use `bg-gradient-to-r` to guide attention.
- **Motion**: `animate-in fade-in slide-in` used on page loads for a premium feel.

## Current UX Pain Points for Analysis
1. **Empty States**: Users landing on Dashboards with no data need a stronger "onboarding" path.
2. **Navigation**: No global sidebar or topbar is consistently implemented layout-wide (each page implements its own header often).
3. **Data Preview**: Users cannot verify CSV content before querying.
4. **Mobile Experience**: Tables and charts may need better adaptive layouts.

## Guidelines for AI UX Analysis
When analyzing this UI, focus on:
- Reducing clicks to insight.
- Improving the "blank slate" experience.
- Enhancing data density without cluttering the Vaporwave aesthetic.
- Accessibility of high-contrast neon text on dark backgrounds.
