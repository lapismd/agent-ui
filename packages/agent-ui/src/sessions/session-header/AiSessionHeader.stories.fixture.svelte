<script lang="ts">
  import Header from "./AiSessionHeader.svelte";
  import Toggle from "../transcript-view-toggle/TranscriptViewToggle.svelte";
  let { styled = false, long = false }: { styled?: boolean; long?: boolean } =
    $props();
  let expanded = $state(false);
  let view = $state<"document" | "classic">("document");
</script>

<div
  style={styled
    ? "--ui-agent-session-header-height:4.5rem;--ui-agent-session-header-title-size:1.125rem"
    : undefined}
>
  <Header
    title={long
      ? "Review an exceptionally long conversation title without changing the shell boundaries"
      : "Review workspace changes"}
    status="Codex · GPT-6 · Vault root"
    selected
    harness="codex"
    listLabel="Conversations"
    {expanded}
    onToggle={() => (expanded = !expanded)}
  >
    {#snippet actions()}<Toggle bind:view />{/snippet}
  </Header>
</div>
