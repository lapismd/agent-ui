<script lang="ts">
  import List from "./AiSessionList.svelte";
  let {
    loading = false,
    empty = false,
    busy = false,
  }: { loading?: boolean; empty?: boolean; busy?: boolean } = $props();
  let active = $state("review");
  const items = [
    {
      id: "review",
      title: "Review workspace changes",
      profile: "Codex",
      group: "Vault root",
      updatedAt: "2026-10-22T09:00:00Z",
      harness: "codex",
    },
    {
      id: "planning",
      title: "Plan the extraction",
      profile: "OpenCode",
      group: "Projects",
      updatedAt: "2026-10-21T09:00:00Z",
      harness: "opencode",
      status: "Archived",
    },
  ];
</script>

<List
  items={empty ? [] : items}
  activeId={active}
  {loading}
  {busy}
  label="Conversations"
  action="Open"
  emptyTitle="No conversations yet"
  emptyDescription="Start a conversation to save a local chat."
  onSelect={(id) => (active = id)}
/>
<output aria-live="polite">Selected: {active}</output>
