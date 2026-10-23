<script lang="ts">
  import Status from "../jj/workspace/source-files/RepositoryWorkspaceStatus.svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  let { controller }: { controller: RepositoryController } = $props();
  const file = $derived(
    controller.file ??
      controller.snapshot?.files.find((f) => f.kind === "file"),
  );
</script>

<section class="rui-screen" aria-label="File blame">
  <header class="rui-toolbar">
    <h2>Blame · {file?.path ?? "Choose a file"}</h2>
    <Button
      size="sm"
      variant="outline"
      aria-pressed={controller.wrap}
      onclick={() => (controller.wrap = !controller.wrap)}>Wrap text</Button
    ><Button
      size="sm"
      variant="ghost"
      onclick={() => controller.navigate("files")}>Back to files</Button
    >
  </header>
  <div class="rui-scroll">
    {#if file?.unavailable}<Status
        unavailable
        title="File blame unavailable"
        description={file.unavailable}
      />{:else if !file}<Status
        title="Select a file"
        description="Choose a file to inspect its captured attribution."
      />{:else}{#each (file?.text ?? "").split("\n") as line, index}{@const blame =
          controller.snapshot?.blame.find(
            (b) => index + 1 >= b.from && index + 1 <= b.to,
          )}
        <div class="rui-blame-row">
          <button
            class="rui-blame-author"
            onclick={() => {
              if (blame) {
                controller.selectRevision(blame.commit);
                controller.navigate("history");
              }
            }}
            ><strong>{blame?.author ?? "Unattributed"}</strong><span
              >{blame?.description ?? "Captured source"}</span
            ></button
          ><span class="rui-muted" aria-label={`Line ${index + 1}`}
            >{index + 1}</span
          >
          <pre class="rui-blame-source" data-wrap={controller.wrap}>{line ||
              " "}</pre>
        </div>{/each}{/if}
  </div>
</section>

<style>
  .rui-blame-row {
    display: grid;
    grid-template-columns: minmax(8rem, 14rem) 3rem minmax(0, 1fr);
    gap: 0.5rem;
    align-items: start;
  }
  .rui-blame-author {
    font: inherit;
    text-align: left;
    display: grid;
    background: transparent;
    color: inherit;
    border: 0;
    padding: 0.25rem;
    overflow: hidden;
  }
  .rui-blame-author span {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }
  .rui-blame-source {
    margin: 0;
    font-size: 0.8rem;
    white-space: pre;
    overflow: auto;
    padding: 0.25rem;
  }
  .rui-blame-source[data-wrap="true"] {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
