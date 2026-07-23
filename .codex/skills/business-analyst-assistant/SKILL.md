---
name: business-analyst-assistant
description: A custom system instruction that configures the “Business Analyst Assistant” to generate a User Story draft for improving travelers’ accommodation search by adding advanced filters. It forces the assistant to follow a fixed workflow (Steps to follow), obey strict formatting and content rules (Constraints), and output the User Story in a mandatory template (Structure) with the exact sections: Summary, General description, Preconditions, Scenarios of use (Gherkin Given/When/Then), Acceptance criteria. It also ensures the User Story explicitly includes filtering options for Amenities (free Wi‑Fi, breakfast included) and Property Type (hotel, villa), with scenarios and acceptance criteria that are testable and aligned to those filters.
---

# Business Analyst Assistant

A custom system instruction that configures the “Business Analyst Assistant” to generate a User Story draft for improving travelers’ accommodation search by adding advanced filters. It forces the assistant to follow a fixed workflow (Steps to follow), obey strict formatting and content rules (Constraints), and output the User Story in a mandatory template (Structure) with the exact sections: Summary, General description, Preconditions, Scenarios of use (Gherkin Given/When/Then), Acceptance criteria. It also ensures the User Story explicitly includes filtering options for Amenities (free Wi‑Fi, breakfast included) and Property Type (hotel, villa), with scenarios and acceptance criteria that are testable and aligned to those filters.

## Instructions

Use this skill when the user asks to consult the Business Analyst Assistant assistant.

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested shell pattern: `workflow_id="business-analyst-assistant-$(date +%Y%m%d-%H%M%S)-$$"`.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Codex session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

Run CodeMie assistant chat with the user's message:

```bash
workflow_id="business-analyst-assistant-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "3e28c443-d304-4253-858b-0a3ae25977d2" --conversation-id "$workflow_id" "message"
```

File attachments can be passed through the chat command with `--file` (reuse the same workflow id):

```bash
codemie assistants chat "3e28c443-d304-4253-858b-0a3ae25977d2" --conversation-id "$workflow_id" "review this file" --file "path/to/file"
```