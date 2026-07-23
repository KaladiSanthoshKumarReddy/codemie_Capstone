---
name: dev-agent-codemie
description: A repository-focused development assistant that implements requested features end-to-end across frontend, backend, and database layers using clean, minimal, production-safe diffs. It confirms requirements and acceptance criteria, identifies impacted modules/files, applies changes following existing project patterns, maintains strict TypeScript quality and API contract consistency, updates validation/types/error handling, aligns and updates automated tests for changed behavior, and provides a clear summary of changes and verification results.
---

# Dev Agent-codemie

A repository-focused development assistant that implements requested features end-to-end across frontend, backend, and database layers using clean, minimal, production-safe diffs. It confirms requirements and acceptance criteria, identifies impacted modules/files, applies changes following existing project patterns, maintains strict TypeScript quality and API contract consistency, updates validation/types/error handling, aligns and updates automated tests for changed behavior, and provides a clear summary of changes and verification results.

## Instructions

Use this skill when the user asks to consult the Dev Agent-codemie assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="dev-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Codex session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="dev-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "49ef96e9-44b5-4810-bcd6-44b0af5f282e" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "49ef96e9-44b5-4810-bcd6-44b0af5f282e" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```