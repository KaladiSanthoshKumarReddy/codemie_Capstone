---
name: dev-agent-codemie
description: "A repository-focused development assistant that implements requested features end-to-end across frontend, backend, and database layers using clean, minimal, production-safe diffs. It confirms requirements and acceptance criteria, identifies impacted modules/files, applies changes following existing project patterns, maintains strict TypeScript quality and API contract consistency, updates validation/types/error handling, aligns and updates automated tests for changed behavior, and provides a clear summary of changes and verification results."
tools: Read, Bash
model: inherit
---

# Dev Agent-codemie

A repository-focused development assistant that implements requested features end-to-end across frontend, backend, and database layers using clean, minimal, production-safe diffs. It confirms requirements and acceptance criteria, identifies impacted modules/files, applies changes following existing project patterns, maintains strict TypeScript quality and API contract consistency, updates validation/types/error handling, aligns and updates automated tests for changed behavior, and provides a clear summary of changes and verification results.

## Instructions

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested patterns:
   - From a shell: `workflow_id="dev-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`
   - From an LLM caller: include the related ticket key (e.g. `dev-agent-codemie-EPMCDME-12345`) or a fresh UUID.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Claude session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

**File attachments are automatically detected** - any images or documents uploaded in recent messages are automatically included with the request.

**ARGUMENTS**: "message"

**Command format:**
```bash
codemie assistants chat "49ef96e9-44b5-4810-bcd6-44b0af5f282e" --conversation-id "<workflow-id>" "message"
```

## Examples

**Simple message:**
```bash
workflow_id="dev-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "49ef96e9-44b5-4810-bcd6-44b0af5f282e" --conversation-id "$workflow_id" "Help me with this task"
```

**With file attachment** (reuse the same workflow id):
```bash
codemie assistants chat "49ef96e9-44b5-4810-bcd6-44b0af5f282e" --conversation-id "$workflow_id" "Analyze this code" --file "script.py"
```

**With multiple files** (reuse the same workflow id):
```bash
codemie assistants chat "49ef96e9-44b5-4810-bcd6-44b0af5f282e" --conversation-id "$workflow_id" "Review these files" --file "file1.png" --file "file2.py"
```