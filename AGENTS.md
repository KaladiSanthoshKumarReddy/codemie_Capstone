# AGENTS.md

## Purpose
Operational instructions for AI coding agents working in this repository.

## Read First
- Project overview and setup: [README.md](README.md)
- SDLC workflow details: [docs/SDLC_GUIDE.md](docs/SDLC_GUIDE.md)
- CodeMie-specific context and integrations: [CLAUDE.md](CLAUDE.md)

Follow linked docs instead of duplicating them in responses.

## Working Areas
- Frontend app: `frontend/src`
- Backend API: `backend/src`
- E2E tests: `tests/e2e`
- Gherkin features: `tests/features`

## Verified Commands
Run from repo root unless otherwise noted.

```bash
npm run install:all
npm run dev
npm run build
npm run test
npm run test:unit
npm run test:e2e
```

## Implementation Conventions
- Keep frontend changes in React + TypeScript patterns already used in `frontend/src/components`, `frontend/src/pages`, and `frontend/src/store`.
- Keep backend validation with Zod and route/middleware patterns in `backend/src/routes` and `backend/src/middleware`.
- Prefer minimal diffs; do not reformat unrelated files.
- For behavior changes, add or update tests in `frontend` (Vitest) and/or `tests` (Playwright).

## Model Compatibility Guardrail (Important)
When a command fails with an error like `400 The requested model is not supported`:

1. Do not keep retrying the same model-specific command.
2. Re-run discovery for available assistants/models using the workspace-configured flow (for example, `codemie setup assistants`).
3. Use the workspace default model/assistant selection instead of forcing an unsupported model.
4. Report which fallback was used and continue the task.

## Safety and Execution Notes
- Do not run destructive git commands unless explicitly requested.
- Prefer non-interactive commands.
- If terminals show a typo/path issue (for example `frondend`), correct path and continue.
