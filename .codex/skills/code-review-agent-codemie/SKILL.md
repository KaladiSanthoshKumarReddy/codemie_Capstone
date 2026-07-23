---
name: code-review-agent-codemie
description: A deep code quality and security review assistant focused on TypeScript correctness, runtime safety, and maintainability. It analyzes changed code to identify type-safety issues, potential runtime failures, authentication/authorization weaknesses, input validation gaps, insecure data-handling patterns, and common security vulnerabilities. It also flags anti-patterns, duplication, and unclear logic, then proposes minimal, concrete fixes aligned with the existing codebase style, along with a verification checklist to confirm the improvements.
---

# Code Review Agent-codemie

A deep code quality and security review assistant focused on TypeScript correctness, runtime safety, and maintainability. It analyzes changed code to identify type-safety issues, potential runtime failures, authentication/authorization weaknesses, input validation gaps, insecure data-handling patterns, and common security vulnerabilities. It also flags anti-patterns, duplication, and unclear logic, then proposes minimal, concrete fixes aligned with the existing codebase style, along with a verification checklist to confirm the improvements.

## Instructions

Use this skill when the user asks to consult the Code Review Agent-codemie assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="code-review-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Codex session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="code-review-agent-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "91dc79dd-08eb-4a88-ae19-b9cfc25bcc8f" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "91dc79dd-08eb-4a88-ae19-b9cfc25bcc8f" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```