<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store CommunityAgentProfile. -->
<script lang="ts">
  import { Avatar } from "@lapismd/design-core/shadcn/avatar";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tabs from "@lapismd/design-core/shadcn/tabs";
  import {
    MessageSquare,
    SquarePen,
    Fingerprint,
    UserRound,
    Cpu,
    Pencil,
  } from "@lucide/svelte";
  import type { ConfiguredAgent, AgentDirectoryPage } from "../logic/types.js";
  import "./agent-profile.css";
  let {
    agent,
    page,
    busy,
    onEdit,
    onSessions,
    onChat,
    copyText,
    onError,
  }: {
    agent: ConfiguredAgent;
    page: AgentDirectoryPage;
    busy: boolean;
    onEdit(): void;
    onSessions(): void;
    onChat?(): void;
    copyText?(text: string): Promise<void>;
    onError(error: unknown): void;
  } = $props();
  let tab = $state("info");
  const client = $derived(page.clients.find((c) => c.id === agent.client));
</script>

<article
  tabindex="-1"
  class="agent-profile"
  aria-label={`${agent.name} agent profile`}
>
  <header>
    <Avatar
      name={agent.name}
      src={agent.avatar}
      size="xl"
      shape="rounded"
      decorative
    />
    <h2>
      {#if page.capabilities.includes("save-agent")}<Button
          variant="ghost"
          class="agent-profile__name-edit"
          aria-label={`Edit ${agent.name}`}
          disabled={busy}
          onclick={onEdit}
          ><span>{agent.name}</span><span class="agent-profile__name-edit-icon"
            ><Pencil aria-hidden="true" /></span
          ></Button
        >{:else}{agent.name}{/if}
    </h2>
  </header>
  <div class="agent-profile__signals">
    {#if onChat}<Button
        variant="secondary"
        disabled={busy || !client?.available}
        onclick={onChat}><SquarePen aria-hidden="true" />New chat</Button
      >{/if}<Button variant="secondary" onclick={onSessions}
      ><MessageSquare aria-hidden="true" />View chats</Button
    >
  </div>
  <Tabs.Root bind:value={tab}
    ><Tabs.List class="agent-profile__tabs"
      ><Tabs.Trigger value="info">Info</Tabs.Trigger><Tabs.Trigger
        value="runtime">Runtime</Tabs.Trigger
      ></Tabs.List
    >
    <Tabs.Content value="info"
      ><div class="agent-profile__info">
        <ul class="agent-profile__info-list" aria-label="Agent information">
          {#if agent.description}<li class="agent-profile__info-row">
              <MessageSquare aria-hidden="true" />
              <div class="agent-profile__info-value">
                <strong>About</strong>
                <p>{agent.description}</p>
              </div>
            </li>{/if}
          <li>
            <Button
              class="agent-profile__info-row agent-profile__info-link"
              variant="ghost"
              disabled={!copyText}
              aria-label={`Copy ${agent.name}'s agent ID`}
              onclick={() => void copyText?.(agent.id).catch(onError)}
              ><Fingerprint aria-hidden="true" /><span
                class="agent-profile__info-value"
                ><strong>Agent ID</strong><span class="agent-profile__key"
                  >{agent.id}</span
                ></span
              ></Button
            >
          </li>
          <li class="agent-profile__info-row">
            <UserRound aria-hidden="true" /><span
              class="agent-profile__info-value"
              ><strong>Managed by</strong><span>This installation</span></span
            >
          </li>
          <li class="agent-profile__info-row">
            <Cpu aria-hidden="true" />
            <div class="agent-profile__info-value">
              <strong>Agent harness</strong><span
                >{client?.label ?? agent.client} · {client?.available
                  ? "Installed"
                  : "Unavailable"}</span
              >
            </div>
          </li>
          {#if agent.instructions}<li class="agent-profile__info-row">
              <MessageSquare aria-hidden="true" />
              <div class="agent-profile__info-value">
                <strong>Instructions</strong>
                <p>{agent.instructions}</p>
              </div>
            </li>{/if}
        </ul>
      </div></Tabs.Content
    >
    <Tabs.Content value="runtime"
      ><div class="agent-profile__runtime">
        <dl class="agent-profile__runtime-defaults">
          <dt>Agent harness</dt>
          <dd>{client?.label ?? agent.client}</dd>
          <dt>Model</dt>
          <dd>{agent.model || "Harness default"}</dd>
        </dl>
        <p>
          These preferences apply to future messages. Existing sessions retain
          their captured configuration.
        </p>
      </div></Tabs.Content
    >
  </Tabs.Root>
</article>
