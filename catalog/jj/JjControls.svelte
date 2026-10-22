<script lang="ts">
  import { onDestroy } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import { listingFiles } from "../../packages/repository-ui/src/jj/logic/history-files.js";
  import type { JjDemo } from "./support/create-demo.svelte.js";
  import {
    RepositoryShell,
    RepositoryIdentifiers,
    RepositorySkeleton,
    RepositoryLogHeader,
    RepositorySourcePicker,
    RepositoryWorkspacePicker,
    RepositoryCommitPicker,
    RepositoryGraph,
    RepositoryChangedFiles,
    RepositoryDiff,
    RepositoryOperationPinPicker,
    commitRows,
    operationRows,
  } from "../../packages/repository-ui/src/jj/index.js";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { createLogCanvas } from "../../packages/repository-ui/src/jj/logic/log-canvas.js";
  import { repositoryWorkspaces } from "../../packages/repository-ui/src/jj/logic/workspaces.js";
  import { operation, revision } from "./support/reference/fixture.js";
  let { demo, part, variant }: { demo: JjDemo; part: string; variant: string } =
    $props();
  let selected = $state("");
  const canvas = createLogCanvas();
  onDestroy(() => void canvas.dispose());
</script>

{#snippet actions()}<Button
    variant="ghost"
    size="icon-xs"
    aria-label="Open repository"
    title="Open repository"
    onclick={() => demo.state.actions.push("open-repository")}
    ><ExternalLinkIcon aria-hidden="true" /></Button
  >{/snippet}
{#snippet controls()}<Button
    size="xs"
    variant="outline"
    onclick={() => demo.state.actions.push("host-controls")}
    >Host source controls</Button
  >{/snippet}

{#snippet graphActions(
  row: import("../../packages/repository-ui/src/jj/logic/graph/model.js").RepositoryLogRevision,
)}<Button
    variant="ghost"
    size="icon-xs"
    aria-label={`Inspect revision ${row.eventId}`}
    onclick={() => demo.state.actions.push(`inspect:${row.eventId}`)}
    ><ExternalLinkIcon aria-hidden="true" /></Button
  >{/snippet}

{#snippet content()}
  {#if part === "RepositoryShell"}<p>
      Recorded repository content in the original embedded AppShell.
    </p>
  {:else if part === "RepositoryIdentifiers"}<div class="identifier-example">
      <RepositoryIdentifiers
        commitId={revision}
        changeId={variant === "CommitOnly" ? "" : "zzzzzzzzzzzzzzzz"}
        placement={variant === "Inline" ? "inline" : "overlay"}
        copyText={demo.copyText}
      />
    </div>
  {:else if part === "RepositorySkeleton"}<RepositorySkeleton
      kind={variant === "Basic"
        ? "log"
        : (variant.toLowerCase() as "files" | "diff" | "blame" | "conflicts")}
    />
  {:else if part === "RepositorySourcePicker"}<RepositorySourcePicker
      picker={demo.source}
    />
  {:else if part === "RepositoryWorkspacePicker"}<RepositoryWorkspacePicker
      workspaces={repositoryWorkspaces(demo.commits)}
      selected={selected || null}
      disabled={variant === "Disabled"}
      onSelect={(id) => (selected = id ?? "")}
    />
  {:else if part === "RepositoryCommitPicker"}<RepositoryCommitPicker
      parents={variant === "MissingParent"
        ? ["missing-parent"]
        : demo.commits.map((c) => c.id)}
      revisions={demo.commits}
      target={selected || undefined}
      loading={variant === "Loading"}
      onOpen={() => {}}
      onSelect={(id) => (selected = id)}
      copyText={demo.copyText}
    />
  {:else if part === "RepositoryOperationPinPicker"}<RepositoryOperationPinPicker
      operations={demo.nodes.map((n) => n.id)}
      {operation}
      nodes={variant === "Multiple" ? demo.nodes : []}
      label="Pinned operation"
      onSelect={(id) => (selected = id)}
      copyText={demo.copyText}
    />
  {:else if part === "RepositoryGraph"}<RepositoryGraph
      revisions={variant === "Empty"
        ? []
        : variant === "Operations"
          ? operationRows(demo.nodes)
          : commitRows(demo.commits)}
      commits={demo.commits}
      selectedId={selected || undefined}
      onSelect={(id) => (selected = id)}
      copyText={demo.copyText}
      operationTitles={variant === "Operations"}
      rowActions={variant === "RowActions" ? graphActions : undefined}
    />
  {:else if part === "RepositoryChangedFiles"}<RepositoryChangedFiles
      files={variant === "Empty"
        ? []
        : demo.dense
          ? listingFiles(demo.dense.changes)
          : [
              { path: "Welcome.md", additions: 2, deletions: 1 },
              { path: "Notes/Plan.md", additions: 12, deletions: 0 },
            ]}
      selectedPath={selected || undefined}
      initialLoading={variant === "Loading"}
      hasMore={variant === "Paged"}
      onSelect={(id) => (selected = id)}
      onMore={() => demo.state.actions.push("more-files")}
    />
  {:else if part === "RepositoryDiff"}<RepositoryDiff
      change={variant === "Unavailable"
        ? {
            ...demo.change,
            content: { status: "unavailable", reason: "binary" },
          }
        : demo.dense
          ? demo.dense.changes[
              variant === "Binary" ? 4 : variant === "Renamed" ? 2 : 0
            ]
          : demo.change}
      viewMode={variant === "Split" ? "split" : "unified"}
    />
  {/if}
{/snippet}

{#if part === "RepositoryShell" || part === "RepositoryLogHeader"}
  <RepositoryShell>
    <ColumnCanvas.Root controller={canvas} aria-label="Foundation canvas">
      <ColumnCanvas.Column id="revisions" columnTitle="JJ Log">
        {#if part === "RepositoryLogHeader"}
          <RepositoryLogHeader
            actions={variant === "HostActions" ? actions : undefined}
            controls={variant === "HostControls" ? controls : undefined}
            title="JJ Log"
            count={demo.commits.length}
            sources={demo.source}
            operations={[operation]}
            {operation}
            busy={variant === "Busy"}
            copyText={demo.copyText}
            onSelect={(id) => void demo.history.selectOperation(id)}
            onRefresh={() => void demo.history.refresh()}
            workspaces={repositoryWorkspaces(demo.commits)}
            workspace={null}
            onWorkspaceSelect={(name) =>
              void demo.history.selectWorkspace(name)}
          />
        {/if}
        <ColumnCanvas.Body>
          {@render content()}
        </ColumnCanvas.Body>
      </ColumnCanvas.Column>
    </ColumnCanvas.Root>
  </RepositoryShell>
{:else}
  <div class="component-stage">
    <div class="component-boundary" data-part={part} data-preview-boundary>
      {@render content()}
    </div>
  </div>
{/if}

<style>
  .component-stage {
    padding: 1.5rem;
    background: var(--muted);
    min-height: 12rem;
  }
  .component-boundary {
    background: var(--background);
    color: var(--foreground);
    border: 1px dashed var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    max-width: 52rem;
    min-height: 4rem;
  }
  p {
    padding: 1rem;
  }
  .component-boundary[data-part="RepositoryDiff"] {
    height: 24rem;
  }
  .identifier-example {
    position: relative;
    min-height: 3rem;
    max-width: 28rem;
    margin: 1rem;
  }
</style>
