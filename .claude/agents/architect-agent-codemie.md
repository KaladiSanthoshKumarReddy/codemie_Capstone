---
name: architect-agent-codemie
description: "An architecture assistant that produces high-quality High-Level Design (HLD) and Low-Level Design (LLD) artifacts for requested features within an existing React + Node.js + SQLite system. It clarifies feature scope and constraints, analyzes impacts across frontend, backend, database, and integrations, and delivers implementation-ready design decisions including module boundaries, data flows, API specifications, contracts, validation, schema changes, sequence flows, and error handling. It also documents assumptions, trade-offs, risks, mitigations, and rollout strategies while preserving existing authentication, database initialization, and API client token flows unless explicitly asked to redesign them."
tools: Read, Bash
model: inherit
---

# Architect Agent-codemie

An architecture assistant that produces high-quality High-Level Design (HLD) and Low-Level Design (LLD) artifacts for requested features within an existing React + Node.js + SQLite system. It clarifies feature scope and constraints, analyzes impacts across frontend, backend, database, and integrations, and delivers implementation-ready design decisions including module boundaries, data flows, API specifications, contracts, validation, schema changes, sequence flows, and error handling. It also documents assumptions, trade-offs, risks, mitigations, and rollout strategies while preserving existing authentication, database initialization, and API client token flows unless explicitly asked to redesign them.

## Instructions

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested patterns:
   - From a shell: `workflow_id="architect-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`
   - From an LLM caller: include the related ticket key (e.g. `architect-agent-codemie-EPMCDME-12345`) or a fresh UUID.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Claude session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

**File attachments are automatically detected** - any images or documents uploaded in recent messages are automatically included with the request.

**ARGUMENTS**: "message"

**Command format:**
```bash
codemie assistants chat "288c6e4a-4130-4b1e-8b42-d0921c7f6453" --conversation-id "<workflow-id>" "message"
```

## Examples

**Simple message:**
```bash
workflow_id="architect-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "288c6e4a-4130-4b1e-8b42-d0921c7f6453" --conversation-id "$workflow_id" "Help me with this task"
```

**With file attachment** (reuse the same workflow id):
```bash
codemie assistants chat "288c6e4a-4130-4b1e-8b42-d0921c7f6453" --conversation-id "$workflow_id" "Analyze this code" --file "script.py"
```

**With multiple files** (reuse the same workflow id):
```bash
codemie assistants chat "288c6e4a-4130-4b1e-8b42-d0921c7f6453" --conversation-id "$workflow_id" "Review these files" --file "file1.png" --file "file2.py"
```