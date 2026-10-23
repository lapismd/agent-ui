<script lang="ts">
  import Status from "../jj/workspace/source-files/RepositoryWorkspaceStatus.svelte";
  import RepositorySkeleton from "../jj/foundations/skeleton/RepositorySkeleton.svelte";
  import { FileDiff } from "@lapismd/design-core/diff";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import type {
    WorkspaceCommand,
    WorkspaceOpenDiff,
    WorkspaceSelection,
  } from "../stacks/types.js";
  let {
    controller,
    diff,
    onCommand,
  }: {
    controller: StackWorkspaceController;
    diff: WorkspaceOpenDiff;
    onCommand: (command: WorkspaceCommand) => void;
  } = $props();
  let destination = $state("unassigned");
  let view = $state<"unified" | "split">("unified");
  let wrap = $state(true);
  const file = $derived(
    controller.filesFor(diff.source).find((f) => f.path === diff.path),
  );
  function selection(hunk?: string): WorkspaceSelection {
    return {
      source: file?.selectionSource ?? diff.source,
      path: diff.path,
      ...(hunk ? { hunks: [hunk] } : {}),
    };
  }
  function assign(hunk?: string) {
    onCommand({
      kind: "transfer",
      target: destination,
      selection: selection(hunk),
    });
  }
</script>

<section class="rui-screen" aria-label={`Diff ${diff.path}`}>
  <header class="rui-toolbar">
    <strong>{diff.path}</strong><Button
      size="sm"
      variant="ghost"
      onclick={() => (view = view === "unified" ? "split" : "unified")}
      >{view}</Button
    ><Button
      size="sm"
      variant="ghost"
      aria-pressed={wrap}
      onclick={() => (wrap = !wrap)}>Wrap</Button
    ><Button
      size="sm"
      variant="ghost"
      onclick={() => controller.closeDiff(diff.origin)}>Close diff</Button
    >
  </header>
  <div class="rui-scroll">
    {#if file?.content?.status === "unavailable"}<Status
        unavailable
        title="Preview unavailable"
        description={file.content.reason}
      />{:else if !file}<RepositorySkeleton
        kind="diff"
        label="Loading selected file"
      />{:else}<label class="rui-field"
        >Assign selected changes to<select bind:value={destination}
          ><option value="unassigned">Unstaged</option
          >{#each controller.snapshot?.stacks ?? [] as stack}{#each stack.commits.filter((c) => !c.immutable && c.id !== diff.source) as commit}<option
                value={commit.id}>{stack.name} · {commit.message}</option
              >{/each}{/each}</select
        ></label
      ><Button
        disabled={!controller.can("transfer") || destination === diff.source}
        onclick={() => assign()}>Preview whole-file transfer</Button
      >{#each file.hunks as hunk}<article
          class="rui-card"
          aria-label={hunk.label}
          draggable={controller.can("transfer") &&
            !diff.source.startsWith("branch:")}
          ondragstart={(event) =>
            controller.drag.start(event, {
              kind: "selection",
              selection: selection(hunk.id),
            })}
          ondragend={() => controller.drag.clear()}
        >
          <header class="rui-toolbar">
            <strong>{hunk.label}</strong><Button
              size="sm"
              disabled={!controller.can("transfer") ||
                destination === diff.source}
              onclick={() => assign(hunk.id)}>Assign this hunk</Button
            >
          </header>
          <FileDiff
            path={diff.path}
            patch={hunk.patch}
            viewMode={view}
            {wrap}
          />
        </article>{/each}{#if !file.hunks.length}<Status
          title="No text hunks available"
          description="The selected file has no text changes to show."
        />{/if}{/if}
  </div>
</section>
