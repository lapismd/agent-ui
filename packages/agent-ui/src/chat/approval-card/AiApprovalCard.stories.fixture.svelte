<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import Approval from "./AiApprovalCard.svelte";
  import Question from "../question-card/AiQuestionCard.svelte";
  import {
    permissionRequest,
    questionRequest,
  } from "../../../../../catalog/agents/requests/data.js";
  import { MemoryAgentPort } from "../../../../../catalog/support/agent-adapter.js";
  import { AgentUiController } from "../../core/controller.svelte.js";
  import type {
    AgentRequestStatus,
    AgentRequestState,
  } from "../request-state.js";
  import type { UserInputAnswers } from "../requests.js";
  let {
    question = false,
    disabled = false,
    freeText = false,
    variant = "basic",
    status = "pending",
    fault = "none",
  }: {
    question?: boolean;
    disabled?: boolean;
    freeText?: boolean;
    variant?: string;
    status?: AgentRequestStatus;
    fault?: "none" | "failed" | "unknown";
  } = $props();
  const approval = untrack(() => permissionRequest(variant));
  const input = untrack(() =>
    questionRequest(freeText ? "free-text" : variant),
  );
  const port = new MemoryAgentPort();
  port.fault = untrack(() => fault);
  port.snapshot.requests = untrack(() => question)
    ? [
        {
          id: input.id,
          kind: "question",
          title: input.title,
          details: "Question",
          options: [],
          question: input,
        },
      ]
    : [
        {
          id: approval.id,
          kind: "approval",
          title: approval.title,
          details: "Permission",
          options: approval.options,
          approval,
        },
      ];
  const initial = structuredClone(port.snapshot);
  const owner = new AgentUiController(port, port.snapshot);
  const requestId = untrack(() => (question ? input.id : approval.id));
  const result = $derived(
    Object.values(owner.snapshot?.requestResults ?? {})[0],
  );
  const responseState = $derived(
    status !== "pending"
      ? {
          status,
          message:
            status === "unavailable"
              ? "The host does not offer an interactive response for this captured request."
              : undefined,
        }
      : (owner.requestFeedback?.state ??
          result?.state ?? { status: "pending" }),
  );
  const feedback = $derived(
    !owner.snapshot?.requests.length && !owner.pending
      ? "Acknowledged " +
          (question
            ? "answer"
            : (port.calls.at(-1)?.values?.option ?? "response"))
      : "",
  );
  const respond = (option: string) =>
    owner.respondToApproval(approval.id, option, approval.id);
  const answer = (answers: UserInputAnswers) =>
    owner.respondToQuestion(input.id, answers, input.id);
  function reset() {
    port.snapshot = structuredClone(initial);
    port.calls = [];
    owner.snapshot = structuredClone(initial);
    owner.pending = undefined;
    owner.interaction = undefined;
    owner.requestFeedback = undefined;
    owner.requests.clear(owner.sessionId, requestId);
  }
  onDestroy(() => void owner.close());
</script>

<div class="request-story">
  {#if question}<Question
      request={input}
      controller={owner.requests}
      sessionId={owner.sessionId}
      state={responseState as AgentRequestState}
      {disabled}
      onRespond={answer}
    />
  {:else}<Approval
      request={approval}
      controller={owner.requests}
      sessionId={owner.sessionId}
      state={responseState as AgentRequestState}
      {disabled}
      onRespond={respond}
    />{/if}
  {#if owner.pending}<Button
      variant="outline"
      size="sm"
      onclick={() => void owner.checkStatus()}>Check response</Button
    >{/if}
  {#if feedback || owner.pending || owner.requestFeedback?.state.status === "refused"}<Button
      variant="ghost"
      size="sm"
      onclick={reset}>Reset example</Button
    >{/if}
  {#if feedback}<p role="status">{feedback}</p>{/if}
</div>

<style>
  .request-story {
    box-sizing: border-box;
    max-width: 44rem;
    padding: 1.5rem;
  }
  p {
    color: var(--muted-foreground);
    font-size: 0.75rem;
  }
</style>
