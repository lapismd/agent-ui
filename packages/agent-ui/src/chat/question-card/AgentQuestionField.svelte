<script lang="ts">
  import * as Field from "@lapismd/design-core/shadcn/field";
  import * as RadioGroup from "@lapismd/design-core/shadcn/radio-group";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import { Checkbox } from "@lapismd/design-core/shadcn/checkbox";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Textarea } from "@lapismd/design-core/shadcn/textarea";
  import type { UserInputQuestion } from "../requests.js";
  import type { AgentRequestController } from "../request-controller.svelte.js";
  let {
    question,
    controller,
    sessionId,
    requestId,
    disabled,
    heading = true,
  }: {
    question: UserInputQuestion;
    controller: AgentRequestController;
    sessionId: string;
    requestId: string;
    disabled: boolean;
    heading?: boolean;
  } = $props();
  const id = $props.id();
  const draft = $derived(controller.get(sessionId, requestId));
  const selected = $derived(draft.selections[question.id] ?? []);
  const text = $derived(draft.text[question.id] ?? "");
  const other = $derived(
    question.allowOther && (draft.other[question.id] ?? false),
  );
  function ordinal(index: number): string {
    if (question.optionLabels === "numbers") return String(index + 1);
    let label = "";
    for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26))
      label = String.fromCharCode(65 + ((n - 1) % 26)) + label;
    return label;
  }
</script>

{#snippet choiceLabel(index: number, label: string, description?: string)}
  {#if question.optionLabels !== "none"}<Badge
      variant="default"
      class="agent-question-option-key"
      aria-hidden="true">{ordinal(index)}</Badge
    >{/if}
  <span
    ><span>{label}</span>{#if description}<small>{description}</small
      >{/if}</span
  >
{/snippet}

<Field.Set class="agent-question-field" {disabled}>
  <Field.Legend class={heading ? undefined : "sr-only"} id={`${id}-legend`}
    >{question.prompt}</Field.Legend
  >
  {#if heading && question.description}<Field.Description
      >{question.description}</Field.Description
    >{/if}
  {#if question.options?.length}
    {#if question.selectionMode === "multiple"}
      <Field.Group class="agent-question-options">
        {#each question.options as option, index (option.id)}
          <Field.Label
            class="agent-question-option"
            data-selected={selected.includes(option.id)}
            for={`${id}-${index}`}
            ><Checkbox
              id={`${id}-${index}`}
              checked={selected.includes(option.id)}
              {disabled}
              onCheckedChange={() =>
                controller.select(sessionId, requestId, question, option.id)}
            />{@render choiceLabel(
              index,
              option.label,
              option.description,
            )}</Field.Label
          >
        {/each}
        {#if question.allowOther}<Field.Label
            class="agent-question-option"
            data-selected={other}
            for={`${id}-other`}
            ><Checkbox
              id={`${id}-other`}
              checked={other}
              {disabled}
              onCheckedChange={() =>
                controller.chooseOther(sessionId, requestId, question)}
            />{@render choiceLabel(
              question.options.length,
              "Other",
              "Enter a completely different answer",
            )}</Field.Label
          >{/if}
      </Field.Group>
    {:else}
      <RadioGroup.Root
        class="agent-question-options"
        aria-labelledby={`${id}-legend`}
        {disabled}
        value={other ? "other" : selected[0] ? `option/${selected[0]}` : ""}
        onValueChange={(value) => {
          if (value === "other") {
            if (!other) controller.chooseOther(sessionId, requestId, question);
          } else if (value.startsWith("option/"))
            controller.select(sessionId, requestId, question, value.slice(7));
        }}
      >
        {#each question.options as option, index (option.id)}
          <Field.Label
            class="agent-question-option"
            data-selected={!other && selected.includes(option.id)}
            for={`${id}-${index}`}
            ><RadioGroup.Item
              id={`${id}-${index}`}
              value={`option/${option.id}`}
            />{@render choiceLabel(
              index,
              option.label,
              option.description,
            )}</Field.Label
          >
        {/each}
        {#if question.allowOther}<Field.Label
            class="agent-question-option"
            data-selected={other}
            for={`${id}-other`}
            ><RadioGroup.Item
              id={`${id}-other`}
              value="other"
            />{@render choiceLabel(
              question.options.length,
              "Other",
              "Enter a completely different answer",
            )}</Field.Label
          >{/if}
      </RadioGroup.Root>
    {/if}
  {/if}
  {#if !question.options?.length || other}
    <Field.Field>
      <Field.Label class="sr-only" for={`${id}-answer`}
        >{question.header} answer</Field.Label
      >
      {#if question.inputMode === "textarea" && !question.secret}<Textarea
          id={`${id}-answer`}
          aria-label={`${question.header} answer`}
          placeholder={question.placeholder}
          value={text}
          maxlength={question.maxLength}
          rows={4}
          {disabled}
          oninput={(event) =>
            controller.text(
              sessionId,
              requestId,
              question.id,
              event.currentTarget.value,
            )}
        />
      {:else}<Input
          id={`${id}-answer`}
          type={question.secret ? "password" : "text"}
          aria-label={`${question.header} answer`}
          autocomplete="off"
          placeholder={question.placeholder}
          value={text}
          maxlength={question.maxLength}
          {disabled}
          oninput={(event) =>
            controller.text(
              sessionId,
              requestId,
              question.id,
              event.currentTarget.value,
            )}
        />{/if}
      {#if !question.secret && (question.showCharacterCount || question.maxLength !== undefined)}<span
          class="agent-question-count"
          >{text.length}{question.maxLength !== undefined
            ? ` / ${question.maxLength}`
            : ""}</span
        >{/if}
    </Field.Field>
  {/if}
</Field.Set>
