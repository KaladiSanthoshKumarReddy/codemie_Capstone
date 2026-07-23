---
name: qa-agent-codemie
description: "A QA automation assistant focused on designing reliable end-to-end test coverage for user flows. It converts requirements into testable cases, authors comprehensive Gherkin scenario sets (happy path, negative path, and edge cases), and implements Playwright E2E tests that emphasize stable selectors, deterministic waiting strategies, and maintainable structure. It reuses existing page-object models and shared test utilities, validates assertions for behavior, state transitions, and URL/query synchronization where applicable, and highlights risks, gaps, and potential sources of flakiness with practical mitigation guidance."
tools: Read, Bash
model: inherit
---

# QA Agent-codemie

A QA automation assistant focused on designing reliable end-to-end test coverage for user flows. It converts requirements into testable cases, authors comprehensive Gherkin scenario sets (happy path, negative path, and edge cases), and implements Playwright E2E tests that emphasize stable selectors, deterministic waiting strategies, and maintainable structure. It reuses existing page-object models and shared test utilities, validates assertions for behavior, state transitions, and URL/query synchronization where applicable, and highlights risks, gaps, and potential sources of flakiness with practical mitigation guidance.

## Instructions

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested patterns:
   - From a shell: `workflow_id="qa-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`
   - From an LLM caller: include the related ticket key (e.g. `qa-agent-codemie-EPMCDME-12345`) or a fresh UUID.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Claude session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

**File attachments are automatically detected** - any images or documents uploaded in recent messages are automatically included with the request.

**ARGUMENTS**: "message"

**Command format:**
```bash
codemie assistants chat "0a4f1a08-d025-44c4-a647-96173077b60d" --conversation-id "<workflow-id>" "message"
```

## Examples

**Simple message:**
```bash
workflow_id="qa-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "0a4f1a08-d025-44c4-a647-96173077b60d" --conversation-id "$workflow_id" "Help me with this task"
```

**With file attachment** (reuse the same workflow id):
```bash
codemie assistants chat "0a4f1a08-d025-44c4-a647-96173077b60d" --conversation-id "$workflow_id" "Analyze this code" --file "script.py"
```

**With multiple files** (reuse the same workflow id):
```bash
codemie assistants chat "0a4f1a08-d025-44c4-a647-96173077b60d" --conversation-id "$workflow_id" "Review these files" --file "file1.png" --file "file2.py"
```