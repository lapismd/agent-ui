<!-- SPDX-License-Identifier: Apache-2.0; adapted Lapis AI request presentation. -->
<script lang="ts">
  import { untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Spinner } from "@lapismd/design-core/shadcn/spinner";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import AgentRequestFrame from "./AgentRequestFrame.svelte";
  import AgentPermissionDetails from "./AgentPermissionDetails.svelte";
  import { AgentRequestController } from "../request-controller.svelte.js";
  import { requestEditable, type AgentRequestState } from "../request-state.js";
  import type { ApprovalRequest } from "../requests.js";
  let {
    request,
    disabled = false,
    onRespond,
    controller,
    sessionId = "",
    state: requestState = { status: "pending" },
  }: {
    request: ApprovalRequest;
    disabled?: boolean;
    onRespond(optionId: string): void | Promise<unknown>;
    controller?: AgentRequestController;
    sessionId?: string;
    state?: AgentRequestState;
  } = $props();
  const local = new AgentRequestController();
  const drafts = $derived(controller ?? local);
  let responding = $state(false),
    failure = $state("");
  let identity = $state(untrack(() => request.id));
  $effect(() => {
    if (identity !== request.id) {
      identity = request.id;
      failure = "";
    }
  });
  const effective = $derived(
    failure && requestState.status === "pending"
      ? { status: "refused" as const, message: failure }
      : requestState,
  );
  const allow = $derived(
    request.options.filter((option) =>
      ["allow-once", "allow-session", "allow-always"].includes(option.kind),
    ),
  );
  const deny = $derived(
    request.options.filter((option) =>
      ["deny-once", "deny-always"].includes(option.kind),
    ),
  );
  const selected = $derived(
    allow.find(
      (option) => option.id === drafts.get(sessionId, request.id).optionId,
    ) ??
      allow.find((option) => option.kind === "allow-once") ??
      allow[0],
  );
  const denial = $derived(
    deny.find((option) => option.kind === "deny-once") ?? deny[0],
  );
  const extras = $derived(
    request.options.filter(
      (option) => !allow.includes(option) && option !== denial,
    ),
  );
  const blocked = $derived(
    disabled || responding || !requestEditable(requestState),
  );
  async function respond(optionId: string) {
    if (blocked || !request.options.some((option) => option.id === optionId))
      return;
    responding = true;
    failure = "";
    try {
      await onRespond(optionId);
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
    } finally {
      responding = false;
    }
  }
</script>

<AgentRequestFrame
  showActions={requestEditable(requestState) ||
    requestState.status === "submitting" ||
    requestState.status === "unknown"}
  title={request.title}
  description={request.details?.description ?? request.tool?.name}
  kind={request.kind}
  state={responding ? { status: "submitting" } : effective}
  origin={request.origin}
>
  <AgentPermissionDetails {request} />
  {#snippet actions()}
    {#if requestEditable(requestState) || requestState.status === "submitting" || requestState.status === "unknown"}
      {#if selected}<Button
          disabled={blocked}
          onclick={() => void respond(selected.id)}
          >{#if responding || requestState.status === "submitting"}<Spinner
              data-icon="inline-start"
            />{/if}{selected.label}</Button
        >{/if}
      {#if denial}<Button
          variant="outline"
          disabled={blocked}
          onclick={() => void respond(denial.id)}>{denial.label}</Button
        >{/if}
      {#if allow.length > 1}
        <DropdownMenu.Root
          ><DropdownMenu.Trigger
            >{#snippet child({ props })}<Button
                {...props}
                variant="outline"
                disabled={blocked}
                aria-label={`Permission allowance: ${selected?.scopeLabel ?? selected?.label ?? ""}`}
                >{selected?.scopeLabel ?? selected?.label}<ChevronDownIcon
                  data-icon="inline-end"
                /></Button
              >{/snippet}</DropdownMenu.Trigger
          >
          <DropdownMenu.Content
            ><DropdownMenu.RadioGroup
              value={selected?.id ?? ""}
              onValueChange={(value) =>
                drafts.permission(sessionId, request.id, value)}
              >{#each allow as option (option.id)}<DropdownMenu.RadioItem
                  value={option.id}
                  >{option.scopeLabel ?? option.label}</DropdownMenu.RadioItem
                >{/each}</DropdownMenu.RadioGroup
            ></DropdownMenu.Content
          >
        </DropdownMenu.Root>
      {/if}
      {#each extras as option (option.id)}<Button
          variant="outline"
          disabled={blocked}
          onclick={() => void respond(option.id)}>{option.label}</Button
        >{/each}
    {/if}
  {/snippet}
</AgentRequestFrame>
