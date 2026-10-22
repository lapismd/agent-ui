export const Basic =
  '<script lang="ts">\n  import { ChatMessageComposer } from "@lapismd/agent-ui/chat";\n  let value = $state("");\n  let { send }: { send: (text: string) => void } = $props();\n</script>\n<ChatMessageComposer bind:value view="document" onSend={() => send(value)} />';
export const Styling =
  '<script lang="ts">\n  import { ChatMessageComposer } from "@lapismd/agent-ui/chat";\n  let value = $state("");\n  let { send }: { send: (text: string) => void } = $props();\n</script>\n<div style="--ui-agent-composer-min-height: 8rem;">\n<ChatMessageComposer bind:value view="document" onSend={() => send(value)} /></div>';

export const References = `<script lang="ts">
  import { ChatMessageComposer } from "@lapismd/agent-ui/chat";
  import { MarkdownContent, spoilerExtension, type ChatReferenceOptions, type ChatReferenceSource } from "@lapismd/design-core/chat";
  import FolderIcon from "@lucide/svelte/icons/folder-git-2";
  const person = { id: "alex", kind: "person", label: "Alex", href: "/people/alex", avatar: { id: "alex", name: "Alex" } };
  const repository = { id: "desktop", kind: "repository", label: "Desktop", href: "/repos/desktop", icon: FolderIcon };
  const records = [person, repository];
  const references: ChatReferenceOptions = { resolve: href => records.find(record => record.href === href), onActivate: reference => console.log(reference.id) };
  const referenceSources: ChatReferenceSource[] = [{ character: "@", label: "References", search: (query, signal) => signal.aborted ? [] : records.filter(record => record.label.toLowerCase().includes(query.toLowerCase())) }];
  let value = $state("Review [Desktop](/repos/desktop) with [Alex](/people/alex).");
</script>
<ChatMessageComposer bind:value view="document" {references} {referenceSources} extensions={[spoilerExtension]} onSend={() => console.log(value)} />
<MarkdownContent content={value} {references} extensions={[spoilerExtension]} />`;

export const Feedback = `<script lang="ts">
  import { ChatMessageComposer } from "@lapismd/agent-ui/chat";
  import type { ComposerStatus } from "@lapismd/design-core/chat";
  let value = $state("Retain this draft");
  let status = $state<ComposerStatus | undefined>({ type: "warning", message: "Check the original request before continuing." });
</script>
<ChatMessageComposer bind:value view="document" {status} onSend={() => {}} />
<button onclick={() => { status = { type: "error", message: "The host refused this request." }; }}>Show error</button>
<button onclick={() => { status = undefined; }}>Clear feedback</button>`;
