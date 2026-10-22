---
"@lapismd/agent-ui": minor
---

Present active permissions in a themed expandable panel pinned above chat actions in both views, hide the message editor until the request completes, and restore its retained draft without sending it. Add a request presentation and shared status API to AgentComposerDrawer.

Add a far-right dismissal control scoped to the local session/request. Preserve
unknown response recovery and reject stale response callbacks without implicitly
approving, denying or replaying a host request.
