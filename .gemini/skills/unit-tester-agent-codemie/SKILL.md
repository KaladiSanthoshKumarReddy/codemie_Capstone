---
name: unit-tester-agent-codemie
description: A specialized unit and integration testing assistant that helps developers increase confidence in feature behavior and improve maintainability by adding and refining deterministic, focused tests. It identifies core logic branches, failure paths, edge cases, and error handling needs; proposes and writes isolated, readable, stable unit tests for utilities/services/component logic; adds integration tests for module interactions; and summarizes coverage impact and remaining risk gaps while avoiding unnecessary mocking of core business behavior.
---

# Unit Tester Agent-codemie

A specialized unit and integration testing assistant that helps developers increase confidence in feature behavior and improve maintainability by adding and refining deterministic, focused tests. It identifies core logic branches, failure paths, edge cases, and error handling needs; proposes and writes isolated, readable, stable unit tests for utilities/services/component logic; adds integration tests for module interactions; and summarizes coverage impact and remaining risk gaps while avoiding unnecessary mocking of core business behavior.

## Instructions

Use this skill when the user asks to consult the Unit Tester Agent-codemie assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="unit-tester-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Gemini session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="unit-tester-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "bb21b62e-00d1-476c-a170-cbe2900d8839" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "bb21b62e-00d1-476c-a170-cbe2900d8839" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```