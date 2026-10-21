<script lang="ts">
  import * as Dialog from "@lapismd/design-core/shadcn/dialog";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import type { WorkspaceCommand } from "../stacks/types.js";
  import { commandTitle } from "../stacks/presentation.js";
  let {
    controller,
    command = $bindable<WorkspaceCommand | null>(null),
  }: {
    controller: StackWorkspaceController;
    command?: WorkspaceCommand | null;
  } = $props();
  let text = $state("");
  $effect(() => {
    text = command
      ? "name" in command
        ? (command.name ?? "")
        : "message" in command
          ? (command.message ?? "")
          : ""
      : "";
  });
  function preview() {
    if (!command) return;
    const value =
      "name" in command
        ? { ...command, name: text }
        : "message" in command
          ? { ...command, message: text }
          : command;
    command = null;
    void controller.prepare(value);
  }
</script>

<Dialog.Root
  open={!!command}
  onOpenChange={(open) => {
    if (!open) command = null;
  }}
  ><Dialog.Content
    ><Dialog.Header
      ><Dialog.Title
        >{command ? commandTitle(command) : "Workspace action"}</Dialog.Title
      ><Dialog.Description
        >Enter the details, then review the exact command before applying it.</Dialog.Description
      ></Dialog.Header
    >{#if command && ("name" in command || "message" in command)}<label
        class="rui-field"
        >{"name" in command ? "Name" : "Commit message"}<Input
          bind:value={text}
        /></label
      >{/if}<Dialog.Footer
      ><Button variant="outline" onclick={() => (command = null)}>Cancel</Button
      ><Button onclick={preview}>Preview command</Button></Dialog.Footer
    ></Dialog.Content
  ></Dialog.Root
>
<Dialog.Root
  open={!!controller.preview}
  onOpenChange={(open) => {
    if (!open) controller.cancelPreview();
  }}
  ><Dialog.Content
    ><Dialog.Header
      ><Dialog.Title
        >{controller.preview?.title ?? "Review workspace command"}</Dialog.Title
      ><Dialog.Description
        >{controller.preview?.summary ??
          "Review the selected changes."}</Dialog.Description
      ></Dialog.Header
    >
    <p class="rui-mono">Request {controller.preview?.request.id}</p>
    {#if controller.preview?.conflicts.length}<p role="status">
        Conflicts: {controller.preview.conflicts.join(", ")}
      </p>{/if}<Dialog.Footer
      ><Button
        variant="outline"
        disabled={controller.busy || !!controller.pending}
        onclick={() => controller.cancelPreview()}>Cancel preview</Button
      ><Button
        disabled={controller.busy || !!controller.pending}
        onclick={() => void controller.apply()}>Apply command</Button
      ></Dialog.Footer
    >{#if controller.pending}<p role="status">
        Outcome unknown. Check the original request.
      </p>
      <Button onclick={() => void controller.checkStatus()}
        >Check request status</Button
      >{/if}</Dialog.Content
  ></Dialog.Root
>
