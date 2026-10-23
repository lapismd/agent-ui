<script lang="ts">
  import { onDestroy, untrack, type Snippet } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Users } from "@lucide/svelte";
  import ThreadsScreen from "./ThreadsScreen.svelte";
  import { ThreadsController } from "../logic/controller.js";
  import {
    threadKey,
    type ThreadIdentity,
    type ThreadsPort,
    type ThreadRow,
  } from "../logic/types.js";
  import { AgentUiController } from "../../core/controller.svelte.js";
  import AgentChatScreen from "../../chat/chat-screen/AgentChatScreen.svelte";
  import { MemoryAgentPort } from "../../../../../catalog/support/agent-adapter.js";
  import {
    agentFixture,
    message,
  } from "../../../../../catalog/support/agent-data.js";
  let { variant = "basic" }: { variant?: string } = $props();
  let selected = $state<ThreadIdentity>(),
    detailsOpen = $state(false),
    notice = $state("");
  const homes = [
    { id: "a", name: "Agent UI" },
    { id: "b", name: "JJ Desktop" },
  ];
  const rows: ThreadRow[] = untrack(() => variant === "empty")
    ? []
    : homes.map((h) => ({
        home: h.id,
        id: "same",
        title: "Review shared screens",
        status: "active",
        author: { id: "alex", name: "Alex Morgan" },
        updatedAt: 1792740000000,
      }));
  rows.push(
    ...(untrack(() => variant === "empty")
      ? []
      : [
          {
            home: "a",
            id: "old",
            title: "Earlier review",
            status: "archived",
            author: { id: "sam", name: "Sam Lee" },
          },
        ]),
  );
  const chats = new Map<string, AgentUiController>();
  function chat(identity: ThreadIdentity) {
    const key = threadKey(identity);
    let controller = chats.get(key);
    if (!controller) {
      const snapshot = agentFixture();
      snapshot.sessions = [
        {
          ...snapshot.sessions[0],
          id: identity.id,
          title: rows.find((r) => threadKey(r) === key)?.title ?? "New Thread",
          items: [
            message(
              "intro",
              `Saved conversation in ${homes.find((h) => h.id === identity.home)?.name}.`,
            ),
          ],
        },
      ];
      snapshot.capabilities = ["send"];
      snapshot.chat = {
        ...snapshot.chat!,
        controls: { attachments: false, approvalPolicy: false, runtime: false },
      };
      const port = new MemoryAgentPort(snapshot);
      controller = new AgentUiController(port, snapshot, {
        canComment: () => false,
      });
      controller.sessionId = identity.id;
      chats.set(key, controller);
    }
    return controller;
  }
  let failed = untrack(
    () => variant === "unavailable" || variant === "partial",
  );
  const port: ThreadsPort = {
    async homes() {
      return homes;
    },
    async read({ home, cursor, limit }, signal) {
      if (variant === "loading")
        await new Promise<void>((resolve) => {
          signal.addEventListener("abort", () => resolve(), { once: true });
        });
      signal.throwIfAborted();
      if (failed && (variant === "unavailable" || home === "b")) {
        failed = false;
        throw Error("Repository unavailable");
      }
      return {
        home,
        snapshot: "threads-1",
        rows:
          variant === "pagination" && home === "a"
            ? Array.from({ length: cursor ? 1 : limit }, (_, i) => ({
                ...rows[0],
                id: `page-${cursor ? limit : i}`,
                title: `Review ${cursor ? limit : i}`,
              }))
            : rows.filter((r) => r.home === home),
        next:
          variant === "pagination" && home === "a" && !cursor
            ? "second"
            : undefined,
      };
    },
  };
  const controller = new ThreadsController(
    port,
    (error) => (notice = String(error)),
  );
  void controller.open();
  if (untrack(() => variant === "conversation" || variant === "details")) {
    selected = { home: "a", id: "same" };
    chat({ home: "a", id: "same" });
  }
  function select(identity: ThreadIdentity) {
    chat(identity);
    selected = identity;
  }
  function create() {
    const identity = { home: "a", id: crypto.randomUUID() };
    rows.push({
      ...identity,
      title: "New Thread",
      status: "active",
      author: { id: "alex", name: "Alex Morgan" },
    });
    select(identity);
    void controller.read("a");
  }
  onDestroy(() => {
    void controller.close();
    chats.forEach((c) => void c.close());
  });
</script>

<div style="height:100vh">
  <ThreadsScreen
    {controller}
    {selected}
    onSelect={select}
    onCreate={variant === "disabled" ? undefined : create}
    {conversation}
    {details}
    bind:detailsOpen
    onRepository={(home) =>
      (notice = `Requested code in ${home.name}; global browsing retained its active repository.`)}
  />
</div>
{#snippet conversation(identity: ThreadIdentity, navigation: Snippet)}
  {@const current = chat(identity)}
  <AgentChatScreen controller={current}>
    {#snippet headerActions()}{@render navigation()}<Button
        variant="ghost"
        size="icon-sm"
        aria-label="Thread contributors"
        onclick={() => (detailsOpen = true)}
        ><Users aria-hidden="true" /></Button
      >{/snippet}
  </AgentChatScreen>
{/snippet}
{#snippet details()}
  <section aria-label="Conversation contributors" style="padding:1rem">
    <h2>Contributors</h2>
    <p>Alex Morgan</p>
    <p>Codex</p>
    <p>Metadata home: {selected?.home === "a" ? "Agent UI" : "JJ Desktop"}</p>
  </section>
{/snippet}
{#if notice}<span
    role="status"
    style="position:fixed;inset-block-end:0;inset-inline-end:0">{notice}</span
  >{/if}
