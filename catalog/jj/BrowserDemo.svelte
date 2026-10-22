<script lang="ts">
  import "./support/browser-demo.css";
  import { browserTreeEntries } from "../../packages/repository-ui/src/jj/browse/logic/state.js";
  import { pathPageKey } from "../../packages/repository-ui/src/jj/browse/logic/requests.js";
  import { attachBrowserHistory } from "./support/browser-history.js";
  import { onMount, onDestroy, untrack } from "svelte";
  import RepositoryFileAction from "../../packages/repository-ui/src/jj/browse/file-preview/RepositoryFileAction.svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import XIcon from "@lucide/svelte/icons/x";
  import {
    RepositoryBrowser,
    RepositoryReferencePicker,
    RepositoryBreadcrumb,
    RepositoryDirectory,
    RepositoryFileTree,
    RepositoryFilePreview,
    RepositoryFileHistory,
    RepositoryBlamePanel,
    type RepositoryBrowserSelection,
  } from "../../packages/repository-ui/src/jj/index.js";
  import RepositoryBrowserEmpty from "../../packages/repository-ui/src/jj/browse/file-preview/RepositoryBrowserEmpty.svelte";
  import { createBrowserDemo } from "./support/browser-fixture.svelte.js";
  import { browserNow, browserReferences } from "./support/browser-data.js";
  import { createJjDemo } from "./support/create-demo.svelte.js";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let {
    part = "RepositoryBrowser",
    variant = "Basic",
  }: { part?: string; variant?: string } = $props();
  useDemoAuthors();
  const demo = untrack(() =>
    createBrowserDemo(
      part === "RepositoryFilePreview"
        ? ((
            {
              Basic: "Markdown",
              Empty: "EmptyFile",
              Unavailable: "UnavailableFile",
              Loading: "FileLoading",
            } as Record<string, string>
          )[variant] ?? variant)
        : variant,
    ),
  );
  const history = untrack(() => createJjDemo("RepositoryFileHistory"));
  attachBrowserHistory(history.fixture.reader);
  let view = $state(demo.controller.state),
    inspection = $state<"history" | undefined>();
  let reference = $state("bookmark:main");
  let inspectorWidth = $state(420);
  let fileTreeOpen = $state(true),
    fileTreeWidth = $state(256);
  const selection = $derived({
    pin: view.pin,
    path: view.path ?? view.directory,
  });
  const entries = $derived(browserTreeEntries(view));
  const files = $derived(entries.filter((entry) => entry.type === "blob"));
  const directories = $derived(
    entries
      .filter((entry) => entry.type === "tree")
      .map((entry) => ({ path: entry.path })),
  );
  const window = $derived(view.pages[pathPageKey(view.directory)]);
  function showHistory(selection: RepositoryBrowserSelection) {
    inspection = "history";
    demo.events.actions.push(`history:${JSON.stringify(selection)}`);
    void history.files
      .follow(selection.path)
      .then(() => history.files.refresh(selection.pin.operation));
  }
  function showBlame(selection: RepositoryBrowserSelection) {
    inspection = undefined;
    demo.controller.setDisplay("blame");
    demo.events.actions.push(`blame:${JSON.stringify(selection)}`);
    void history.blame.open({
      operation: selection.pin.operation,
      commit: selection.pin.revision,
      path: selection.path,
    });
  }
  async function openRecorded(
    target: RepositoryBrowserSelection,
    revision: string,
    browse: boolean,
  ) {
    demo.events.actions.push(
      `${browse ? "browse" : "code"}:${revision}:${target.path}`,
    );
    inspection = undefined;
    await demo.controller.setPin({ ...target.pin, revision });
    if (browse)
      await demo.controller.openDirectory(
        target.path.split("/").slice(0, -1).join("/"),
      );
    else {
      await demo.controller.openFile(target.path);
      demo.controller.setDisplay("source");
    }
  }
  onMount(() => {
    const unsubscribe = demo.controller.subscribe((state) => (view = state));
    void demo.start().then(() => {
      if (variant === "History") showHistory(selection);
      if (variant === "Blame") showBlame(selection);
    });
    return unsubscribe;
  });
  onDestroy(() => {
    void demo.controller.close();
    void history.close();
  });
</script>

{#snippet controls()}<RepositoryReferencePicker
    value={reference}
    choices={browserReferences}
    now={browserNow}
    copyText={demo.copyText}
    onSelect={(choice) => {
      reference = choice.value;
      demo.selectReference(choice);
    }}
  />{/snippet}
{#snippet directoryActions()}<Button
    variant="ghost"
    size="icon-sm"
    aria-label="Host copy directory"
    title="Host copy directory"
    onclick={() =>
      demo.events.actions.push(
        `directory:${view.pin.operation}:${view.directory}`,
      )}><CopyIcon /></Button
  >{/snippet}
{#snippet rowActions(
  entry: import("../../packages/repository-ui/src/jj/index.js").RepositoryBrowserEntry,
)}<Button
    variant="ghost"
    size="icon-xs"
    aria-label={`Host open ${entry.path}`}
    title={`Host open ${entry.path}`}
    onclick={() =>
      demo.events.actions.push(`open:${view.pin.operation}:${entry.path}`)}
    ><ExternalLinkIcon /></Button
  >{/snippet}
{#snippet fileActions(target: RepositoryBrowserSelection)}<RepositoryFileAction
    label="Host open in workspace"
    onclick={() =>
      demo.events.actions.push(`workspace:${JSON.stringify(target)}`)}
    ><ExternalLinkIcon aria-hidden="true" /></RepositoryFileAction
  >{/snippet}
{#snippet inlineBlame(target: RepositoryBrowserSelection)}<RepositoryBlamePanel
    controller={history.blame}
    commitStats={history.largeCommitStats}
    copyText={demo.copyText}
    onOpen={(revision) =>
      demo.events.actions.push(`revision:${revision}:${target.path}`)}
  />{/snippet}
{#snippet inspector(target: RepositoryBrowserSelection)}
  <div class="browser-inspector">
    <RepositoryFileHistory
      controller={history.files}
      copyText={demo.copyText}
      onOpen={(revision) => void openRecorded(target, revision, false)}
      onBrowse={(revision) => void openRecorded(target, revision, true)}
      onBlame={() => showBlame(target)}
    >
      {#snippet headerActions()}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close file inspector"
          onclick={() => (inspection = undefined)}><XIcon /></Button
        >{/snippet}
    </RepositoryFileHistory>
  </div>
{/snippet}

<div
  class:browser-complete={part === "RepositoryBrowser"}
  class:browser-boundary={part !== "RepositoryBrowser"}
  data-browser-demo
>
  {#if part === "RepositoryBrowser"}
    <RepositoryBrowser
      controller={demo.controller}
      repositoryName="agent-ui"
      now={browserNow}
      copyText={demo.copyText}
      bind:fileTreeOpen
      bind:fileTreeWidth
      bind:inspectorWidth
      onInspectorResize={(width) =>
        demo.events.actions.push(`inspector-layout:${width}`)}
      onLayoutChange={(layout) =>
        demo.events.actions.push(`layout:${JSON.stringify(layout)}`)}
      onOpenRepository={() =>
        demo.events.actions.push(`repository:${view.pin.repository}`)}
      onSelectCommit={(commit) =>
        demo.events.actions.push(`commit:${commit.eventId}`)}
      onHistory={showHistory}
      onBlame={showBlame}
      blame={inlineBlame}
      directoryControls={controls}
      directoryActions={variant === "HostActions"
        ? directoryActions
        : undefined}
      rowActions={variant === "HostActions" ? rowActions : undefined}
      {fileActions}
      inspector={inspection ? inspector : undefined}
    />
  {:else if part === "RepositoryBreadcrumb"}<RepositoryBreadcrumb
      repositoryName="agent-ui"
      path={variant === "Basic"
        ? ""
        : variant === "LongPath"
          ? "packages/a-very-long-package-name/components/nested/editor/README.md"
          : "src/history/controller.ts"}
      onOpenDirectory={(path) => demo.events.actions.push(`directory:${path}`)}
      onOpenRepository={() => demo.events.actions.push("repository")}
    />
  {:else if part === "RepositoryFileTree"}<div class="browser-tree-boundary">
      <RepositoryFileTree
        {files}
        {directories}
        mode={view.mode}
        collapsedDirectoryPaths={view.collapsedDirectoryPaths}
        selectedPath={view.path}
        hasMore={!!view.pages[pathPageKey("", view.mode !== "tree")]
          ?.nextCursor &&
          !view.pages[pathPageKey("", view.mode !== "tree")]?.limitReached}
        loading={view.loadingPages.size > 0}
        onSelectPath={(path) => void demo.controller.openFile(path)}
        onDirectoryToggle={(path) =>
          void demo.controller.toggleDirectory(
            path,
            !view.collapsedDirectoryPaths.has(path),
          )}
        onModeChange={(mode) => void demo.controller.setMode(mode)}
        onLoadMore={() => void demo.controller.more("", view.mode !== "tree")}
      >
        {#snippet empty()}<RepositoryBrowserEmpty
            folder
            title="No repository files"
            description="The selected revision has no loaded files."
          />{/snippet}
      </RepositoryFileTree>
    </div>
  {:else if part === "RepositoryDirectory"}<RepositoryDirectory
      {fileTreeOpen}
      now={browserNow}
      currentPath={view.directory}
      entries={window?.entries ?? []}
      latestCommit={window?.latestCommit}
      documents={window?.documents}
      phase={view.directoryPhase}
      hasMore={!!window?.nextCursor && !window.limitReached}
      loading={view.directoryPhase === "loading"}
      onOpenDirectory={(path) => void demo.controller.openDirectory(path)}
      onOpenFile={(path) => void demo.controller.openFile(path)}
      onRetry={() => void demo.controller.refresh()}
      onLoadMore={() => void demo.controller.more()}
      copyText={demo.copyText}
      {controls}
    />
  {:else}<RepositoryFilePreview
      file={view.file}
      phase={view.filePhase}
      {selection}
      display={view.display}
      now={browserNow}
      {fileTreeOpen}
      onToggleFileTree={() => (fileTreeOpen = !fileTreeOpen)}
      onDisplayChange={(mode) => demo.controller.setDisplay(mode)}
      onRetry={() => void demo.controller.openFile(view.path!, true)}
      copyText={demo.copyText}
      onHistory={showHistory}
      onBlame={showBlame}
      blame={inlineBlame}
      actions={fileActions}
    />{/if}
  <output
    hidden
    data-testid="browser-state"
    data-pin={JSON.stringify(view.pin)}
    data-path={view.path ?? view.directory}
    data-actions={demo.events.actions.join("|")}
    data-count={window?.entries.length ?? 0}
  ></output>
</div>
