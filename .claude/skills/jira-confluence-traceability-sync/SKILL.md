---
name: jira-confluence-traceability-sync
description: Use this skill to maintain end-to-end traceability between Jira stories, code changes, test evidence, and Confluence documentation so each SDLC artifact is linked and auditable.
---

# Jira Confluence Traceability Sync

## Why this skill
Your current AI SDLC creates many artifacts (Jira, code, tests, Confluence). This skill closes the governance gap by ensuring every story is traceable from requirement to deployment evidence.

## Use when
- A story moves between SDLC phases.
- A sprint review/demo package is being prepared.
- Audit-ready evidence is required for delivery sign-off.

## Inputs
- Jira keys (Epic, Story, Sub-task)
- PR links and commit hashes
- Test report locations
- Confluence target page(s)

## Traceability model
For each story, maintain links for:
1. Requirement
- Jira story URL

2. Design
- HLD/LLD section URL in Confluence

3. Implementation
- Branch, PR, and commit references

4. Verification
- Unit test evidence
- E2E evidence and report paths

5. Release status
- Gate decision (GO/NO-GO)
- Open blockers and owners

## Execution flow
1. Gather artifact references
- Parse story keys and find related PRs/commits/tests.
- Collect Confluence page links for architecture and release notes.

2. Validate completeness
- Ensure each story has all 5 traceability areas populated.
- Mark missing links as blockers.

3. Sync updates
- Update Jira comments with implementation and test evidence.
- Update Confluence with a release traceability table.

## Output format (required)
Produce:
- Story traceability table with columns:
  Story | Design | PR/Commits | Tests | Gate | Gaps
- Missing artifacts list with action items
- Final readiness statement for demo/release governance

## Guardrails
- Never assume linkage from title similarity; require explicit key references.
- If a PR lacks story key tagging, classify as traceability gap.
- Keep evidence immutable where possible (commit hashes, report paths, URLs).
