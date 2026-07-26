# Capstone-CodeMie: AI-Assistant Driven SDLC via CodeMie

## Project
AI-powered SDLC pipeline for a brownfield React + Node.js app, orchestrated through **CodeMie** (EPAM's enterprise AI platform).

Project in Jira: **EPMCDMETST** | Group: **mm-learning-group-1**

## What is CodeMie?
CodeMie is EPAM's AI development platform that runs Claude Code in a governed, enterprise context.
- Workspace ID is configured in `.vscode/settings.json` → `airun.settings.workspaceId`
- All agents in `.claude/agents/` are auto-discovered by CodeMie — no extra registration needed
- Use `@agent-name` or `/agent-name` in the CodeMie chat to invoke any agent

## Stack
- **Frontend**: React 18 + TypeScript + Vite + React Router v6 + Zustand
- **Backend**: Node.js + Express + TypeScript + better-sqlite3 + Zod + JWT
- **Database**: SQLite (via better-sqlite3)
- **Testing**: Playwright TypeScript (E2E) + Vitest (unit)
- **CI**: GitHub Actions

## Integrations
- Jira:       https://jiraeu.epam.com  (env: JIRA_BASE_URL, JIRA_API_TOKEN)
- Confluence: https://kb.epam.com      (env: CONFLUENCE_BASE_URL, CONFLUENCE_API_TOKEN)
- Git:        https://github.com/KaladiSanthoshKumarReddy/capstone (branch: main)
- CodeMie:    workspace bound via `.vscode/settings.json`

## Agents (in .claude/agents/)

| Agent | Role | When to use |
|-------|------|-------------|
| ba-agent | Requirements, epics, user stories, Jira | "analyze requirements", "create epic", "user story", "identify gaps" |
| architect-agent | HLD/LLD, ADRs, tech debt, Confluence | "architecture", "HLD", "LLD", "design phase", "tech debt", "ADR" |
| dev-agent | React + Node.js code, Git commits, refactoring | "generate code", "implement feature", "build", "refactor", "cleanup" |
| qa-agent | Playwright E2E, Vitest unit tests, Gherkin | "write tests", "gherkin", "playwright", "E2E", "unit test", "vitest" |
| review-agent | TypeScript quality, security audit, PR review | "code review", "review PR", "security audit", "lint", "code quality" |
| docs-agent | Confluence pages, FRD, README, API docs | "documentation", "FRD", "update docs", "confluence page" |

## Commands
```bash
# Install all dependencies
npm run install:all

# Start frontend dev server
cd frontend && npm run dev

# Start backend
cd backend && npm run dev

# Run E2E tests
cd tests && npx playwright test

# Run unit tests
cd frontend && npx vitest run
cd backend && npx vitest run
```

## Environment
Copy `.env.example` to `.env` and fill in values before running.

## Project Guide
See `.codemie/guides/project-guide.md` for detailed architecture, API contracts, and critical paths.
