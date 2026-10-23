<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store CommunityAgents. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { Avatar } from "@lapismd/design-core/shadcn/avatar";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import {
    Plus,
    RefreshCw,
    MessagesSquare,
    EllipsisVertical,
  } from "@lucide/svelte";
  import DirectoryEmpty from "./DirectoryEmpty.svelte";
  import type { AgentDirectoryState, ConfiguredAgent } from "../logic/types.js";
  import "./agents.css";
  let {
    view,
    onRefresh,
    onMore,
    onAdd,
    onOpen,
    onEdit,
    onDelete,
    onSessions,
    onChat,
  }: {
    view: AgentDirectoryState;
    onRefresh(): void;
    onMore(): void;
    onAdd(): void;
    onOpen(agent: ConfiguredAgent): void;
    onEdit(agent: ConfiguredAgent): void;
    onDelete(agent: ConfiguredAgent): void;
    onSessions(agent?: string): void;
    onChat?(agent: ConfiguredAgent): void;
  } = $props();
  const disabled = $derived(
    view.writing || !!view.pending.length || view.loading,
  );
</script>

<section class="agents" aria-label="Your agents" aria-busy={view.loading}>
  <header>
    <div>
      <h1>Agents</h1>
      <p>Your agents on this device.</p>
    </div>
    <Tooltip.Provider
      ><Tooltip.Root
        ><Tooltip.Trigger>
          {#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-sm"
              aria-label="Refresh agents"
              disabled={view.loading}
              onclick={onRefresh}><RefreshCw aria-hidden="true" /></Button
            >{/snippet}
        </Tooltip.Trigger><Tooltip.Content>Refresh agents</Tooltip.Content
        ></Tooltip.Root
      ></Tooltip.Provider
    >
  </header>
  <div class="agents__grid">
    <button
      class="agents__add-card agents__sessions-card"
      type="button"
      onclick={() => onSessions()}
      ><span class="agents__sessions-icon"
        ><MessagesSquare aria-hidden="true" /></span
      ><span>View sessions</span></button
    >
    {#if view.page?.capabilities.includes("save-agent")}<button
        class="agents__add-card"
        type="button"
        aria-label="Add agent"
        {disabled}
        onclick={onAdd}
        ><Plus aria-hidden="true" /><span>Add agent</span></button
      >{/if}
    {#if view.loading && !view.page}<div
        role="status"
        aria-label="Loading your agents"
      >
        <Skeleton class="agent-gallery-skeleton" />
      </div>{/if}
    {#each view.page?.agents ?? [] as agent (agent.id)}
      {@const client = view.page?.clients.find((c) => c.id === agent.client)}
      <div class="agents__card" data-agent-id={agent.id}>
        <button
          type="button"
          class="agents__card-open"
          aria-label={`View ${agent.name}`}
          onclick={() => onOpen(agent)}
        ></button>
        <div class="agents__avatar">
          <div class="agents__avatar-content">
            <Avatar
              name={agent.name}
              src={agent.avatar}
              size="2xl"
              shape="rounded"
              decorative
            />
          </div>
        </div>
        <div class="agents__details">
          <strong>{agent.name}</strong><span class="agents__about"
            >{agent.model || "Harness default model"}</span
          >
        </div>
        <DropdownMenu.Root
          ><DropdownMenu.Trigger>
            {#snippet child({ props })}<Button
                {...props}
                class="agents__card-menu"
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${agent.name}`}
                ><EllipsisVertical aria-hidden="true" /></Button
              >{/snippet}
          </DropdownMenu.Trigger><DropdownMenu.Content align="end"
            ><DropdownMenu.Group>
              {#if onChat}<DropdownMenu.Item
                  disabled={!client?.available || disabled}
                  onSelect={() => onChat?.(agent)}>New chat</DropdownMenu.Item
                >{/if}
              <DropdownMenu.Item onSelect={() => onSessions(agent.id)}
                >View chats</DropdownMenu.Item
              >
              {#if view.page?.capabilities.includes("save-agent")}<DropdownMenu.Item
                  {disabled}
                  onSelect={() => onEdit(agent)}>Edit agent</DropdownMenu.Item
                >{/if}
              {#if view.page?.capabilities.includes("delete-agent")}<DropdownMenu.Item
                  variant="destructive"
                  {disabled}
                  onSelect={() => onDelete(agent)}
                  >Delete agent</DropdownMenu.Item
                >{/if}
            </DropdownMenu.Group></DropdownMenu.Content
          ></DropdownMenu.Root
        >
      </div>
    {/each}
  </div>
  {#if view.error}<DirectoryEmpty
      title="Agents unavailable"
      description="The agent directory could not be refreshed. Saved requests and drafts are retained."
      retry={onRefresh}
    />
  {:else if view.page && !view.page.agents.length && !view.loading}<DirectoryEmpty
      title="No agents yet"
      description="Add an agent to save its instructions and runtime preferences."
    />{/if}
  {#if view.page?.next}<Button
      variant="outline"
      disabled={view.loading}
      onclick={onRefresh}>Refresh directory</Button
    >{/if}
</section>

<style>
  :global(.agent-gallery-skeleton) {
    width: 13rem;
    max-width: 100%;
    height: 16.25rem;
    border-radius: 1rem;
  }
</style>
