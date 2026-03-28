# NAVER Work - Task Manager

## Overview

A NAVER-themed internal task management tool for tracking work tickets, adding memos/comments, and managing related tasks. The application is built as a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data storage. The UI is in Korean and follows NAVER's green-themed design language with light/dark mode support.

The core domain revolves around five entities: **Tasks** (with ticket URLs, Epic hierarchy support via `isEpic`/`parentEpicId`), **Comments** (memos attached to tasks), **Task Relations** (linking related tasks), **Todos** (lightweight sticky-note style quick tasks), and **Quiz Questions** (Linux command quiz).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) — single page app with `/` as the main route
- **State Management**: TanStack React Query for server state; local React state for UI state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS custom properties for theming (NAVER green primary color `hsl(147, 100%, 39%)`), light/dark mode via class toggling
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js, running via `tsx` in development
- **API Design**: RESTful JSON API under `/api/` prefix
  - `/api/tasks` — CRUD for tasks (supports Epic fields: `isEpic`, `parentEpicId`)
  - `/api/comments` — comments management
  - `/api/relations` — task relation management
  - `/api/todos` — CRUD for quick todos (sticky notes)
  - `/api/quiz-questions` — CRUD for Linux command quiz
- **Validation**: Zod schemas (generated from Drizzle schemas via `drizzle-zod`) for request validation
- **Storage Pattern**: Interface-based storage (`IStorage`) with `DatabaseStorage` implementation, making it easy to swap implementations
- **Database seeding**: Automatic seed data on first run (Korean sample tasks related to card payment features)

### Database
- **Database**: PostgreSQL (required, connected via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `node-postgres` driver
- **Schema location**: `shared/schema.ts` — shared between frontend and backend
- **Schema push**: `npm run db:push` uses `drizzle-kit push` to sync schema to database
- **Tables**:
  - `tasks` — id (auto-increment), title, ticket_url, ticket_number, description, status (backlog/in_progress/review/completed), priority (high/medium/low), sort_order (integer, default 0), pr_url (nullable), is_epic (boolean, default false), parent_epic_id (nullable integer), created_at, completed_at (nullable)
  - `comments` — id, task_id (FK to tasks), content, created_at
  - `task_relations` — id, source_task_id, target_task_id
  - `favorite_links` — id, title, url, created_at
  - `todos` — id, content, completed (boolean), color (text), created_at
  - `quiz_questions` — id, question, answer, category, created_at

### Build & Development
- **Dev**: `npm run dev` — runs Express server with Vite dev middleware for HMR
- **Build**: `npm run build` — Vite builds the client to `dist/public`, esbuild bundles the server to `dist/index.cjs`
- **Production**: `npm start` — serves the built client as static files from Express
- **Vite dev server** is integrated as Express middleware (not standalone), with HMR over the same HTTP server

### Key Design Decisions
1. **Shared schema between client and server** — The `shared/` directory contains Drizzle table definitions and Zod schemas used for both backend validation and frontend type inference. This ensures type safety across the full stack.
2. **No authentication** — This is an internal tool without user authentication. All operations are public.
3. **Four-status workflow** — 4 tabs: 진행 전 (Backlog), 작업 중 (In Progress), 검토 중 (Review), 완료 (Completed). Review uses Eye icon with orange styling.
4. **NAVER branding** — Custom CSS variables create a NAVER-like visual identity with green primary colors and Korean-language UI.
5. **Dashboard widgets** — Right panel shows dashboard widgets (clock/weather, quick todos, favorite links, Replit usage) when no task is selected.
6. **Epic hierarchy** — Tasks can be marked as Epic (purple Crown badge). Epic tasks show expandable tree on the home screen main list — clicking the chevron reveals child tasks indented underneath with a violet left border and TreePine icon. Non-epic tasks can be assigned to an Epic via `parentEpicId`. Child tasks are hidden from the main list and only appear under their Epic parent when expanded.
7. **Todo tickets** — Tasks can be created as "Todo" type via a toggle in the create task dialog. Todo tasks have no issue URL, display an amber "Todo" badge instead of a ticket number, and use ListTodo icon. The `ticketUrl` is stored as empty string and `ticketNumber` as "TODO".
8. **Weekly report** — Markdown report generator supporting all 4 statuses (Done, Review, In Progress, Backlog) with grouping. Copy to clipboard.
9. **Linux command quiz** — Terminal-style quiz page (`/quiz`) with question management, score tracking, and category grouping.
10. **Priority-based ordering** — Tasks sorted by priority then sortOrder then createdAt. Drag-and-drop reordering.
11. **PR URL management** — Each task can have a Pull Request URL with indicator badge.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Connected via `DATABASE_URL` environment variable. Required for all functionality. Uses `pg` (node-postgres) connection pool.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: ORM and migration tooling for PostgreSQL
- **express** (v5): HTTP server framework
- **@tanstack/react-query**: Async server state management
- **wouter**: Client-side routing
- **zod** + **drizzle-zod**: Schema validation and type generation
- **react-hook-form**: Form state management
- **shadcn/ui components**: Full suite of Radix UI-based components (dialog, tabs, select, toast, etc.)
- **lucide-react**: Icon library
- **date-fns**: Date formatting utilities
- **connect-pg-simple**: PostgreSQL session store (available but sessions not currently implemented)
- **Replit plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for development on Replit

### Fonts
- Google Fonts: Noto Sans KR (Korean text), JetBrains Mono (monospace)