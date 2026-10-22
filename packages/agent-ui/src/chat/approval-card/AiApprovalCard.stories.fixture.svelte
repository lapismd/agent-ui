<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import Approval from "./AiApprovalCard.svelte";
  import Question from "../question-card/AiQuestionCard.svelte";
  import { createDemo } from "../../../../../catalog/agents/support/create-demo.svelte.js";
  import type { UserInputAnswers } from "../requests.js";
  let {
    question = false,
    disabled = false,
    freeText = false,
  }: { question?: boolean; disabled?: boolean; freeText?: boolean } = $props();
  const demo = untrack(() => createDemo(question ? "question" : "approval"));
  const interaction = untrack(
    () => demo.panel.attachmentsState.pendingInteraction!,
  );
  if (interaction.type === "question" && untrack(() => freeText))
    interaction.request.questions[0].options = [];
  let response = $state("");
  async function approve(option: string) {
    await demo.panel.controller.respondToApproval(
      interaction.request.id,
      option,
      interaction.id,
    );
    response = `Acknowledged ${option} for ${interaction.request.id}`;
  }
  async function answer(answers: UserInputAnswers) {
    await demo.panel.controller.respondToQuestion(
      interaction.request.id,
      answers,
      interaction.id,
    );
    response = `Acknowledged ${JSON.stringify(answers)}`;
  }
  onDestroy(() => void demo.close());
</script>

{#if response}<p role="status">{response}</p>
{:else if interaction.type === "approval"}<Approval
    request={interaction.request}
    {disabled}
    onRespond={approve}
  />
{:else}<Question
    request={interaction.request}
    {disabled}
    onRespond={answer}
  />{/if}
