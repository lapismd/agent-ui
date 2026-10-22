export const Basic = `<script lang="ts">
  import { AgentQuestionCard, AgentRequestController, type UserInputRequest, type UserInputAnswers } from "@lapismd/agent-ui/chat";
  const controller = new AgentRequestController();
  const request: UserInputRequest = { id: "question-1", title: "Configure search", questions: [{ id: "environment", header: "Environment", prompt: "Choose an environment", options: [{ id: "dev", label: "Development", value: "development" }], allowOther: true, optionLabels: "letters", inputMode: "textarea", placeholder: "Enter a completely different answer…", secret: false }] };
  function respond(answers: UserInputAnswers) { console.log(request.id, answers); }
</script>
<AgentQuestionCard {request} {controller} sessionId="chat-1" onRespond={respond} />`;
export const Styling = `<script lang="ts">
  import { AgentQuestionCard, type UserInputRequest, type UserInputAnswers } from "@lapismd/agent-ui/chat";
  let { request, onRespond }: { request: UserInputRequest; onRespond(answers: UserInputAnswers): void } = $props();
</script>
<div style="--ui-agent-request-option-gap: 0.75rem; --ui-agent-request-option-padding: 1rem">
  <AgentQuestionCard {request} {onRespond} />
</div>`;
