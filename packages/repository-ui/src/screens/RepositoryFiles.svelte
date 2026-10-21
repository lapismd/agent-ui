<script lang="ts">
  import {
    FileListing,
    FileListingViewModeToggle,
    FileDiff,
  } from "@lapismd/design-core/diff";
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import { CodeBlock } from "@lapismd/design-core/shadcn/code-block";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  let { controller }: { controller: RepositoryController } = $props();
  let display = $state<"preview" | "source" | "diff">("preview");
  const files = $derived(
    controller.filteredFiles.filter((f) => f.kind === "file"),
  );
</script>

<section class="rui-screen" aria-label="Repository files">
  <header class="rui-toolbar">
    <h2>Files</h2>
    <Input
      aria-label="Find repository files"
      placeholder="Find a file…"
      bind:value={controller.query}
    /><FileListingViewModeToggle
      mode={controller.mode}
      onModeChange={(mode) => (controller.mode = mode)}
    />
  </header>
  <div class="rui-two-pane">
    <aside class="rui-pane" aria-label="Repository file list">
      <FileListing
        {files}
        mode={controller.mode}
        selectedPath={controller.selectedPath}
        onSelectPath={(path) => (controller.selectedPath = path)}
      />{#if !files.length}<p class="rui-empty">No matching files</p>{/if}
    </aside>
    <div class="rui-screen">
      <header class="rui-toolbar">
        <strong>{controller.file?.path ?? "Select a file"}</strong
        >{#if controller.file}{#each ["preview", "source", "diff"] as mode}<Button
              size="sm"
              variant={display === mode ? "secondary" : "ghost"}
              onclick={() => (display = mode as typeof display)}>{mode}</Button
            >{/each}<Button
            size="sm"
            variant="ghost"
            onclick={() => void controller.copy(controller.file!.path)}
            >Copy path</Button
          ><Button
            size="sm"
            variant="ghost"
            onclick={() => controller.navigate("blame")}>Blame</Button
          >{/if}
      </header>
      <div class="rui-scroll">
        {#if controller.file?.unavailable}<p role="status">
            {controller.file.unavailable}
          </p>{:else if controller.file}{#if display === "diff"}<FileDiff
              path={controller.file.path}
              oldText={controller.file.previous ?? ""}
              newText={controller.file.text ?? ""}
              viewMode={controller.diffMode}
              wrap={controller.wrap}
            />{:else if display === "preview" && controller.file.path.endsWith(".md")}<MarkdownContent
              content={controller.file.text ?? ""}
            />{:else}<CodeBlock
              code={controller.file.text ?? ""}
              language={controller.file.language ?? "plaintext"}
              hasLineNumbers
              isWrapped={controller.wrap}
            />{/if}{:else}<div class="rui-empty">
            Choose a file to inspect its exact captured contents.
          </div>{/if}
      </div>
    </div>
  </div>
</section>
