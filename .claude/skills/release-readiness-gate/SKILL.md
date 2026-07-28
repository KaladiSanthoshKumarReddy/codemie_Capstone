---
name: release-readiness-gate
description: Use this skill to perform a strict go/no-go release gate for one or more Jira stories by validating acceptance criteria, test evidence, PR status, and build health, then producing a decision report with blockers and required actions.
---

# Release Readiness Gate

## Why this skill
Your current AI SDLC already covers implementation, review, and testing. The main gap is a final, repeatable release gate that prevents partial or unverified work from being promoted.

## Use when
- You are about to merge or release a feature batch.
- You need a formal go/no-go decision for stories.
- Stakeholders ask for deployment confidence and explicit risks.

## Inputs
- Jira story keys (example: EPMCDMETST-55844, EPMCDMETST-55845)
- Target branch and PR links
- Scope of release (single story, sprint batch, hotfix)

## Mandatory checks
1. Story state and acceptance criteria
- Story status is in a releasable state.
- Acceptance criteria are mapped to implemented behavior.

2. Code quality and review
- All required reviews are approved.
- No unresolved high-severity review findings.

3. Verification evidence
- Unit tests pass for impacted modules.
- E2E scenarios pass for impacted user journeys.
- Build passes without new type or lint errors.

4. Security and reliability
- No known auth/authorization regression.
- No unresolved high-risk defects in scope.

## Execution flow
1. Collect evidence
- Run project checks from repo root:
```bash
npm run test:unit
npm run test:e2e
npm run build
```

2. Validate against stories
- Confirm each story has implementation evidence, tests, and review closure.
- Flag missing links between story and PR/commit/test.

3. Produce gate decision
- GO: all mandatory checks passed.
- NO-GO: at least one mandatory check failed.

## Output format (required)
Return a concise report with:
- Decision: GO or NO-GO
- Checked stories
- Passed checks
- Failed checks
- Blockers (if any)
- Exact remediation actions and owner suggestions
- Residual risk summary

## Guardrails
- Do not mark GO when E2E coverage is missing for changed user flows.
- Do not infer completion from code only; require test and review evidence.
- If evidence is unavailable, classify as NO-GO with reason: insufficient evidence.
