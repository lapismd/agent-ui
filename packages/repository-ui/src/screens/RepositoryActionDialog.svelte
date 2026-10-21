<script lang="ts">
  import * as Dialog from "@lapismd/design-core/shadcn/dialog";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  let { controller }: { controller: RepositoryController } = $props();
</script>

<Dialog.Root
  open={!!controller.preview}
  onOpenChange={(open) => {
    if (!open) controller.cancelPreview();
  }}
  ><Dialog.Content class="rui-dialog"
    ><Dialog.Header
      ><Dialog.Title
        >Review {controller.preview?.kind.replaceAll("_", " ")}</Dialog.Title
      ><Dialog.Description
        >This action targets the selected repository and exact operation.</Dialog.Description
      ></Dialog.Header
    >
    <dl>
      <dt>Operation</dt>
      <dd class="rui-mono">{controller.preview?.pin.operation}</dd>
      <dt>Target</dt>
      <dd>{controller.preview?.target ?? "Repository"}</dd>
    </dl>
    {#if controller.preview?.values}<pre class="rui-mono">{JSON.stringify(
          controller.preview.values,
          null,
          2,
        )}</pre>{/if}<Dialog.Footer
      ><Button
        variant="outline"
        disabled={controller.busy || !!controller.pending}
        onclick={() => controller.cancelPreview()}>Cancel</Button
      ><Button
        disabled={controller.busy || !!controller.pending}
        onclick={() => void controller.apply()}>Apply action</Button
      ></Dialog.Footer
    >{#if controller.pending}<p role="status">
        Outcome unknown. The original request is retained.
      </p>
      <Button onclick={() => void controller.checkStatus()}
        >Check request status</Button
      >{/if}</Dialog.Content
  ></Dialog.Root
>
