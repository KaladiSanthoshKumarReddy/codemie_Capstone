# HLD — Improve Item Management (Due dates, Priority, Export)

**Stories**: EPMCDMETST-55847 / 55844 / 55845 / 55846

---

## 1. System Overview (what the system does)
The application is a personal task management system where authenticated users can create and manage items. This enhancement adds:
- optional **Due Date** on each item
- configurable **Priority** (`high|medium|low`)
- ability to **Export** the current item list to CSV

---

## 2. Components

### 2.1 Frontend (React 18 + TS + Vite)
**Responsibilities**
- Render Dashboard with list, search, status filter, and (new) priority + due date fields.
- Call backend REST APIs via Axios client with JWT injection.
- Trigger CSV download by calling export endpoint.

**Ports (interfaces)**
- `frontend/src/api/items.ts` — typed API client for items.
- `frontend/src/store/authStore.ts` — auth state for token/email.

### 2.2 Backend (Node.js 20 + Express + TS)
**Responsibilities**
- Enforce JWT authentication on item routes.
- Validate request payloads with Zod.
- Perform SQL queries (user scoped).
- Generate CSV output for export endpoint.

**Ports (interfaces)**
- `/api/items` — GET list, POST create
- `/api/items/:id` — PATCH update, DELETE delete
- `/api/items/export` — GET CSV export

### 2.3 Database (SQLite via @libsql/client)
**Responsibilities**
- Persist user and item entities.
- Support migrations on startup (`initDb`).

---

## 3. Integration Points
- **Jira**: story tracking only (no runtime integration).
- **Confluence**: documentation publishing only.
- **GitHub**: source control + CI only.

---

## 4. Data Flow (request → backend → DB → response)

### 4.1 Create item (POST /api/items)
1. Frontend collects title/description + (new) dueDate/priority.
2. Backend validates body with Zod.
3. Backend inserts new row into `items` with `user_id` from JWT.
4. Backend returns `{ success: true, data: { id } }`.

### 4.2 Update item (PATCH /api/items/:id)
1. Frontend sends patch containing any of: `title`, `description`, `status`, `due_date`, `priority`.
2. Backend validates with Zod and updates DB (scoped by `id` + `user_id`).
3. Backend returns updated item row.

### 4.3 Export (GET /api/items/export)
1. Frontend sends query params aligning with list filters: `search`, `status` (and optionally `priority`, sorting).
2. Backend selects matching items for user.
3. Backend converts rows into CSV and returns download response.

---

## 5. Deployment (local dev, CI/CD)

### 5.1 Local development
- `npm run dev` starts backend on `:4000` and frontend on Vite port.
- On backend start, `initDb()` migrates schema by adding new columns.

### 5.2 CI/CD (GitHub Actions)
- Build backend + frontend.
- Run unit tests (Vitest).
- Run Playwright E2E tests.

---

## 6. Component Diagram (Mermaid)

```mermaid
flowchart TB
  FE[Frontend SPA\nReact+TS] -->|REST + JWT| BE[Backend API\nExpress+TS]
  BE --> DB[(SQLite)]

  FE -->|download| CSV[CSV file\nitems.csv]

  subgraph Backend Internals
    AU[authMiddleware\nJWT HS256]
    IT[items routes]\n
    AU --> IT
  end

  BE -. uses .-> AU
  BE -. uses .-> IT
```
