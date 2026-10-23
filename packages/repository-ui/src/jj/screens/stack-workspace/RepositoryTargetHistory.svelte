<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackTargetHistory. -->
<script lang="ts">
  import "../../workspace/stack-lane/stack-lane.css";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import * as Card from "@lapismd/design-core/shadcn/card";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import GitBranch from "@lucide/svelte/icons/git-branch";
  import { TagList } from "@lapismd/design-core/shadcn/tag-list";
  import RepositoryGraph from "../../history/graph/RepositoryGraph.svelte";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import Files from "../../workspace/source-files/RepositoryWorkspaceFiles.svelte";
  import Status from "../../workspace/source-files/RepositoryWorkspaceStatus.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import { workspaceRevisionRows } from "../../workspace/stack-lane/presentation.js";
  import { toggleTargetCommit } from "../../../stacks/selection-actions.js";
  import { TARGET_HISTORY_ORIGIN } from "../../../stacks/target-history.svelte.js";
  import type {
    StackWorkspaceController,
    WorkspaceStack,
  } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../../workspace/stack-lane/types.js";
  let {
    controller,
    host,
    now,
  }: {
    controller: StackWorkspaceController;
    host: RepositoryStackHost;
    now?: number;
  } = $props();
  const history = $derived(controller.targetHistory);
  const branch = $derived(controller.snapshot!.target);
  const stack = $derived<WorkspaceStack>({
    id: TARGET_HISTORY_ORIGIN,
    name: branch?.name ?? "Target",
    base: branch?.commit ?? "",
    heads: [],
    commits: [...history.commits].reverse(),
    conflicts: false,
  });
</script>

{#if branch}<ColumnCanvas.Column
    id={TARGET_HISTORY_ORIGIN}
    columnTitle={branch.name}
    resizable
    aria-label={`Target history ${branch.name}`}
  >
    <ColumnCanvas.Header
      ><GitBranch size={16} aria-hidden="true" /><ColumnCanvas.Title
        >{branch.name}</ColumnCanvas.Title
      ><ColumnCanvas.Count
        >{history.total ?? history.commits.length}</ColumnCanvas.Count
      ><ColumnCanvas.HeaderActions
        ><ColumnCanvas.Toggle
          aria-label={`Collapse target ${branch.name}`}
        /></ColumnCanvas.HeaderActions
      ></ColumnCanvas.Header
    >
    <ColumnCanvas.Body scrollStrategy="styled" orientation="both">
      {#if history.error}<Status
          unavailable
          title="Target history unavailable"
          description={history.error}
          onRetry={() => void history.loadMore()}
        />
      {:else if history.loading && !history.commits.length}<RepositorySkeleton
          kind="log"
          label="Loading target history"
        />
      {:else if !history.commits.length}<Status
          title="No commits"
          description="The target branch has no history."
        />
      {:else}<Card.Root class="workspace-bookmark-card"
          ><Card.Header class="workspace-bookmark-header"
            ><GitBranch aria-hidden="true" />
            <div>
              <Card.Title>{branch.name}</Card.Title><Card.Description
                ><RepositoryAuthorAvatar
                  name={branch.author}
                  email={branch.email}
                  size="xs"
                />{branch.author} · <RelativeTime
                  timestamp={branch.createdAt * 1000}
                  now={now === undefined ? undefined : now * 1000}
                /></Card.Description
              ><TagList
                label="Target branch tags"
                tags={[
                  {
                    id: "target",
                    label: "Workspace target",
                    variant: "secondary",
                  },
                ]}
              />
            </div></Card.Header
          ><RepositoryGraph
            revisions={workspaceRevisionRows(stack, history.commits)}
            selectedId={history.selectedId ?? undefined}
            label={`Target commits in ${branch.name}`}
            copyText={host.copyText}
            onSelect={(id) => toggleTargetCommit(controller, id)}
          >
            {#snippet selectedFiles()}{#if history.selectedId}<Files
                  {controller}
                  source={history.selectedId}
                  compact
                  selectedPath={history.diff?.path}
                  onSelect={(path) =>
                    history.selectFile(history.selectedId!, path)}
                />{/if}{/snippet}
          </RepositoryGraph>{#if history.hasMore}<Button
              class="workspace-more"
              variant="ghost"
              disabled={history.loading}
              onclick={() => void history.loadMore()}
              >More target commits</Button
            >{/if}</Card.Root
        >{/if}
    </ColumnCanvas.Body>
  </ColumnCanvas.Column>{/if}
