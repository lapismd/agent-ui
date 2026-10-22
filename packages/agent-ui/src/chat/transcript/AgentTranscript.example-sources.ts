export const Basic =
  '<script lang="ts">\n  import { onDestroy, untrack } from "svelte";\n  import { AgentUiController, createChatPresentation, type AgentPort, AgentTranscript } from "@lapismd/agent-ui";\n  let { port }: { port: AgentPort } = $props();\n  const controller = untrack(() => new AgentUiController(port));\n  const panel = createChatPresentation(() => controller);\n  void controller.refresh();\n  onDestroy(() => { void controller.close(); });\n</script>\n<div style="height:40rem"><AgentTranscript {controller} {panel} /></div>';
export const Styling =
  '<script lang="ts">\n  import { onDestroy, untrack } from "svelte";\n  import { AgentUiController, createChatPresentation, type AgentPort, AgentTranscript } from "@lapismd/agent-ui";\n  let { port }: { port: AgentPort } = $props();\n  const controller = untrack(() => new AgentUiController(port));\n  const panel = createChatPresentation(() => controller);\n  void controller.refresh();\n  onDestroy(() => { void controller.close(); });\n</script>\n<div style="--ui-transcript-max-width: 46rem;">\n<div style="height:40rem"><AgentTranscript {controller} {panel} /></div></div>';

export const References = `<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { AgentWorkbench, AgentUiController, type AgentPort, type AgentTranscriptOptions } from "@lapismd/agent-ui";
  import { spoilerExtension, type ChatReference } from "@lapismd/design-core/chat";
  let { port, openReference, copy }: { port: AgentPort; openReference: (reference: ChatReference) => void; copy: (text: string) => void } = $props();
  const person: ChatReference = { id: "alex", kind: "person", label: "Alex Morgan", href: "/people/alex", avatar: { id: "alex", name: "Alex Morgan" } };
  const references = { resolve: (href: string) => href === person.href ? person : undefined, onActivate: (reference: ChatReference) => openReference(reference), getPopover: () => profile };
  const options: AgentTranscriptOptions = {
    composer: { references, referenceSources: [{ character: "@", label: "People", search: (query, signal) => signal.aborted || !person.label.toLowerCase().includes(query.toLowerCase()) ? [] : [person] }], extensions: [spoilerExtension] },
    markdown: { references, extensions: [spoilerExtension] },
    getMessageActions: messageId => [{ id: "copy-id", label: "Copy message ID", onSelect: () => copy(messageId) }],
    actionTooltips: false,
  };
  const controller = untrack(() => new AgentUiController(port));
  void controller.refresh();
  onDestroy(() => { void controller.close(); });
</script>
{#snippet profile(reference: ChatReference)}<strong>{reference.label}</strong><p>Repository principal</p>{/snippet}
<div style="height:100dvh"><AgentWorkbench {controller} transcriptOptions={options} /></div>`;
