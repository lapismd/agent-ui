<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import {
    RepositoryDiffViewer,
    createRepositoryDiffMenu,
    initialHistoryState,
  } from "../../packages/repository-ui/src/jj/index.js";
  import { createJjDemo } from "./support/create-demo.svelte.js";
  let { variant = "Basic" }: { variant?: string } = $props();
  const demo = untrack(() => createJjDemo("RepositoryPanel", "AllInOne"));
  let release: (() => void) | undefined;
  const read = demo.fixture.reader.read;
  let failed = false;
  demo.fixture.reader.read = async (handle, query) => {
    if (query.kind === "diff" && variant === "Loading")
      await new Promise<void>((resolve) => (release = resolve));
    if (query.kind === "diff" && variant === "Retry" && !failed) {
      failed = true;
      throw Error("The captured file is temporarily unavailable");
    }
    return read(handle, query);
  };
  let snapshot = $state(initialHistoryState());
  const menu = createRepositoryDiffMenu({
    copyText: demo.copyText,
    absolutePath: ({ path }) => `/workspace/lapis/${path}`,
    reveal: ({ path }) => {
      demo.state.actions.push(`reveal:${path}`);
    },
  });
  onMount(() => {
    const unsubscribe = demo.history.subscribe((value) => (snapshot = value));
    void demo.history.refresh().then(async () => {
      if (variant === "Empty") return;
      await demo.history.selectRevision(demo.history.state.commits[0]);
      await demo.history.selectPath(demo.history.state.paths[0].path);
    });
    return unsubscribe;
  });
  onDestroy(() => {
    release?.();
    void demo.close();
  });
</script>

<div class="diff-viewer-demo">
  <nav class="file-shortcuts" aria-label="Changed file shortcuts">
    {#each snapshot.paths as file (file.path)}<Button
        size="xs"
        variant="ghost"
        onclick={() => demo.history.selectPath(file.path)}>{file.path}</Button
      >{/each}
  </nav>
  <div class="diff-viewer-surface">
    <RepositoryDiffViewer
      comparisonKey={`${snapshot.operation}/${snapshot.base}/${snapshot.revision?.id}`}
      from={snapshot.base ?? ""}
      to={snapshot.revision?.id ?? ""}
      operation={snapshot.operation}
      files={snapshot.paths}
      entries={snapshot.diffs}
      selectedPath={snapshot.path}
      selectionRequest={snapshot.pathRequest}
      fileMode={variant === "SingleFile" ? "single" : "all"}
      viewMode={variant === "Split" ? "split" : "unified"}
      pageSize={variant === "Paged" ? 4 : 20}
      hasMore={!!snapshot.nextPath}
      onLoad={(path) => demo.history.loadDiff(path)}
      onMore={() => demo.history.morePaths()}
      getDiffMenuItems={() => menu}
    />
  </div>
  <output data-testid="diff-viewer-actions"
    >{demo.state.actions.join("\n")}</output
  >
</div>

<style>
  .diff-viewer-demo {
    padding: 1rem;
  }
  .file-shortcuts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
  .diff-viewer-surface {
    height: 34rem;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  output {
    font-size: 0.75rem;
  }
</style>
