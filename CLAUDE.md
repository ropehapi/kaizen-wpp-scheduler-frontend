# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server with HMR on port 5173
npm run build        # Production build to dist/
npm run lint         # ESLint
npm run test         # Vitest single run
npm run test:watch   # Vitest watch mode
```

Run a single test file:
```bash
npx vitest run src/test/example.test.ts
```

Docker:
```bash
docker compose up -d --build   # Build and start (port 3000)
docker compose down
```

> `VITE_API_BASE_URL` is injected at **build time**. Changing it requires a rebuild.

## Architecture

React 18 + TypeScript SPA built with Vite. All routes are wrapped in `AppLayout` (sidebar + content area). State management for server data is handled exclusively through React Query; there is no global client-side state store.

**Data flow**: `pages/` → `hooks/useSchedules.ts` (React Query) → `services/api.ts` (Axios) → backend at `VITE_API_BASE_URL` (default: `http://localhost:8080/api/v1`)

Key layers:
- `src/pages/` — route-level components (default exports)
- `src/components/` — reusable UI components (named exports); `components/ui/` is managed by **shadcn/ui — do not edit directly**
- `src/hooks/useSchedules.ts` — all React Query hooks for schedule CRUD
- `src/services/api.ts` — Axios instance with JWT interceptor + all API endpoint functions
- `src/types/api.ts` — shared TypeScript types (`Schedule`, `Contact`, `APIResponse<T>`, `PaginatedResponse<T>`)

Path alias `@/` maps to `src/`.

## Adding shadcn/ui components

```bash
npx shadcn-ui@latest add <component-name>
```

Configuration is in `components.json`.

## Ecosystem

This frontend consumes **kaizen-wpp-scheduler-backend** (Go REST API, port 8080). The broader system also includes **messaging-officer** (WhatsApp/Baileys bridge, port 3000) and **kaizen-secretary** (cron worker).

## Conventions

- Form validation: Zod schemas defined inline within the page component
- Notifications: `toast()` from `hooks/use-toast` on mutation success/error
- CSS: Tailwind utility classes; use `cn()` from `lib/utils.ts` for conditional merging
- Dates: formatted with `date-fns` using `pt-BR` locale
