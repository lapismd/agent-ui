<script lang="ts">
  import AiImportPanel from "../imports/AiImportPanel.svelte";
  import CapturedSessionBrowser from "../sessions/CapturedSessionBrowser.svelte";
  import type { ImportController } from "../imports/controller.svelte.js";
  import type { AgentUiController } from "../core/controller.svelte.js";
  let {
    controller,
    imports,
  }: { controller: AgentUiController; imports?: ImportController } = $props();
  const sessions = $derived(
    (controller.snapshot?.imports ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      profile: row.source.startsWith("OpenCode")
        ? "opencode-sqlite-v1"
        : "codex-cli-v1",
      group: "Vault root",
      versions: [
        {
          id: row.id + "/1",
          sequence: 1,
          updatedAt: "2026-10-21T12:00:00Z",
          entries: row.items,
        },
      ],
    })),
  );
</script>

{#if controller.screen === "recorded"}<CapturedSessionBrowser
    {sessions}
  />{:else if imports}<AiImportPanel {imports} />{/if}
