<script lang="ts">
  import { onDestroy } from "svelte";
  import OriginalPanel from "../../../lapis-desktop/src/components/repository/RepositoryPanel.svelte";
  import OriginalOperations from "../../../lapis-desktop/src/components/repository/RepositoryOperations.svelte";
  import OriginalBlame from "../../../lapis-desktop/src/components/repository/blame/RepositoryBlameView.svelte";
  import { HistoryController as OriginalHistoryController } from "../../../lapis-desktop/src/lib/repository/history-controller.ts";
  import { OperationController as OriginalOperationController } from "../../../lapis-desktop/src/lib/repository/operation-controller.ts";
  import { BlameController as OriginalBlameController } from "../../../lapis-desktop/src/lib/repository/blame-controller.ts";
  import {
    RepositoryPanel,
    RepositoryOperations,
    HistoryController,
    OperationController,
    BlameController,
    type BlameState,
  } from "../../packages/repository-ui/src/jj/index.js";
  import Blame from "../../packages/repository-ui/src/jj/blame/blame-view/RepositoryBlameView.svelte";
  import { operationFixture } from "../../catalog/jj/support/reference/operations.js";
  import {
    operation,
    revision,
  } from "../../catalog/jj/support/reference/fixture.js";
  import {
    attachLargeBlame,
    largeBlamePath,
  } from "../../catalog/jj/support/large-blame.js";
  const params = new URLSearchParams(location.search),
    mode = params.get("jj");
  let original = $state(params.get("source") === "desktop"),
    generation = $state(0);
  const fixture = operationFixture();
  if (mode === "blame") attachLargeBlame(fixture.reader);
  const errors = $state<string[]>([]);
  const feedback = {
    report(error: unknown) {
      errors.push(String(error));
    },
    recovered() {},
  };
  const history = new HistoryController(fixture.reader, feedback),
    originalHistory = new OriginalHistoryController(fixture.reader, feedback);
  const operations = new OperationController(fixture.reader, feedback),
    originalOperations = new OriginalOperationController(
      fixture.reader,
      feedback,
    );
  const blame = new BlameController(fixture.reader, feedback),
    originalBlame = new OriginalBlameController(fixture.reader, feedback);
  let view = $state<BlameState>({ status: "idle", busy: false });
  $effect(() => {
    if (mode !== "blame") return;
    const controller = original ? originalBlame : blame;
    const unsubscribe = controller.subscribe((state) => {
      view = state;
    });
    void controller.open({ operation, commit: revision, path: largeBlamePath });
    return unsubscribe;
  });
  onDestroy(() => {
    void Promise.all([
      history.close(),
      originalHistory.close(),
      operations.close(),
      originalOperations.close(),
      blame.close(),
      originalBlame.close(),
    ]);
  });
  const copyText = async (_text: string) => {};
</script>

<!-- Capture controls keep the same loaded fonts/styles while changing only the renderer. -->
<button
  hidden
  data-testid="reference-switch"
  onclick={() => {
    original = !original;
  }}>Switch reference renderer</button
>
<button
  hidden
  data-testid="reference-remount"
  onclick={() => {
    generation++;
  }}>Remount reference renderer</button
>
<div
  class="reference-repository"
  data-source={original ? "desktop" : "extracted"}
>
  {#key generation}
    {#if mode === "log"}
      {#if original}<OriginalPanel
          controller={originalHistory}
          {copyText}
        />{:else}<RepositoryPanel controller={history} {copyText} />{/if}
    {:else if mode === "operations"}
      {#if original}<OriginalOperations
          controller={originalOperations}
          {copyText}
        />{:else}<RepositoryOperations
          controller={operations}
          {copyText}
        />{/if}
    {:else if view.contents !== undefined}
      {#if original}<OriginalBlame
          contents={view.contents}
          path={largeBlamePath}
          {view}
          now={1792252800000}
        />{:else}<Blame
          contents={view.contents}
          path={largeBlamePath}
          {view}
          now={1792252800000}
        />{/if}
    {/if}
  {/key}
</div>
<output hidden data-testid="reference-errors">{errors.join(",")}</output>

<style>
  .reference-repository {
    height: 100dvh;
    font-size: 0.875rem;
  }
</style>
