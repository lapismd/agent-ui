<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import AgentsScreen from "./AgentsScreen.svelte";
  import AiRecordedTranscript from "../../sessions/recorded-transcript/AiRecordedTranscript.svelte";
  import { AgentDirectoryController } from "../logic/controller.js";
  import type {
    AgentDirectoryPage,
    AgentDirectoryPort,
    ConfiguredAgent,
  } from "../logic/types.js";
  let { variant = "basic" }: { variant?: string } = $props();
  let notice = $state("");
  let capture = $state("");
  let saved: ConfiguredAgent[] = [
    {
      id: "builder",
      version: "1",
      name: "Builder",
      client: "codex",
      model: "gpt-5",
      description: "Implementation and review",
      instructions: "Keep changes focused.",
    },
    {
      id: "reviewer",
      version: "1",
      name: "Reviewer",
      client: "cursor",
      model: "",
      description: "Review code and tests",
      instructions: "Explain material risks.",
    },
  ];
  if (untrack(() => variant === "empty")) saved = [];
  const drafts = new Map<string, ConfiguredAgent>();
  let failed = untrack(() => variant === "unavailable"),
    unknown = untrack(() => variant === "recovery"),
    stopped = false,
    conflict = untrack(() => variant === "conflict");
  const page = (): AgentDirectoryPage => ({
    snapshot: "directory-1",
    agents: structuredClone(saved),
    clients: [
      { id: "codex", label: "Codex", available: true },
      { id: "cursor", label: "Cursor", available: false },
    ],
    capabilities: ["save-agent", "delete-agent", "stop-session"],
    sessions: stopped
      ? []
      : [
          {
            id: "same",
            home: "Agent UI",
            title: "Review shared screens",
            agentName: "Builder",
            agent: "builder",
            state: "running",
            updatedAt: 1792700000,
          },
        ],
    captures: ["Agent UI", "JJ Desktop"].map((home) => ({
      id: "same",
      home,
      title: "Review shared screens",
      agentName: "Builder",
      agent: "builder",
      snapshot: "capture-1",
      transcripts: 3,
      tools: 2,
      updatedAt: 1792700000,
    })),
    unavailable:
      variant === "partial"
        ? [
            {
              home: "missing",
              name: "Archived project",
              reason: "Repository is unavailable on this device.",
            },
          ]
        : [],
  });
  const port: AgentDirectoryPort = {
    async read() {
      if (variant === "loading")
        await new Promise((resolve) => setTimeout(resolve, 60000));
      if (failed) {
        failed = false;
        throw Error("Agent service offline");
      }
      return page();
    },
    async execute(request) {
      if (unknown) return { state: "unknown" };
      const command = request.command;
      if (conflict && command.kind === "save-agent") {
        conflict = false;
        saved = saved.map((agent) => ({ ...agent, version: "2" }));
        return { state: "rejected", message: "Agent configuration changed" };
      }
      if (command.kind === "save-agent")
        saved = [
          ...saved.filter((a) => a.id !== command.agent.id),
          { ...command.agent, version: "2" },
        ];
      else if (command.kind === "delete-agent")
        saved = saved.filter((a) => a.id !== command.agent);
      else stopped = true;
      return { state: "committed" };
    },
    async resolve() {
      unknown = false;
      return { state: "committed" };
    },
    async draft(key, value) {
      if (value === null) drafts.delete(key);
      else if (value) drafts.set(key, structuredClone(value));
      return drafts.get(key) ?? null;
    },
  };
  const controller = untrack(
    () =>
      new AgentDirectoryController(port, (error) => (notice = String(error))),
  );
  void controller.open();
  onDestroy(() => {
    void controller.close();
  });
</script>

<div style="height: 100vh">
  <AgentsScreen
    {controller}
    sessions={variant === "sessions" || variant === "partial"}
    onError={(error) => (notice = String(error))}
    onChat={(agent) => (notice = `New chat with ${agent.name}; nothing sent`)}
    onOpenSession={(session) => (notice = `Session: ${session.home}`)}
    onOpenCapture={(value) => (capture = value.home)}
    copyText={async (text) => {
      notice = `Copied ${text}`;
    }}
    sessionContent={capture ? recorded : undefined}
  />
  {#if notice}<p role="status">{notice}</p>{/if}
</div>
{#snippet recorded()}<AiRecordedTranscript
    entries={[
      {
        id: "captured",
        kind: "message",
        label: "Saved response",
        role: "assistant",
        author: { id: "builder", name: "Builder" },
        blocks: [
          {
            id: "captured-text",
            kind: "markdown",
            revision: "capture-1",
            label: "Saved response",
            text: `Saved review from ${capture}.`,
          },
        ],
      },
    ]}
  />{/snippet}
