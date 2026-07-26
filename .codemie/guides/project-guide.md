# Capstone-CodeMie Project Guide

This guide is the primary source of truth for all CodeMie agents working on this project.
Agents should read this file before any code analysis.

## Application Overview
A brownfield task-management web application used as a vehicle for demonstrating an AI-driven SDLC.
Users can register, login, create/read/update/delete items, filter by status, and search.

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite | React 18, TS 5.x |
| Routing | React Router | v6 |
| State | Zustand | latest |
| HTTP | Axios | latest |
| Backend | Node.js + Express + TypeScript | Node 20, Express 4 |
| Validation | Zod | latest |
| Auth | JWT (jsonwebtoken) | HS256 |
| Database | SQLite via better-sqlite3 | latest |
| E2E Tests | Playwright TypeScript | latest |
| CI | GitHub Actions | — |

## Architecture Pattern
```
frontend/src/
  api/        → Axios API client (client.ts, items.ts)
  components/ → Reusable UI components (ItemCard, SearchBar, Pagination…)
  pages/      → Route-level pages (Dashboard, Login, Register, NotFound)
  store/      → Zustand stores (authStore.ts)
  types/      → TypeScript interfaces (index.ts)

backend/src/
  routes/     → Express routers (auth.ts, items.ts, debug.ts)
  middleware/ → JWT auth guard (auth.ts)
  db/         → SQLite init + migrations (init.ts)
```

## API Conventions
- All responses: `{ success: boolean, data?: T, error?: string }`
- Auth: `Authorization: Bearer <jwt>` header
- Base URL: `http://localhost:4000/api`

## Key Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login, get JWT |
| GET | /api/items | Yes | List user's items |
| POST | /api/items | Yes | Create item |
| PUT | /api/items/:id | Yes | Update item (owner only) |
| DELETE | /api/items/:id | Yes | Delete item (owner only) |

## Testing Patterns
- Test framework: `@playwright/test`
- Pattern: Page Object Model (POM)
- Pages: `tests/e2e/pages/` (LoginPage.ts, DashboardPage.ts)
- Specs: `tests/e2e/specs/` (login.spec.ts, dashboard.spec.ts, items.spec.ts)
- Gherkin: `tests/features/` (.feature files)
- Test data: `data-testid` attributes on all interactive elements

## Code Conventions
- TypeScript strict mode everywhere
- Functional React components only (no class components)
- Commit format: `feat|fix|test|docs(scope): description [JIRA-KEY]`
- Branch format: `feature/<story-key>-<slug>`

## Critical Paths (never remove)
- `backend/src/middleware/auth.ts` — JWT guard, all protected routes depend on it
- `backend/src/db/init.ts` — Database initialization, runs on every server start
- `frontend/src/store/authStore.ts` — Global auth state, used by ProtectedRoute
- `frontend/src/api/client.ts` — Axios interceptor that injects JWT header

## Integrations
- Jira project key: EPMCDMETST
- Confluence space: configured in `.env` via CONFLUENCE_SPACE_KEY
- GitHub repo: https://github.com/KaladiSanthoshKumarReddy/codemie_Capstone
