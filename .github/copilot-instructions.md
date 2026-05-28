# Copilot instructions — NxWarehouse (whs-app)

Quick reference for Copilot sessions in this repo.

## Build, test, and lint commands
- Install dependencies: `npm install` (Bun users: `bun install` — repo contains `bun.lock`).
- Start dev server (frontend): `npm run dev` — Vite serves the app (default http://localhost:5173).
- Build production bundle: `npm run build`.
- Preview production build: `npm run preview`.
- Lint: `npm run lint` (auto-fix: `npm run lint:fix`).
- Type-check: `npm run typecheck` (this uses `jsconfig.json` in this repo).
- Tests: Vitest is configured in this repository.
  - Run all tests: `npm run test`
  - Run in watch mode: `npm run test:watch`
  - Coverage report: `npm run test:coverage`
  - Run a single test file: `npx vitest path/to/file`
  - Run a single test by name: `npx vitest -t "test name"`

## High-level architecture (big picture)
- Frontend: React + TypeScript, built with Vite. Mobile-first, PWA-ready (service worker, manifest, IndexedDB caching). UI uses Tailwind, Radix UI primitives, Lucide icons and Framer Motion-like motion libs.
- Data & state: React Query (tanstack) for server state; forms via react-hook-form + zod for validation.
- Backend (expected): README documents an Express server running on Bun with Prisma + SQLite or Postgres in production, but this repository appears to include only the frontend application (no explicit Express server files found). If a backend is present in other deployment artifacts, look for a `server/` or `api/` package or instructions in deployment docs.
- Key external SDKs: `@base44/sdk` and `@base44/vite-plugin` are integrated; barcode scanning and PWA features are primary runtime concerns.

## Key repository conventions
- Mobile-first UI and scanner-first UX: components and pages are optimized for small screens and keyboard/hardware-scanner input patterns.
- Styling: Tailwind CSS is used; utility classes are preferred over custom CSS files except for global layout.
- Component primitives: Radix UI primitives + accessible patterns are used across components.
- Type checking: TypeScript is enforced via `npm run typecheck` which references `jsconfig.json` rather than `tsconfig.json` in this repo.
- Data fetching: Use React Query for server interactions; cache and background refetch patterns are common.
- Forms & validation: react-hook-form + zod schema validation.
- Lockfile: A `bun.lock` exists — the project likely targets Bun but npm/pnpm/yarn work for local development. Prefer Bun in production/CI if available.
- Tests: Vitest is configured; use `npm run test` and related commands above.

## Where to look for important flow/code
- src/ — main React app entry, routes, and pages.
- public/ — static assets and PWA manifest/service worker registration.
- jsconfig.json — typecheck configuration and path aliases.
- README.md — high-level architecture, feature list and deployment notes (copied into this file where relevant).

## AI / assistant config files checked
- No CONTRIBUTING.md, CLAUDE.md, AGENTS.md, AIDER_CONVENTIONS.md, or other assistant-specific rule files were found.

---

If useful, ask to configure MCP servers (example: Playwright for end-to-end web tests) and which test runner to use. Otherwise confirm if more detail is needed for specific subsystems (scanner, PWA, or backend).