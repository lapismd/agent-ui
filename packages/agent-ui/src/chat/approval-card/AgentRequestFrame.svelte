<script lang="ts">
  import "../requests.css";
  import type { Snippet } from "svelte";
  import * as Card from "@lapismd/design-core/shadcn/card";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import TerminalIcon from "@lucide/svelte/icons/terminal";
  import ShieldIcon from "@lucide/svelte/icons/shield-check";
  import SparklesIcon from "@lucide/svelte/icons/sparkles";
  import CheckIcon from "@lucide/svelte/icons/circle-check";
  import XIcon from "@lucide/svelte/icons/circle-x";
  import InfoIcon from "@lucide/svelte/icons/info";
  import { requestLabels, type AgentRequestState } from "../request-state.js";
  let {
    title,
    description,
    kind,
    state,
    origin,
    children,
    actions,
    showActions = true,
  }: {
    title: string;
    description?: string;
    kind: string;
    state: AgentRequestState;
    origin?: string;
    children?: Snippet;
    actions?: Snippet;
    showActions?: boolean;
  } = $props();
  const Icon = $derived(
    state.status === "approved"
      ? CheckIcon
      : state.status === "denied"
        ? XIcon
        : kind === "question"
          ? SparklesIcon
          : kind === "read"
            ? FolderIcon
            : kind === "execute"
              ? TerminalIcon
              : ShieldIcon,
  );
  const completed = $derived(
    ["approved", "denied", "answered", "cancelled"].includes(state.status),
  );
</script>

<section
  aria-label={title}
  data-ui-component="ai-agent-request"
  data-kind={kind === "question" ? "question" : "permission"}
  data-origin={origin}
  data-state={state.status}
  data-testid={kind === "question" ? "ai-question-card" : "ai-approval-card"}
>
  <Card.Root class="agent-request-card">
    <Card.Header class="agent-request-heading">
      <div class="agent-request-emblem"><Icon aria-hidden="true" /></div>
      <div class="agent-request-heading-text">
        <Card.Title class="agent-request-title"
          >{completed ? requestLabels[state.status] : title}</Card.Title
        >
        <Card.Description class="agent-request-description"
          >{completed ? title : description}</Card.Description
        >
      </div>
    </Card.Header>
    <Card.Content class="agent-request-content">
      {#if state.status === "unavailable"}
        <Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"><ShieldIcon /></Empty.Media
            ><Empty.Title>Request unavailable</Empty.Title><Empty.Description
              >{state.message ??
                "This host cannot respond to this request. Captured details remain read-only."}</Empty.Description
            ></Empty.Header
          ></Empty.Root
        >
      {:else}
        {#if state.status !== "pending" && state.status !== "submitting"}
          <div class="agent-request-outcome" role="status">
            <InfoIcon aria-hidden="true" /><span
              >{state.message ?? requestLabels[state.status]}</span
            >{#if state.timestamp}<time datetime={state.timestamp}
                >{new Date(state.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</time
              >{/if}
          </div>
        {/if}
        {@render children?.()}
      {/if}
    </Card.Content>
    {#if actions && showActions}<Card.Footer class="agent-request-actions"
        >{@render actions()}</Card.Footer
      >{/if}
  </Card.Root>
</section>
