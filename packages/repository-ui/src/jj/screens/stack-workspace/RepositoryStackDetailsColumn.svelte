<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackWorkspaceDetailsColumn. -->
<script lang="ts">
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import FileSearch from "@lucide/svelte/icons/file-search";
  import PullRequest from "../../forge/pull-request/RepositoryPullRequest.svelte";
  import Diff from "../../workspace/diff/RepositoryWorkspaceDiff.svelte";
  import type {
    StackWorkspaceController,
    WorkspaceOpenDiff,
  } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../../workspace/stack-lane/types.js";
  import { pullRequestScope } from "../../forge/pull-request/scope.js";
  let {
    controller,
    host,
    origin,
    branch,
    diff,
  }: {
    controller: StackWorkspaceController;
    host: RepositoryStackHost;
    origin: string;
    branch?: string;
    diff?: WorkspaceOpenDiff;
  } = $props();
  const review = $derived(host.pullRequests);
  const pr = $derived(
    branch &&
      controller.snapshot &&
      review?.matches(pullRequestScope(controller.snapshot))
      ? review.pr(branch)
      : undefined,
  );
  function close() {
    controller.closeDiff(origin);
    if (review && review.selectedBranch === branch) review.close();
  }
</script>

{#if review && branch && pr}
  <ColumnCanvas.Column
    resizable
    id={`diff-${origin}`}
    columnTitle="Pull request and diff"
    class="workspace-details"
    aria-label={`Selected changes from ${origin}`}
  >
    <ColumnCanvas.Body scrollStrategy="styled"
      ><div class="workspace-details__sections">
        <PullRequest
          {review}
          {branch}
          disabled={controller.locked}
          onAction={host.onPullRequestAction}
          onClose={close}
        />
        {#if diff}<Diff {controller} {diff} {host} embedded />{:else}<section
            class="workspace-details__file"
            aria-label="Selected file diff"
          >
            <Empty.Root
              ><Empty.Header
                ><Empty.Media variant="icon"
                  ><FileSearch aria-hidden="true" /></Empty.Media
                ><Empty.Title>No file selected</Empty.Title><Empty.Description
                  >Select a changed file to preview its diff below this pull
                  request.</Empty.Description
                ></Empty.Header
              ></Empty.Root
            >
          </section>{/if}
      </div></ColumnCanvas.Body
    >
  </ColumnCanvas.Column>
{:else if diff}<Diff {controller} {diff} {host} />{/if}

<style>
  :global(.workspace-details[data-ui-part="column"]) {
    border: 0;
    border-radius: 0;
    background: transparent;
  }
  .workspace-details__sections {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }
  .workspace-details__file {
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--ui-column-canvas-radius, var(--radius));
    background: var(--background);
  }
</style>
