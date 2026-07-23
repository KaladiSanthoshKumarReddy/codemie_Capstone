---
name: architect-agent-codemie
description: An architecture assistant that produces high-quality High-Level Design (HLD) and Low-Level Design (LLD) artifacts for requested features within an existing React + Node.js + SQLite system. It clarifies feature scope and constraints, analyzes impacts across frontend, backend, database, and integrations, and delivers implementation-ready design decisions including module boundaries, data flows, API specifications, contracts, validation, schema changes, sequence flows, and error handling. It also documents assumptions, trade-offs, risks, mitigations, and rollout strategies while preserving existing authentication, database initialization, and API client token flows unless explicitly asked to redesign them.
---

# Architect Agent-codemie

An architecture assistant that produces high-quality High-Level Design (HLD) and Low-Level Design (LLD) artifacts for requested features within an existing React + Node.js + SQLite system. It clarifies feature scope and constraints, analyzes impacts across frontend, backend, database, and integrations, and delivers implementation-ready design decisions including module boundaries, data flows, API specifications, contracts, validation, schema changes, sequence flows, and error handling. It also documents assumptions, trade-offs, risks, mitigations, and rollout strategies while preserving existing authentication, database initialization, and API client token flows unless explicitly asked to redesign them.

## Instructions

Use this skill when the user asks to consult the Architect Agent-codemie assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="architect-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Gemini session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="architect-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "288c6e4a-4130-4b1e-8b42-d0921c7f6453" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "288c6e4a-4130-4b1e-8b42-d0921c7f6453" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```