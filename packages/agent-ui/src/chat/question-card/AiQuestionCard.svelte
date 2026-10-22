<!-- SPDX-License-Identifier: Apache-2.0; adapted Lapis AI question presentation. -->
<script lang="ts">
  import { untrack } from "svelte";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Spinner } from "@lapismd/design-core/shadcn/spinner";
  import AgentRequestFrame from "../approval-card/AgentRequestFrame.svelte";
  import AgentQuestionField from "./AgentQuestionField.svelte";
  import {
    AgentRequestController,
    questionAnswers,
    questionsComplete,
  } from "../request-controller.svelte.js";
  import { requestEditable, type AgentRequestState } from "../request-state.js";
  import type { UserInputRequest, UserInputAnswers } from "../requests.js";
  let {
    request,
    disabled = false,
    onRespond,
    controller,
    sessionId = "",
    state: requestState = { status: "pending" },
    submitLabel = "Submit answer",
  }: {
    request: UserInputRequest;
    disabled?: boolean;
    onRespond(answers: UserInputAnswers): void | Promise<unknown>;
    controller?: AgentRequestController;
    sessionId?: string;
    state?: AgentRequestState;
    submitLabel?: string;
  } = $props();
  const local = new AgentRequestController();
  let requestIdentity = $state("");
  $effect(() => {
    if (!controller && ["answered", "cancelled"].includes(requestState.status))
      untrack(() => local.clear(sessionId, request.id));
    if (requestIdentity !== request.id) {
      requestIdentity = request.id;
      failure = "";
    }
  });
  const drafts = $derived(controller ?? local);
  let responding = $state(false),
    failure = $state("");
  const blocked = $derived(
    disabled || responding || !requestEditable(requestState),
  );
  const complete = $derived(
    questionsComplete(request, drafts.get(sessionId, request.id)),
  );
  const effective = $derived(
    failure && requestState.status === "pending"
      ? { status: "refused" as const, message: failure }
      : requestState,
  );
  async function submit() {
    if (blocked || !complete) return;
    responding = true;
    failure = "";
    try {
      await onRespond(
        questionAnswers(request, drafts.get(sessionId, request.id)),
      );
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
    } finally {
      responding = false;
    }
  }
</script>

<form
  class="agent-question-form"
  onsubmit={(event) => {
    event.preventDefault();
    void submit();
  }}
>
  <AgentRequestFrame
    showActions={requestEditable(requestState) ||
      requestState.status === "submitting" ||
      requestState.status === "unknown"}
    title={request.questions.length === 1
      ? request.questions[0].prompt
      : request.title}
    description={request.questions.length === 1
      ? request.questions[0].description
      : undefined}
    kind="question"
    state={responding ? { status: "submitting" } : effective}
  >
    {#if requestEditable(requestState) || requestState.status === "submitting" || requestState.status === "unknown"}
      <Field.Group class="agent-question-fields">
        {#each request.questions as question (question.id)}<AgentQuestionField
            {question}
            heading={request.questions.length !== 1}
            controller={drafts}
            {sessionId}
            requestId={request.id}
            disabled={blocked}
          />{/each}
      </Field.Group>
    {/if}
    {#snippet actions()}{#if requestEditable(requestState) || requestState.status === "submitting" || requestState.status === "unknown"}<Button
          type="submit"
          disabled={blocked || !complete}
          >{#if responding || requestState.status === "submitting"}<Spinner
              data-icon="inline-start"
            />{/if}{submitLabel}</Button
        >{/if}{/snippet}
  </AgentRequestFrame>
</form>
