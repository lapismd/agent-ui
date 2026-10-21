<script lang="ts">
  import type { Snippet } from "svelte";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import type { WorkspaceDropTarget } from "../stacks/drag.js";
  import type { WorkspaceCommand } from "../stacks/types.js";
  let {
    controller,
    target,
    label,
    children,
    onCommand,
  }: {
    controller: StackWorkspaceController;
    target: WorkspaceDropTarget;
    label: string;
    children: Snippet;
    onCommand: (command: WorkspaceCommand) => void;
  } = $props();
  const feedback = $derived(controller.drag.for(target));
</script>

<div
  role="group"
  aria-label={label}
  class="rui-drop-zone"
  data-drop-state={feedback?.state ?? "idle"}
  ondragover={(event) =>
    controller.drag.over(event, target, controller.snapshot, controller.locked)}
  ondragleave={(event) => controller.drag.leave(event, target)}
  ondrop={(event) => {
    const command = controller.drag.drop(
      event,
      target,
      controller.snapshot,
      controller.locked,
    );
    if (command) onCommand(command);
  }}
>
  {@render children()}{#if feedback}<div class="rui-drop-guide" role="status">
      {feedback.state === "valid" ? "↳" : "⊘"}
      {feedback.message}
    </div>{/if}
</div>

<style>
  .rui-drop-zone {
    position: relative;
    min-height: 3rem;
  }
  .rui-drop-zone[data-drop-state="valid"] {
    outline: 2px dashed var(--primary);
    outline-offset: -3px;
  }
  .rui-drop-zone[data-drop-state="invalid"] {
    outline: 2px dashed var(--destructive);
    outline-offset: -3px;
  }
  .rui-drop-guide {
    position: absolute;
    inset: 0.25rem 0.25rem auto;
    z-index: 3;
    background: var(--background);
    border: 1px solid var(--border);
    padding: 0.4rem;
    font-size: 0.8rem;
    pointer-events: none;
  }
</style>
