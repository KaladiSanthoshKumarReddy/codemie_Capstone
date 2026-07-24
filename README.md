# Capstone-CodeMie — AI-Driven SDLC via CodeMie

> **Group:** mm-learning-group-1 | **Project:** EPMCDMETST | **Branch:** `main`

A brownfield React + Node.js task-management app demonstrating a full AI-assisted SDLC powered by **CodeMie** (EPAM's enterprise AI platform). Ten specialised agents cover every phase from BA analysis through deployment, all with Human-in-the-Loop checkpoints.

For a full end-to-end operating guide, see [docs/PROJECT_AGENT_PLAYBOOK.md](docs/PROJECT_AGENT_PLAYBOOK.md).

---

## What is CodeMie?

[CodeMie](https://codemie.epam.com) is EPAM's enterprise AI development platform built on top of Claude Code. It provides:

- **Governed access** to AI models under EPAM's security and compliance policies
- **Workspace binding** — your project is registered in the platform via a Workspace ID
- **Agent discovery** — any `.md` file in `.claude/agents/` is automatically surfaced in the CodeMie IDE sidebar
- **Audit trails** — all AI interactions are logged centrally

This project is pre-configured with a `workspaceId` in `.vscode/settings.json`. Just open the folder in VS Code with the CodeMie extension and all 10 agents appear immediately.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| State | Zustand (auth), React Router v6 (URL-synced filters) |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT (HS256, 8h expiry) + SHA-256 password hash |
| Validation | Zod (backend), HTML5 + React (frontend) |
| E2E Testing | Playwright TypeScript (POM pattern) |
| CI | GitHub Actions |

---

## Quick Start

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 20+ |
| npm | 10+ |
| VS Code | latest |
| CodeMie VS Code Extension | installed and signed in |
| Git | 2.x+ |

### 1 — Clone and install

```bash
git clone https://github.com/KaladiSanthoshKumarReddy/capstone.git capstone-codemie
cd capstone-codemie
npm run install:all
```

### 2 — Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your tokens
```

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_PORT` | `4000` | Express server port |
| `FRONTEND_PORT` | `3000` | Vite dev server port |
| `DATABASE_PATH` | `./data/capstone.db` | SQLite file path |
| `JWT_SECRET` | *(set this!)* | Token signing secret |
| `JIRA_BASE_URL` | `https://jiraeu.epam.com` | Jira instance URL |
| `JIRA_API_TOKEN` | — | EPAM Jira Personal Access Token |
| `CONFLUENCE_BASE_URL` | `https://kb.epam.com` | Confluence instance URL |
| `CONFLUENCE_API_TOKEN` | — | EPAM Confluence Personal Access Token |
| `CONFLUENCE_SPACE_KEY` | — | Your Confluence space key |
| `GITHUB_TOKEN` | — | GitHub PAT with `repo` scope |

### 3 — Run in development

```bash
npm run dev
# Backend  → http://localhost:4000
# Frontend → http://localhost:3000
```

### 4 — Run E2E tests

```bash
cd tests
npx playwright test
npx playwright show-report   # open HTML report
```

---

## How to Use Agents in CodeMie

### Method 1 — CodeMie IDE Chat (recommended)

1. Open this folder in VS Code
2. Click the **CodeMie icon** in the Activity Bar (left sidebar)
3. Open the **Agents** tab — all 10 agents appear automatically
4. Click an agent or type `@agent-name` in the chat input

### Method 2 — Claude Code CLI (via CodeMie terminal)

```bash
# In the CodeMie-connected terminal:
claude                        # opens interactive session
# Then type: @ba-agent analyze requirements and create Jira stories
```

### Method 3 — Slash commands in chat

In the CodeMie chat input, type `/` to see available commands, or directly trigger agents:

```
/ba-agent        → BA analysis + Jira stories
/architect-agent → Architecture docs + Confluence
/dev-agent       → Code implementation + Git commit
/qa-agent        → Playwright E2E tests
/review-agent    → Code review + PR comments
/docs-agent      → Confluence + README docs
```

---

## All Agents

All agents live in `.claude/agents/` and are auto-discovered by CodeMie.

### SDLC Pipeline Agents

These agents drive the full Software Development Lifecycle end-to-end.

#### `ba-agent` — Business Analyst
**What it does**: Analyzes the codebase, identifies 3–5 enhancements, creates a Jira Epic and linked Stories with acceptance criteria.

**When to use**: Start of any new feature cycle.

**Trigger phrases**: `"analyze requirements"`, `"create epic"`, `"write user story"`, `"identify gaps"`

**Example prompt**:
```
@ba-agent Analyze the current frontend and backend and identify gaps, then create Jira stories in EPMCDMETST
```

**Output**: Jira Epic key + Story keys printed as a table with links.

---

#### `architect-agent` — Solution Architect
**What it does**: Creates Architecture Overview, HLD, LLD documents with Mermaid diagrams and pushes them to Confluence.

**When to use**: After BA stories are approved, before development starts.

**Trigger phrases**: `"architecture"`, `"HLD"`, `"LLD"`, `"design phase"`, `"confluence"`, `"system design"`

**Example prompt**:
```
@architect-agent Create the architecture document and HLD for the new notification feature and push to Confluence
```

**Output**: Confluence page URLs for Architecture + HLD + LLD.

---

#### `dev-agent` — Full-Stack Developer
**What it does**: Implements React TypeScript frontend components + Express TypeScript backend endpoints, runs SQLite migrations, commits to Git.

**When to use**: During development phase after architecture is approved.

**Trigger phrases**: `"generate code"`, `"implement feature"`, `"write component"`, `"create API"`, `"commit code"`

**Example prompt**:
```
@dev-agent Implement the notification bell component in the frontend and a GET /api/notifications endpoint [EPMCDMETST-XXXXX]
```

**Output**: Committed code + branch name for PR.

---

#### `qa-agent` — QA Automation Engineer
**What it does**: Writes Gherkin `.feature` files and Playwright TypeScript E2E specs using the Page Object Model pattern.

**When to use**: After development is complete, before code review.

**Trigger phrases**: `"write tests"`, `"gherkin"`, `"playwright"`, `"E2E"`, `"test cases"`

**Example prompt**:
```
@qa-agent Write Playwright E2E tests for the notification feature covering happy path and error scenarios [EPMCDMETST-XXXXX]
```

**Output**: New `.feature` file + spec file + test execution report.

---

#### `review-agent` — Code Reviewer
**What it does**: Runs `git diff main...HEAD`, checks against project standards (TypeScript, security, testing), posts findings to GitHub PR.

**When to use**: Before merging any feature branch.

**Trigger phrases**: `"code review"`, `"review PR"`, `"check code"`, `"pull request review"`

**Example prompt**:
```
@review-agent Review the current branch changes against main
```

**Output**: Severity table (Critical / Warning / Info) + GitHub PR review comment.

---

#### `docs-agent` — Technical Writer
**What it does**: Maintains Confluence pages (FRD, Architecture, HLD, LLD, Test Results) and Git README/CONTRIBUTING.

**When to use**: End of each SDLC phase; after deployment.

**Trigger phrases**: `"documentation"`, `"confluence page"`, `"FRD"`, `"README"`, `"API docs"`, `"update docs"`

**Example prompt**:
```
@docs-agent Update the FRD page in Confluence with the new notification requirements
```

**Output**: Confluence page URL + updated README.

---

### CodeMie Quality Agents

These agents focus on code quality, maintainability, and cleanup — designed to integrate with CodeMie's quality workflows.

#### `unit-tester-agent` — Unit & Integration Test Writer
**What it does**: Writes Playwright E2E tests and Vitest unit tests following the project's POM pattern and `data-testid` conventions.

**When to use**: Adding test coverage to existing or new code.

**Trigger phrases**: `"unit test"`, `"test coverage"`, `"write test"`, `"integration test"`, `"vitest"`

**Example prompt**:
```
@unit-tester-agent Add unit tests for the authStore Zustand store
```

---

#### `solution-architect-agent` — Architecture Reviewer
**What it does**: Reviews architecture decisions, produces ADRs (Architecture Decision Records), identifies tech debt, estimates effort.

**When to use**: Before major refactors, new integrations, or scaling decisions.

**Trigger phrases**: `"architecture review"`, `"design decision"`, `"tech debt"`, `"scalability"`, `"should I use"`

**Example prompt**:
```
@solution-architect-agent Should we add Redis caching to the items API? Give me an ADR.
```

---

#### `code-review-agent` — Code Quality Reviewer
**What it does**: Reviews TypeScript strictness, security patterns, API shape consistency, React conventions, and testing coverage — outputs a severity table.

**When to use**: Spot-checking code quality; pre-PR review.

**Trigger phrases**: `"code quality"`, `"lint"`, `"review code"`, `"typescript error"`, `"security audit"`

**Example prompt**:
```
@code-review-agent Review backend/src/routes/items.ts for security and TypeScript quality
```

---

#### `refactor-cleaner-agent` — Code Cleanup
**What it does**: Finds and removes dead code, unused imports, redundant dependencies, and code duplication. Always asks for confirmation before deleting.

**When to use**: Periodic codebase cleanup; before releases.

**Trigger phrases**: `"refactor"`, `"cleanup"`, `"dead code"`, `"unused imports"`, `"reduce bundle"`

**Example prompt**:
```
@refactor-cleaner-agent Find all unused imports and dead code in the frontend
```

---

## Full SDLC Demo Walkthrough

Run an end-to-end AI-driven SDLC cycle in order:

```
Step 1:  @ba-agent         → analyze requirements → Jira Epic + Stories
Step 2:  @architect-agent  → create HLD/LLD       → Confluence pages
Step 3:  @dev-agent        → implement feature     → Git commit
Step 4:  @unit-tester-agent → add test coverage   → test files committed
Step 5:  @qa-agent         → E2E tests             → Playwright report
Step 6:  @review-agent     → code review           → PR review comment
Step 7:  @code-review-agent → quality audit        → severity table
Step 8:  @docs-agent       → update docs           → Confluence + README
Step 9:  @solution-architect-agent → arch review   → ADR document
Step 10: @refactor-cleaner-agent   → cleanup        → deletion log
```

Each agent ends with a **Human Review Required** checkpoint before you proceed.

---

## Project Structure

```
capstone-codemie/
├── .claude/
│   └── agents/                        ← All 10 agents auto-discovered by CodeMie
│       ├── ba-agent.md                  SDLC: Business Analyst
│       ├── architect-agent.md           SDLC: Solution Architect (HLD/LLD)
│       ├── dev-agent.md                 SDLC: Full-Stack Developer
│       ├── qa-agent.md                  SDLC: QA / Playwright tests
│       ├── review-agent.md              SDLC: Code Reviewer
│       ├── docs-agent.md                SDLC: Technical Writer
│       ├── unit-tester-agent.md         CodeMie: Unit & Integration Tests
│       ├── solution-architect-agent.md  CodeMie: Architecture Decisions (ADR)
│       ├── code-review-agent.md         CodeMie: Code Quality Audit
│       └── refactor-cleaner-agent.md    CodeMie: Dead Code Cleanup
├── .codemie/
│   └── guides/
│       └── project-guide.md           ← Primary context for all agents
├── .vscode/
│   └── settings.json                  ← CodeMie workspaceId binding
├── backend/
│   └── src/
│       ├── db/init.ts                 ← SQLite schema + init
│       ├── middleware/auth.ts         ← JWT verify (critical path)
│       └── routes/auth.ts, items.ts  ← REST API endpoints
├── frontend/
│   └── src/
│       ├── api/                       ← Axios client + item helpers
│       ├── components/                ← ItemCard, SearchBar, Pagination…
│       ├── pages/                     ← Dashboard, Login, Register
│       ├── store/authStore.ts         ← Zustand auth state (critical path)
│       └── types/index.ts             ← Shared TypeScript interfaces
├── tests/
│   ├── e2e/
│   │   ├── pages/                     ← Page Object Model classes
│   │   └── specs/                     ← Playwright spec files (61 tests)
│   └── features/                      ← Gherkin .feature files
├── scripts/                           ← Confluence push + update scripts (Python)
├── .github/workflows/ci.yml           ← GitHub Actions: build + E2E
├── CLAUDE.md                          ← CodeMie/Claude Code system context
├── .env.example                       ← Environment variable template
└── README.md                          ← This file
```

---

## API Reference

All endpoints prefixed `/api`. Protected routes require `Authorization: Bearer <jwt>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT + email |
| GET | `/items` | Yes | List items (`?page&limit&search&status`) |
| POST | `/items` | Yes | Create item |
| PATCH | `/items/:id` | Yes | Update item (owner only) |
| DELETE | `/items/:id` | Yes | Delete item (owner only) |
| GET | `/health` | No | Health check |

All responses: `{ success: boolean, data?: T, error?: string }`

---

## Live Links

| Resource | URL |
|----------|-----|
| GitHub Repository | https://github.com/KaladiSanthoshKumarReddy/capstone |
| Jira Epic | https://jiraeu.epam.com/browse/EPMCDMETST-55183 |
| Confluence Home | https://kb.epam.com/pages/viewpage.action?pageId=2889552361 |
| Architecture Doc | https://kb.epam.com/pages/viewpage.action?pageId=2889554110 |
| HLD | https://kb.epam.com/pages/viewpage.action?pageId=2889554152 |
| FRD | https://kb.epam.com/pages/viewpage.action?pageId=2889556181 |
| API Reference | https://kb.epam.com/pages/viewpage.action?pageId=2889556182 |
| Test Execution Report | https://kb.epam.com/pages/viewpage.action?pageId=2889556184 |
| Deployment Guide | https://kb.epam.com/pages/viewpage.action?pageId=2889556185 |

---

## Testing

| Spec | Tests | Coverage Area |
|------|-------|---------------|
| `login.spec.ts` | 22 | Login UI, validation, auth, route guards |
| `dashboard.spec.ts` | 25 | Auth guard, layout, logout, item interactions |
| `items.spec.ts` | 14 | Item CRUD, search + filter, pagination |
| **Total** | **61** | Full E2E coverage |

---

## Jira Stories

| Story | Title | Status |
|-------|-------|--------|
| [EPMCDMETST-55183](https://jiraeu.epam.com/browse/EPMCDMETST-55183) | [Epic] AI-Driven SDLC Enhancements | Open |
| [EPMCDMETST-55184](https://jiraeu.epam.com/browse/EPMCDMETST-55184) | Item Management Dashboard UI | Resolved |
| [EPMCDMETST-55185](https://jiraeu.epam.com/browse/EPMCDMETST-55185) | JWT Auth Guard and Protected Routes | Resolved |
| [EPMCDMETST-55186](https://jiraeu.epam.com/browse/EPMCDMETST-55186) | Item Search and Status Filter | Resolved |
| [EPMCDMETST-55187](https://jiraeu.epam.com/browse/EPMCDMETST-55187) | Item Status Update — Complete CRUD | Resolved |
| [EPMCDMETST-55188](https://jiraeu.epam.com/browse/EPMCDMETST-55188) | Pagination for Items List | Resolved |

---

## Contributing

```bash
git checkout -b feature/EPMCDMETST-XXXXX-short-desc
# make changes
git commit -m "feat(scope): description [EPMCDMETST-XXXXX]"
git push origin feature/EPMCDMETST-XXXXX-short-desc
```

Commit convention: `feat|fix|test|docs|chore(scope): short description`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Agents not showing in CodeMie | Ensure CodeMie extension is installed + signed in; reload VS Code window |
| Agent says "can't read .env" | Run `cp .env.example .env` and fill in tokens |
| Backend fails to start | Check `DATABASE_PATH` folder exists; run `mkdir -p data` |
| Playwright tests fail | Ensure both `npm run dev` processes are running on ports 3000 + 4000 |
| Jira API 401 | Check `JIRA_API_TOKEN` is a PAT (not a password) |
| Confluence API 403 | Verify `CONFLUENCE_SPACE_KEY` matches your space |

---

*Generated with CodeMie — EPAM's AI development platform*
