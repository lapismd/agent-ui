<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import FileQuestionIcon from "@lucide/svelte/icons/file-question-mark";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import { onMount } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
  import WrapTextIcon from "@lucide/svelte/icons/wrap-text";
  import { Toggle } from "@lapismd/design-core/shadcn/toggle";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import type { BlameController } from "../../logic/blame-controller.js";
  import type { BlameState } from "../../logic/blame-model.js";
  import RepositoryBlameView from "../blame-view/RepositoryBlameView.svelte";
  import RepositoryFileTitle from "../../history/file-title/RepositoryFileTitle.svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import { encodeJjChangeId } from "../../../history/repository-log-graph.js";
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
  let {
    controller,
    copyText,
    onOpen,
    commitStats,
    wrap = $bindable(true),
    onWrapChange,
  }: {
    controller: BlameController;
    wrap?: boolean;
    onWrapChange?(wrap: boolean): void;
    copyText(value: string): Promise<void>;
    onOpen(commit: string): void;
    commitStats?: Readonly<
      Record<string, { additions: number; deletions: number }>
    >;
  } = $props();
  let viewState = $state<BlameState>({ status: "loading", busy: false });
  onMount(() =>
    controller.subscribe((value) => {
      viewState = value;
    }),
  );
</script>

<RepositoryShell>
  <section
    class="blame-panel"
    aria-label="File blame"
    aria-busy={viewState.busy}
  >
    <header>
      <span class="file-title"
        ><RepositoryFileTitle path={viewState.selection?.path} /></span
      >
      <RepositoryIdentifiers
        {copyText}
        commitId={viewState.selection?.commit}
        changeId={encodeJjChangeId(
          viewState.progress?.commits[viewState.selection?.commit ?? ""]
            ?.change_id ?? "",
        )}
        placement="inline"
      />
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Toggle
                {...props}
                pressed={wrap}
                onPressedChange={(pressed) => {
                  wrap = pressed;
                  onWrapChange?.(pressed);
                }}
                size="sm"
                class="wrap-toggle"
                aria-label="Wrap text"
                ><WrapTextIcon aria-hidden="true" /></Toggle
              >
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content role="tooltip">Wrap text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Refresh blame"
        disabled={viewState.busy}
        onclick={() => controller.refresh()}><RefreshCwIcon /></Button
      >
    </header>
    {#if viewState.status === "failed"}<Empty.Root role="status"
        ><Empty.Header
          ><Empty.Media variant="icon"
            ><FileQuestionIcon aria-hidden="true" /></Empty.Media
          ><Empty.Title>Blame unavailable</Empty.Title><Empty.Description
            >Refresh to try reading the recorded file attribution again.</Empty.Description
          ></Empty.Header
        ></Empty.Root
      >{/if}
    <div class="blame-body">
      {#if viewState.contents === undefined && viewState.busy}<RepositorySkeleton
          kind="blame"
          label="Loading file blame…"
        />
      {:else if viewState.contents !== undefined}
        <RepositoryBlameView
          contents={viewState.contents}
          path={viewState.selection?.path ?? ""}
          view={viewState}
          {onOpen}
          {commitStats}
          {wrap}
        />
      {/if}
    </div>
  </section>
</RepositoryShell>

<style>
  .blame-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    min-width: 0;
    font-size: var(--ui-repository-blame-panel-font-size, 0.875rem);
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--border);
  }
  .file-title {
    flex: 1;
    min-width: 0;
  }
  header :global(.wrap-toggle) {
    width: 1.75rem;
    min-width: 1.75rem;
    height: 1.75rem;
    padding: 0;
  }
  .blame-body {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
</style>
