# Capstone-CodeMie — AI-Driven SDLC via CodeMie

> **Group:** mm-learning-group-1 | **Jira Project:** EPMCDMETST | **Branch:** `main`

A brownfield React + Node.js task-management app demonstrating a full AI-assisted SDLC pipeline powered by **CodeMie** (EPAM's enterprise AI platform). Six specialised agents — each embodying a SDLC persona — drive every phase from requirements to deployment, with **Human-in-the-Loop (HITL)** checkpoints at every gate.

---

## Table of Contents

1. [What is CodeMie?](#what-is-codemie)
2. [Capstone Objective](#capstone-objective)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [The 6 SDLC Agents](#the-6-sdlc-agents)
6. [SDLC Pipeline — Step by Step](#sdlc-pipeline--step-by-step)
7. [Example End-to-End Walkthrough](#example-end-to-end-walkthrough)
8. [How to Invoke Agents](#how-to-invoke-agents)
9. [Project Structure](#project-structure)
10. [API Reference](#api-reference)
11. [Environment Variables](#environment-variables)
12. [Testing](#testing)
13. [Integrations](#integrations)
14. [Troubleshooting](#troubleshooting)

---

## What is CodeMie?

[CodeMie](https://codemie.epam.com) is EPAM's enterprise AI development platform built on Claude Code. It provides:

- **Governed access** to AI models under EPAM's security and compliance policies
- **Workspace binding** — your project is registered via a Workspace ID in `.vscode/settings.json`
- **Agent auto-discovery** — any `.md` file in `.claude/agents/` is surfaced automatically in the IDE sidebar
- **Audit trails** — all AI interactions are logged centrally for governance

This project is pre-configured. Open the folder in VS Code with the CodeMie extension and all 6 agents appear immediately.

---

## Capstone Objective

Build an **agentic SDLC pipeline** where every phase is powered by a dedicated AI assistant persona, integrated with enterprise tooling (Jira, Confluence, GitHub), with human review gates after each phase.

| Deliverable | Agent | Tool |
|-------------|-------|------|
| Gaps / Enhancements identified | `ba-agent` | Jira |
| User Stories generated | `ba-agent` | Jira |
| Architecture & Design created | `architect-agent` | Confluence |
| Code implemented & committed | `dev-agent` | Git / GitHub |
| Code reviewed | `review-agent` | GitHub PRs |
| Tests written & validated | `qa-agent` | Playwright + Vitest |
| Documentation updated | `docs-agent` | Confluence + README |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| State | Zustand (auth) + React Router v6 |
| Backend | Node.js 20 + Express + TypeScript |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT HS256 (8 h expiry) + SHA-256 password hash |
| Validation | Zod (backend) + HTML5 (frontend) |
| E2E Testing | Playwright TypeScript (POM pattern) |
| Unit Testing | Vitest |
| CI | GitHub Actions |

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| VS Code | Latest |
| CodeMie VS Code Extension | Installed + signed in |
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
# Edit .env with your tokens (see Environment Variables section)
```

### 3 — Run in development

```bash
# Terminal 1 — backend
cd backend && npm run dev   # → http://localhost:4000

# Terminal 2 — frontend
cd frontend && npm run dev  # → http://localhost:3000
```

### 4 — Run tests

```bash
# E2E tests
cd tests && npx playwright test

# Unit tests
cd frontend && npx vitest run
cd backend && npx vitest run
```

---

## The 6 SDLC Agents

All agents live in `.claude/agents/` and are auto-discovered by CodeMie. Each agent covers its primary SDLC role **plus** the related quality capabilities (no separate quality agents needed).

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SDLC AGENTS                                  │
│                                                                      │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │ ba-agent │→ │architect-  │→ │dev-agent │→ │    qa-agent       │ │
│  │          │  │   agent    │  │          │  │                   │ │
│  │ Analysis │  │ Design +   │  │ Code +   │  │ E2E + Unit Tests  │ │
│  │ + Stories│  │ ADRs + TD  │  │ Refactor │  │ + Gherkin BDD     │ │
│  └──────────┘  └────────────┘  └──────────┘  └───────────────────┘ │
│                                                          ↓           │
│  ┌──────────────────────────────────────────┐  ┌──────────────────┐ │
│  │              docs-agent                  │← │  review-agent    │ │
│  │  Confluence FRD + API Docs + README      │  │ TypeScript +     │ │
│  │                                          │  │ Security + PR    │ │
│  └──────────────────────────────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Agent Capabilities at a Glance

| Agent | Primary Role | Also Covers |
|-------|-------------|-------------|
| `ba-agent` | Requirements, Jira epics/stories | Gap analysis, acceptance criteria |
| `architect-agent` | HLD, LLD, Confluence docs | Architecture review, ADRs, tech debt |
| `dev-agent` | React + Node.js code, Git commits | Refactoring, dead code cleanup |
| `qa-agent` | Playwright E2E, Gherkin BDD | Vitest unit + integration tests |
| `review-agent` | PR code review, GitHub comments | TypeScript audit, security review |
| `docs-agent` | Confluence pages, FRD, README | API docs (OpenAPI), test reports |

---

## SDLC Pipeline — Step by Step

The capstone SDLC has **8 phases**, each with a HITL checkpoint before proceeding.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    CAPSTONE SDLC PIPELINE                                  │
│                                                                             │
│  PHASE 1 ─ Analysis              PHASE 5 ─ Code Review                    │
│  ┌─────────────────────┐         ┌─────────────────────┐                  │
│  │  @ba-agent          │         │  @review-agent       │                  │
│  │  Analyze codebase   │         │  Review PR diff      │                  │
│  │  Identify 3-5 gaps  │         │  TypeScript + Sec.   │                  │
│  │  Create Jira Stories│         │  Post to GitHub PR   │                  │
│  └──────────┬──────────┘         └──────────┬───────────┘                  │
│             │ ✋ HITL                        │ ✋ HITL                       │
│             ▼                               ▼                               │
│  PHASE 2 ─ Design                PHASE 6 ─ Testing                        │
│  ┌─────────────────────┐         ┌─────────────────────┐                  │
│  │  @architect-agent   │         │  @qa-agent           │                  │
│  │  HLD + LLD docs     │         │  Playwright E2E      │                  │
│  │  Mermaid diagrams   │         │  Vitest unit tests   │                  │
│  │  Push to Confluence │         │  Gherkin scenarios   │                  │
│  └──────────┬──────────┘         └──────────┬───────────┘                  │
│             │ ✋ HITL                        │ ✋ HITL                       │
│             ▼                               ▼                               │
│  PHASE 3 ─ Development           PHASE 7 ─ Deployment                     │
│  ┌─────────────────────┐         ┌─────────────────────┐                  │
│  │  @dev-agent          │         │  npm run dev         │                  │
│  │  React components   │         │  Backend + Frontend  │                  │
│  │  Express endpoints  │         │  Local / CI deploy   │                  │
│  │  Git commit + push  │         │  GitHub Actions      │                  │
│  └──────────┬──────────┘         └──────────┬───────────┘                  │
│             │ ✋ HITL                        │ ✋ HITL                       │
│             ▼                               ▼                               │
│  PHASE 4 ─ Plan/PR               PHASE 8 ─ Documentation                  │
│  ┌─────────────────────┐         ┌─────────────────────┐                  │
│  │  @dev-agent          │         │  @docs-agent         │                  │
│  │  Create PR + plan   │         │  Update Confluence   │                  │
│  │  Link to Jira story │         │  FRD + API docs      │                  │
│  │  Open for review    │         │  Update README       │                  │
│  └──────────┬──────────┘         └──────────┬───────────┘                  │
│             │ ✋ HITL                        │ ✋ HITL                       │
│             ▼                               ▼                               │
│                         DONE — Merged to main                               │
└───────────────────────────────────────────────────────────────────────────┘
```

### Human-in-the-Loop Checkpoints

Every agent ends its response with a **"Human Review Required"** message. You must review and approve before invoking the next agent.

| Phase | HITL Action Required |
|-------|---------------------|
| After Analysis | Review Jira stories, accept/edit criteria before design |
| After Design | Review Confluence HLD/LLD, approve architecture before coding |
| After Development | Review git diff, approve code before opening PR |
| After PR Created | Review PR in GitHub, check it's linked to Jira |
| After Code Review | Address Critical issues, re-request review if needed |
| After Testing | Review Playwright report, ensure all tests pass |
| After Deployment | Smoke test the running app before marking done |
| After Documentation | Review Confluence pages for accuracy |

---

## Example End-to-End Walkthrough

This example shows adding an **"Item Priority"** feature (High / Medium / Low priority label on each task).

---

### Step 1 — BA Analysis (ba-agent)

**You type:**
```
@ba-agent Analyze the current app and identify enhancement opportunities, then create a Jira Epic and Stories in EPMCDMETST
```

**Agent does:**
1. Reads `frontend/src/` and `backend/src/` to understand existing features
2. Identifies gaps: no priority field, no due dates, no notifications, no sorting
3. Creates Jira Epic: `[Capstone] AI-Driven SDLC Enhancements`
4. Creates Story: `[Enhancement] Add Item Priority Labels (High/Medium/Low)`

**Agent output:**
```
| Story Key        | Summary                          | Status | Link |
|------------------|----------------------------------|--------|------|
| EPMCDMETST-55183 | [Epic] AI-Driven Enhancements    | Open   | ...  |
| EPMCDMETST-55189 | [Enhancement] Item Priority Tags | Open   | ...  |

✋ Human Review Required: Please review the stories above in Jira
   before I proceed to the design phase.
```

**You (HITL):** Review stories in Jira. Edit acceptance criteria if needed. Type "Approved, proceed to design" to continue.

---

### Step 2 — Architecture Design (architect-agent)

**You type:**
```
@architect-agent Create the HLD and LLD for the Item Priority feature (EPMCDMETST-55189) and push to Confluence
```

**Agent does:**
1. Designs React component changes: `PriorityBadge` component with `data-testid`
2. Designs API changes: adds `priority` field to `POST /items` and `PATCH /items/:id`
3. Designs DB migration: `ALTER TABLE items ADD COLUMN priority TEXT DEFAULT 'medium'`
4. Produces Mermaid sequence diagram for the create-with-priority flow
5. Pushes HLD + LLD pages to Confluence

**Agent output:**
```
Architecture documents published:
- HLD: https://kb.epam.com/pages/viewpage.action?pageId=XXXXXXX
- LLD: https://kb.epam.com/pages/viewpage.action?pageId=XXXXXXX

✋ Human Review Required: Architecture published to Confluence.
   Please review before proceeding to development.
```

**You (HITL):** Open the Confluence links, review diagrams and API contract. Approve or request changes.

---

### Step 3 — Development (dev-agent)

**You type:**
```
@dev-agent Implement the Item Priority feature from EPMCDMETST-55189:
- Add priority field to the Item type
- Add PriorityBadge component to ItemCard
- Update POST /items and PATCH /items/:id to accept priority
- Add SQLite migration for the priority column
```

**Agent does:**
1. Adds `priority: 'high' | 'medium' | 'low'` to `frontend/src/types/index.ts`
2. Creates `frontend/src/components/PriorityBadge.tsx` with `data-testid="priority-badge"`
3. Updates `backend/src/routes/items.ts` — Zod schema updated with `priority` field
4. Writes SQLite migration: `ALTER TABLE items ADD COLUMN priority TEXT DEFAULT 'medium'`
5. Commits: `feat(items): add priority field with badge UI [EPMCDMETST-55189]`
6. Pushes to `feature/EPMCDMETST-55189-item-priority`

**Agent output:**
```
Code committed to branch: feature/EPMCDMETST-55189-item-priority
Commit: feat(items): add priority field with badge UI [EPMCDMETST-55189]

✋ Human Review Required: Please review the diff at:
   https://github.com/KaladiSanthoshKumarReddy/capstone/compare/feature/EPMCDMETST-55189-item-priority
   before I open a PR.
```

**You (HITL):** Review the git diff. Confirm the implementation matches the LLD. Type "Approved, open the PR."

---

### Step 4 — Code Review (review-agent)

**You type:**
```
@review-agent Review the PR for feature/EPMCDMETST-55189-item-priority against main
```

**Agent does:**
1. Runs `git diff main...HEAD`
2. Checks TypeScript strictness, Zod validation, ownership checks
3. Verifies `data-testid` attributes on new components
4. Posts review findings to the GitHub PR

**Agent output:**
```
| Severity | File                              | Line | Issue                        | Suggestion                        |
|----------|-----------------------------------|------|------------------------------|-----------------------------------|
| Warning  | backend/src/routes/items.ts       |  38  | priority not in UPDATE schema| Add priority to PATCH Zod schema  |
| Info     | frontend/src/components/Badge.tsx |  12  | Missing aria-label on badge  | Add aria-label="item priority"    |

✋ Human Review Required: 0 critical, 1 warning, 1 info found.
   Please address the warning before merging.
```

**You (HITL):** Fix the warning, re-request review. Once approved, continue to testing.

---

### Step 5 — Testing (qa-agent)

**You type:**
```
@qa-agent Write Playwright E2E tests and Vitest unit tests for the Item Priority feature [EPMCDMETST-55189]
```

**Agent does:**
1. Writes `tests/features/item-priority.feature` (Gherkin BDD)
2. Writes `tests/e2e/pages/ItemPage.ts` — adds `priorityBadge` locator
3. Writes `tests/e2e/specs/item-priority.spec.ts` — happy + error path
4. Writes `frontend/src/__tests__/PriorityBadge.test.tsx` — Vitest unit test
5. Runs all tests and saves HTML report

**Agent output:**
```
Gherkin: tests/features/item-priority.feature
E2E spec: tests/e2e/specs/item-priority.spec.ts  (3 scenarios)
Unit test: frontend/src/__tests__/PriorityBadge.test.tsx (4 tests)

Test results: 3/3 E2E passed, 4/4 unit passed
Report: tests/playwright-report/index.html

✋ Human Review Required: All tests pass. Please review the
   report and confirm before deployment.
```

**You (HITL):** Open the Playwright HTML report. Confirm all tests green.

---

### Step 6 — Documentation (docs-agent)

**You type:**
```
@docs-agent Update the FRD and API Reference in Confluence to include the new priority field, and update README.md
```

**Agent does:**
1. Updates FRD Confluence page — adds priority requirement
2. Updates API Reference page — adds `priority` to POST/PATCH schemas
3. Updates `README.md` API table
4. Commits README change

**Agent output:**
```
Updated:
- FRD: https://kb.epam.com/pages/viewpage.action?pageId=2889556181
- API Docs: https://kb.epam.com/pages/viewpage.action?pageId=2889556182
- README.md — API table updated

✋ Human Review Required: Documentation updated. Please review
   Confluence pages for accuracy before closing the story.
```

**You (HITL):** Open Confluence links. Verify accuracy. Merge the PR to `main`. Close the Jira story.

---

## How to Invoke Agents

### Method 1 — CodeMie IDE Chat (recommended)
1. Open this folder in VS Code
2. Click the **CodeMie icon** in the Activity Bar
3. Open the **Agents** tab — all 6 agents appear automatically
4. Click an agent or type `@agent-name` in the chat input

### Method 2 — Slash Commands in chat
```
/ba-agent        → BA analysis + Jira stories
/architect-agent → Architecture + Confluence docs
/dev-agent       → Code implementation + Git
/qa-agent        → Playwright E2E + Vitest unit tests
/review-agent    → Code review + GitHub PR comments
/docs-agent      → Confluence + README documentation
```

### Method 3 — Claude Code CLI (via CodeMie terminal)
```bash
claude   # opens interactive session
# Then type: @ba-agent analyze requirements and create Jira stories
```

---

## Project Structure

```
capstone-codemie/
├── .claude/
│   └── agents/
│       ├── ba-agent.md          ← Business Analyst: analysis + Jira stories
│       ├── architect-agent.md   ← Architect: HLD/LLD + ADRs + Confluence
│       ├── dev-agent.md         ← Developer: React + Node.js + Git + refactor
│       ├── qa-agent.md          ← QA: Playwright E2E + Vitest + Gherkin
│       ├── review-agent.md      ← Reviewer: TypeScript + security + PR
│       └── docs-agent.md        ← Docs: Confluence FRD + API docs + README
│
├── .codemie/
│   └── guides/
│       └── project-guide.md     ← Primary context for all agents
│
├── .vscode/
│   └── settings.json            ← CodeMie workspaceId binding
│
├── backend/
│   └── src/
│       ├── db/init.ts            ← SQLite schema + migration runner (critical)
│       ├── middleware/auth.ts    ← JWT verify middleware (critical)
│       ├── routes/
│       │   ├── auth.ts           ← POST /auth/register, /auth/login
│       │   └── items.ts          ← GET/POST/PATCH/DELETE /items
│       ├── controllers/          ← Route handlers
│       ├── services/             ← Business logic
│       └── repositories/         ← SQLite queries
│
├── frontend/
│   └── src/
│       ├── api/                  ← Axios client + item API helpers (critical)
│       ├── components/           ← ItemCard, SearchBar, Pagination…
│       ├── pages/                ← Dashboard, Login, Register
│       ├── store/
│       │   └── authStore.ts      ← Zustand auth state (critical)
│       └── types/index.ts        ← Shared TypeScript interfaces
│
├── tests/
│   ├── e2e/
│   │   ├── pages/                ← Page Object Model classes
│   │   └── specs/                ← Playwright spec files
│   ├── features/                 ← Gherkin .feature files
│   └── playwright.config.ts
│
├── scripts/                      ← Python Confluence push/update scripts
├── .github/workflows/ci.yml      ← GitHub Actions: build + test
├── CLAUDE.md                     ← CodeMie system context
├── AGENTS.md                     ← Agent operational notes
├── .env.example                  ← Environment template
└── README.md                     ← This file
```

---

## API Reference

All endpoints prefixed `/api`. Protected routes require `Authorization: Bearer <jwt>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register — `{ email, password, name }` |
| POST | `/auth/login` | No | Login — returns `{ token, email }` |
| GET | `/items` | Yes | List items — `?page&limit&search&status` |
| POST | `/items` | Yes | Create item — `{ title, description?, status?, priority? }` |
| PATCH | `/items/:id` | Yes | Update item (owner only) |
| DELETE | `/items/:id` | Yes | Delete item (owner only) |
| GET | `/health` | No | Health check |

All responses: `{ success: boolean, data?: T, error?: string }`

---

## Environment Variables

```bash
cp .env.example .env
```

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `BACKEND_PORT` | `4000` | No | Express server port |
| `FRONTEND_PORT` | `3000` | No | Vite dev server port |
| `DATABASE_PATH` | `./data/capstone.db` | No | SQLite file location |
| `JWT_SECRET` | — | **Yes** | Token signing secret (min 32 chars) |
| `JIRA_BASE_URL` | `https://jiraeu.epam.com` | Yes (agents) | Jira instance URL |
| `JIRA_API_TOKEN` | — | Yes (agents) | EPAM Jira Personal Access Token |
| `CONFLUENCE_BASE_URL` | `https://kb.epam.com` | Yes (agents) | Confluence instance URL |
| `CONFLUENCE_API_TOKEN` | — | Yes (agents) | EPAM Confluence Personal Access Token |
| `CONFLUENCE_SPACE_KEY` | — | Yes (agents) | Your Confluence space key |
| `GITHUB_TOKEN` | — | Yes (agents) | GitHub PAT with `repo` scope |

---

## Testing

| Suite | Tool | Location | Tests |
|-------|------|----------|-------|
| E2E — Auth flow | Playwright | `tests/e2e/specs/login.spec.ts` | 22 |
| E2E — Dashboard | Playwright | `tests/e2e/specs/dashboard.spec.ts` | 25 |
| E2E — Items CRUD | Playwright | `tests/e2e/specs/items.spec.ts` | 14 |
| Unit — Frontend | Vitest | `frontend/src/__tests__/` | varies |
| Unit — Backend | Vitest | `backend/src/__tests__/` | varies |

```bash
# E2E tests
cd tests && npx playwright test
cd tests && npx playwright show-report       # HTML report

# Unit tests
cd frontend && npx vitest run --coverage
cd backend && npx vitest run --coverage
```

---

## Integrations

| Service | Purpose | Environment Variable |
|---------|---------|---------------------|
| Jira (EPMCDMETST) | Story creation, tracking | `JIRA_BASE_URL`, `JIRA_API_TOKEN` |
| Confluence | Architecture, FRD, test reports | `CONFLUENCE_BASE_URL`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_KEY` |
| GitHub | Code hosting, PRs, CI/CD | `GITHUB_TOKEN` |
| CodeMie | Agent orchestration, AI platform | Workspace ID in `.vscode/settings.json` |

### Live Links

| Resource | URL |
|----------|-----|
| GitHub Repository | https://github.com/KaladiSanthoshKumarReddy/capstone |
| Jira Epic | https://jiraeu.epam.com/browse/EPMCDMETST-55183 |
| Confluence Home | https://kb.epam.com/pages/viewpage.action?pageId=2889552361 |

---

## Contributing

```bash
# Create a feature branch
git checkout -b feature/EPMCDMETST-XXXXX-short-description

# Commit convention
git commit -m "feat(scope): description [EPMCDMETST-XXXXX]"

# Push and open a PR
git push origin feature/EPMCDMETST-XXXXX-short-description
gh pr create --title "feat: description" --body "Closes EPMCDMETST-XXXXX"
```

Commit types: `feat` | `fix` | `test` | `docs` | `refactor` | `chore`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Agents not showing in CodeMie | Ensure CodeMie extension is installed and signed in; reload VS Code (`Cmd+Shift+P` → `Reload Window`) |
| Agent says "can't read .env" | Run `cp .env.example .env` and fill in all required tokens |
| Backend fails to start | Check `DATABASE_PATH` directory exists: `mkdir -p data` |
| Playwright tests fail | Ensure both dev servers are running on ports 3000 and 4000 |
| Jira API 401 | `JIRA_API_TOKEN` must be a PAT, not a password |
| Confluence API 403 | Verify `CONFLUENCE_SPACE_KEY` matches your space (case-sensitive) |
| TypeScript build errors | Run `cd frontend && npm run build` and `cd backend && npx tsc --noEmit` to see errors |

---

*Powered by [CodeMie](https://codemie.epam.com) — EPAM's enterprise AI development platform*
