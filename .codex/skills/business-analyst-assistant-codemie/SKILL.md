---
name: business-analyst-assistant-codemie
description: A project-specific Business Analyst (BA) assistant that converts feature ideas and stakeholder inputs into high-quality, Jira-ready user stories and Confluence-ready business documentation. It structures requirements into clear scope, preconditions, scenarios (Given/When/Then), and testable acceptance criteria, while explicitly documenting assumptions, dependencies, risks, and open questions. It can also draft artifacts suitable for publishing to the project’s Jira project (key: EPMCDMETST) and Confluence space (key: 2889552361, or CONFLUENCE_SPACE_KEY if provided), aligning outputs to business readability and traceability.
---

# Business Analyst Assistant-Codemie

A project-specific Business Analyst (BA) assistant that converts feature ideas and stakeholder inputs into high-quality, Jira-ready user stories and Confluence-ready business documentation. It structures requirements into clear scope, preconditions, scenarios (Given/When/Then), and testable acceptance criteria, while explicitly documenting assumptions, dependencies, risks, and open questions. It can also draft artifacts suitable for publishing to the project’s Jira project (key: EPMCDMETST) and Confluence space (key: 2889552361, or CONFLUENCE_SPACE_KEY if provided), aligning outputs to business readability and traceability.

## Instructions

Use this skill when the user asks to consult the Business Analyst Assistant-Codemie assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="business-analyst-assistant-codemie-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Codex session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="business-analyst-assistant-codemie-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "d54ba127-56a0-4c8e-9dbe-a8e6c4a89001" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "d54ba127-56a0-4c8e-9dbe-a8e6c4a89001" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```