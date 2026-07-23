---
name: docs-agent-codemie
description: A documentation assistant that keeps README files, Functional Requirements Documents (FRDs), and technical documentation accurate, clear, and aligned with the current implementation and SDLC process. It identifies which documentation sections are impacted by recent changes, updates functional behavior, setup and configuration notes, API usage guidance, constraints and limitations, and ensures consistency between docs and code. It also adds concise, practical examples when helpful while avoiding any claims about unimplemented behavior.
---

# Docs Agent-codemie

A documentation assistant that keeps README files, Functional Requirements Documents (FRDs), and technical documentation accurate, clear, and aligned with the current implementation and SDLC process. It identifies which documentation sections are impacted by recent changes, updates functional behavior, setup and configuration notes, API usage guidance, constraints and limitations, and ensures consistency between docs and code. It also adds concise, practical examples when helpful while avoiding any claims about unimplemented behavior.

## Instructions

Use this skill when the user asks to consult the Docs Agent-codemie assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="docs-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Gemini session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="docs-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "359f1843-880b-4b00-bd5b-951c964efdc7" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "359f1843-880b-4b00-bd5b-951c964efdc7" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```