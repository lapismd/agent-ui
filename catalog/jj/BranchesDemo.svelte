<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import {
    RepositoryBranches,
    RepositoryBranchCommand,
    bookmarkKey,
  } from "../../packages/repository-ui/src/jj/index.js";
  import {
    createBranchesDemo,
    branchesNow,
  } from "./support/branches-fixture.js";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let {
    variant = "Basic",
    standalone = false,
  }: { variant?: string; standalone?: boolean } = $props();
  useDemoAuthors();
  const demo = untrack(() => createBranchesDemo(variant));
  const actions = $state<string[]>([]);
  let view = $state(untrack(() => demo.controller.state));
  let mode = $state<"single" | "all">(
    untrack(() => (variant === "AllInOne" ? "all" : "single")),
  );
  onMount(() => {
    const off = demo.controller.subscribe((value) => (view = value));
    void demo.start();
    return off;
  });
  onDestroy(() => void demo.close());
</script>

{#snippet branchActions(
  bookmark: import("../../packages/repository-ui/src/jj/index.js").RepositoryBookmark,
)}<Button
    variant="ghost"
    size="sm"
    onclick={() => actions.push(`branch:${bookmarkKey(bookmark)}`)}
    ><ExternalLinkIcon data-icon="inline-start" />Open branch in host</Button
  >{/snippet}
{#snippet headerActions()}<Button
    variant="ghost"
    size="sm"
    onclick={() => actions.push(`header:${view.pin?.operation}`)}
    >Host action</Button
  >{/snippet}
<div class:complete={!standalone} class:bounded={standalone} data-branches-demo>
  {#if standalone}<RepositoryBranchCommand
      bookmarks={demo.bookmarks}
      workingCopies={demo.workingCopies}
      selected={view.selected?.kind === "bookmark"
        ? bookmarkKey(view.selected)
        : ""}
      selectedWorkspace={view.selected?.kind === "workspace"
        ? view.selected.workspace
        : null}
      now={branchesNow}
      onSelect={(key) => {
        const row = demo.bookmarks.find((item) => bookmarkKey(item) === key);
        if (row)
          void demo.controller.select({
            kind: "bookmark",
            name: row.name,
            remote: row.remote,
          });
      }}
      onSelectWorkingCopy={(_id, workspace) => {
        if (workspace)
          void demo.controller.select({ kind: "workspace", workspace });
      }}
      actions={variant === "HostActions" ? branchActions : undefined}
    />
  {:else}<RepositoryBranches
      controller={demo.controller}
      copyText={demo.copyText}
      now={branchesNow}
      diffFileMode={mode}
      onDiffFileModeChange={(value) => (mode = value)}
      branchActions={variant === "HostActions" ? branchActions : undefined}
      branchHeaderActions={variant === "HostActions"
        ? headerActions
        : undefined}
      revisionHeaderActions={variant === "HostActions"
        ? headerActions
        : undefined}
    />{/if}
  <output
    hidden
    data-testid="branches-state"
    data-selected={JSON.stringify(view.selected)}
    data-targets={view.targets.join(",")}
    data-revset={view.history.revset}
    data-operation={view.history.operation}
    data-count={view.history.commits.length}
    data-path={view.history.path ?? ""}
    data-phase={view.phase}
    data-requests={demo.requests.length}
    data-actions={actions.join("|")}
  ></output>
</div>

<style>
  .complete {
    height: 100dvh;
    min-height: 0;
  }
  .bounded {
    margin: 1.5rem;
    border: 1px solid var(--border);
    width: min(32rem, calc(100% - 3rem));
    max-height: 42rem;
    overflow: auto;
  }
  :global(.sbdocs .complete) {
    height: 40rem;
  }
</style>
