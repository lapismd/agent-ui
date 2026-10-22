export const Basic =
  '<script lang="ts">\n  import { onDestroy, untrack } from "svelte";\n  import { AgentUiController, createChatPresentation, type AgentPort, AgentComposerDrawer } from "@lapismd/agent-ui";\n  let { port }: { port: AgentPort } = $props();\n  const controller = untrack(() => new AgentUiController(port));\n  const panel = createChatPresentation(() => controller);\n  void controller.refresh();\n  onDestroy(() => { void controller.close(); });\n</script>\n<AgentComposerDrawer controller={panel.controller} actions={panel.actions} attachmentsState={panel.attachmentsState} presentation="document" />';
export const Styling =
  '<script lang="ts">\n  import { onDestroy, untrack } from "svelte";\n  import { AgentUiController, createChatPresentation, type AgentPort, AgentComposerDrawer } from "@lapismd/agent-ui";\n  let { port }: { port: AgentPort } = $props();\n  const controller = untrack(() => new AgentUiController(port));\n  const panel = createChatPresentation(() => controller);\n  void controller.refresh();\n  onDestroy(() => { void controller.close(); });\n</script>\n<div style="--ui-agent-drawer-document-inset: 1.5rem;">\n<AgentComposerDrawer controller={panel.controller} actions={panel.actions} attachmentsState={panel.attachmentsState} presentation="document" /></div>';
export const Permission = `<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { AgentUiController, createChatPresentation, AgentComposerDrawer, type AgentPort } from "@lapismd/agent-ui";
  let { port }: { port: AgentPort } = $props();
  const controller = untrack(() => new AgentUiController(port));
  const panel = createChatPresentation(() => controller);
  void controller.refresh();
  onDestroy(() => { void controller.close(); });
</script>
<AgentComposerDrawer controller={panel.controller} actions={panel.actions}
  attachmentsState={panel.attachmentsState} presentation="request"
  status={panel.composerState.composerStatus} />`;
