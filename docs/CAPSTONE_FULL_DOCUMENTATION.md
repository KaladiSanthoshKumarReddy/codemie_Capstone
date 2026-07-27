# Capstone Project — Overview & Agent Guide
**AI-Assistant Driven SDLC via CodeMie** | Group: mm-learning-group-1 | Project: EPMCDMETST

---

## What Is This Project?

A brownfield **task-management web app** (React + Node.js) where every phase of the software development lifecycle — from requirements to documentation — is driven by **AI agents** running on **CodeMie** (EPAM's enterprise AI platform).

The value is not the app. The value is the **AI orchestration** across every SDLC phase.

---

## The Application

A simple task manager where users can:
- Register and log in (JWT auth)
- Create, edit, delete personal task items
- Search and filter items by status
- Paginate through the item list

**Stack:** React 18 + TypeScript + Vite (frontend) · Node.js + Express + SQLite (backend)

**Running locally:**
```bash
npm run install:all
cd backend && npm run dev   # → http://localhost:4000
cd frontend && npm run dev  # → http://localhost:3000
```

---

## The 6 SDLC Agents

| # | Agent | Role | Phase |
|---|-------|------|-------|
| 1 | `ba-agent` | Business Analyst | Requirements → Jira stories |
| 2 | `architect-agent` | Solution Architect | Design → Confluence docs |
| 3 | `dev-agent` | Full-Stack Developer | Code → Git commit |
| 4 | `review-agent` | Code Reviewer | PR review → GitHub |
| 5 | `qa-agent` | QA Engineer | Tests → Playwright + Vitest |
| 6 | `docs-agent` | Technical Writer | Docs → Confluence + README |

All agents live in `.claude/agents/` and are auto-loaded by the CodeMie VS Code extension.

---

## SDLC Flow & Prompts

Run agents in this order. After each one, **review the output** before continuing.

---

### Step 1 — Analysis `@ba-agent`

**What it does:** Reads the codebase, finds 3–5 feature gaps, creates a Jira Epic and Stories.

**Prompt to use:**
```
@ba-agent Analyze the current app in frontend/src/ and backend/src/,
identify 3-5 enhancement opportunities, and create a Jira Epic
with Stories in project EPMCDMETST. Include acceptance criteria
for each story.
```

**Output:** Jira Epic + Story keys with links, acceptance criteria table.

**✋ Human Review:** Open Jira, review stories, edit if needed, then continue.

---

### Step 2 — Design `@architect-agent`

**What it does:** Creates HLD and LLD documents with Mermaid diagrams and pushes to Confluence.

**Prompt to use:**
```
@architect-agent Create the architecture document, HLD, and LLD
for story <JIRA-KEY> and push all documents to Confluence.
Include component diagram and sequence diagram.
```

**Output:** Confluence page URLs for Architecture + HLD + LLD.

**✋ Human Review:** Open Confluence links, review diagrams and API contracts.

---

### Step 3 — Development `@dev-agent`

**What it does:** Implements the React frontend component + Express backend endpoint, writes DB migration, commits to Git.

**Prompt to use:**
```
@dev-agent Implement story <JIRA-KEY>: <story title>.
Create the React component with data-testid attributes,
the backend API endpoint with Zod validation,
and run the TypeScript build to verify before committing.
```

**Output:** Code committed to `feature/<story-key>-<slug>` branch.

**✋ Human Review:** Run `git diff main...HEAD`, verify the code, then approve.

---

### Step 4 — Code Review `@review-agent`

**What it does:** Reviews the PR diff for TypeScript errors, security issues, missing tests, and coding standards. Posts findings to GitHub.

**Prompt to use:**
```
@review-agent Review the current branch against main.
Check TypeScript correctness, security, API shape,
data-testid attributes, and test coverage.
Post findings to the GitHub PR.
```

**Output:** Severity table — Critical / Warning / Info — with file, line, and fix suggestion.

**✋ Human Review:** Fix any Critical findings, then re-run if needed.

---

### Step 5 — Testing `@qa-agent`

**What it does:** Writes Gherkin BDD scenarios, Playwright E2E specs, and Vitest unit tests. Runs them and generates an HTML report.

**Prompt to use:**
```
@qa-agent Write Playwright E2E tests and Vitest unit tests
for story <JIRA-KEY>. Cover the happy path and at least
one error scenario. Run all tests and save the report.
```

**Output:** `.feature` file + `.spec.ts` file + unit test file + Playwright HTML report.

**✋ Human Review:** Open `tests/playwright-report/index.html`, confirm all tests pass.

---

### Step 6 — Deployment (Manual)

```bash
# Start the app and smoke test the new feature
cd backend && npm run dev
cd frontend && npm run dev
# Open http://localhost:3000 and verify the feature works
```

**✋ Human Review:** Test the feature manually in the browser.

---

### Step 7 — Documentation `@docs-agent`

**What it does:** Updates the Confluence FRD and API Reference pages, and updates README.md.

**Prompt to use:**
```
@docs-agent Update the Confluence FRD and API Reference
to include the changes from story <JIRA-KEY>.
Also update README.md with any new API fields or features.
```

**Output:** Updated Confluence page URLs + updated README.

**✋ Human Review:** Review Confluence pages, then merge the PR and close the Jira story.

---

## Tools Used

| Tool | Purpose | URL |
|------|---------|-----|
| CodeMie | AI platform — runs all 6 agents | https://codemie.lab.epam.com |
| VS Code + CodeMie Extension | Development environment — agents auto-load | local |
| Jira | Story tracking (project: EPMCDMETST) | https://jiraeu.epam.com |
| Confluence | Architecture + FRD + API docs | https://kb.epam.com |
| GitHub | Code hosting, PRs, CI/CD | https://github.com/KaladiSanthoshKumarReddy/codemie_Capstone |
| Playwright | E2E browser tests | `cd tests && npx playwright test` |
| Vitest | Unit tests | `cd frontend && npx vitest run` |
| GitHub Actions | CI — builds and tests on every PR | `.github/workflows/ci.yml` |

---

## Environment Variables (`.env`)

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Any random 32+ character string |
| `JIRA_BASE_URL` | `https://jiraeu.epam.com` |
| `JIRA_API_TOKEN` | Your EPAM Jira Personal Access Token |
| `CONFLUENCE_BASE_URL` | `https://kb.epam.com` |
| `CONFLUENCE_API_TOKEN` | Your EPAM Confluence Personal Access Token |
| `CONFLUENCE_SPACE_KEY` | Your Confluence space key |
| `GITHUB_TOKEN` | GitHub PAT with `repo` scope |

---

## Human-in-the-Loop Checkpoints (Summary)

Every agent ends with **"✋ Human Review Required"**. You must review before invoking the next agent.

| After | Review This | Then Say |
|-------|-------------|----------|
| ba-agent | Jira stories + acceptance criteria | "Stories approved, proceed to design" |
| architect-agent | Confluence HLD + LLD pages | "Design approved, start coding" |
| dev-agent | `git diff main...HEAD` | "Code approved, open PR" |
| review-agent | Severity table — fix Criticals | "Review done, write tests" |
| qa-agent | Playwright HTML report | "Tests pass, deploy" |
| Deployment | App running + feature works | "App verified, update docs" |
| docs-agent | Confluence pages + README | Merge PR → close Jira story |

---

*CodeMie Capstone — mm-learning-group-1*
