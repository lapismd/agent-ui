export const Basic = `<script lang="ts">
  import { AgentApprovalCard, AgentRequestController, type ApprovalRequest } from "@lapismd/agent-ui/chat";
  const controller = new AgentRequestController();
  const request: ApprovalRequest = { id: "permission-1", kind: "read", title: "Read project files", details: { resources: [{ path: "notes/plan.md", access: "Read access" }] }, options: [{ id: "opaque-allow", label: "Allow once", kind: "allow-once" }, { id: "opaque-deny", label: "Deny", kind: "deny-once" }] };
  let responseState = $state({ status: "pending" as const });
  async function respond(optionId: string) { console.log(request.id, optionId); }
</script>
<AgentApprovalCard {request} {controller} state={responseState} sessionId="chat-1" onRespond={respond} />`;
export const Styling = `<script lang="ts">
  import { AgentApprovalCard, type ApprovalRequest } from "@lapismd/agent-ui/chat";
  let { request, onRespond }: { request: ApprovalRequest; onRespond(id: string): void } = $props();
</script>
<div style="--ui-agent-request-padding: 1.25rem; --ui-agent-request-radius: 1rem">
  <AgentApprovalCard {request} {onRespond} />
</div>`;
