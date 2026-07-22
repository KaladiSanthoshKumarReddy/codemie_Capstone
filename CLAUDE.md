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

## All Agents (in .claude/agents/)

### SDLC Pipeline Agents
| Agent | Role | When to use |
|-------|------|-------------|
| ba-agent | BA — writes Jira epics/stories | "analyze requirements", "create epic", "user story" |
| architect-agent | Creates HLD/LLD, pushes to Confluence | "architecture", "HLD", "LLD", "design phase" |
| dev-agent | Generates React + Node.js code, commits | "generate code", "implement feature", "build" |
| qa-agent | Writes Gherkin + Playwright TS tests | "write tests", "gherkin", "playwright", "E2E" |
| review-agent | Code reviews PRs, posts comments | "code review", "review PR", "check code" |
| docs-agent | Updates Confluence FRD/design docs | "documentation", "FRD", "update docs" |

### CodeMie Quality Agents
| Agent | Role | When to use |
|-------|------|-------------|
| unit-tester-agent | Writes Playwright/Vitest unit & integration tests | "unit test", "test coverage", "write test" |
| solution-architect-agent | Reviews architecture, identifies tech debt | "architecture review", "design decision", "tech debt" |
| code-review-agent | Reviews TypeScript quality, security, linting | "code quality", "lint", "review code" |
| refactor-cleaner-agent | Removes dead code and unused dependencies | "refactor", "cleanup", "dead code", "unused" |

## Commands
```bash
# Start frontend dev server
cd frontend && npm run dev

# Start backend
cd backend && npm run dev

# Run E2E tests
cd tests && npx playwright test

# Run all (full SDLC demo)
npm run sdlc
```

## Environment
Copy `.env.example` to `.env` and fill in values before running.

## Project Guide
See `.codemie/guides/project-guide.md` for detailed architecture, API contracts, and critical paths.
