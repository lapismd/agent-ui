<script lang="ts">
  import Status from "../jj/workspace/source-files/RepositoryWorkspaceStatus.svelte";
  import { onDestroy } from "svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { FileListing, FileDiff } from "@lapismd/design-core/diff";
  import { TagList } from "@lapismd/design-core/shadcn/tag-list";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  import {
    buildRepositoryLogGraph,
    repositoryLogSvgWidth,
  } from "../history/repository-log-graph.js";
  import RepositoryGraphSvg from "./RepositoryGraphSvg.svelte";
  let { controller }: { controller: RepositoryController } = $props();
  const canvas = ColumnCanvas.createColumnCanvasController({
    columns: {
      log: { defaultWidth: 410, minWidth: 250, resizable: true },
      files: { defaultWidth: 300, minWidth: 220, resizable: true },
      diff: { defaultWidth: 550, minWidth: 280, resizable: true },
    },
  });
  onDestroy(() => void canvas.dispose());
  const operation = $derived(controller.view === "operations");
  const rows = $derived(
    buildRepositoryLogGraph(
      operation
        ? (controller.snapshot?.operations ?? []).map((v) => ({
            eventId: v.id,
            changeId: "",
            parents: v.parents,
            message: v.description,
            reason: "checkpoint" as const,
            author: v.actor,
            millis: Date.parse(v.timestamp),
            tags: v.snapshot ? ["Snapshot"] : [],
          }))
        : (controller.snapshot?.revisions ?? []).map((v) => ({
            eventId: v.id,
            changeId: v.changeId,
            parents:
              controller.view === "evolution"
                ? (v.predecessors ?? [])
                : v.parents,
            message: v.description,
            reason:
              v.parents.length > 1
                ? ("merge" as const)
                : ("checkpoint" as const),
            author: v.author,
            millis: Date.parse(v.timestamp),
            tags: v.bookmarks,
            conflicted: v.conflicted,
          })),
    ),
  );
  const width = $derived(repositoryLogSvgWidth(rows));
</script>

<section
  class="rui-screen"
  aria-label={operation ? "Operation log" : "Commit history"}
>
  <ColumnCanvas.Root controller={canvas}
    ><ColumnCanvas.Column id="log" columnTitle={operation ? "Op Log" : "JJ Log"}
      ><ColumnCanvas.Header
        ><ColumnCanvas.Title
          >{operation
            ? "Op Log"
            : controller.view === "evolution"
              ? "Evolution"
              : "JJ Log"}</ColumnCanvas.Title
        ><ColumnCanvas.Count>{rows.length}</ColumnCanvas.Count
        ></ColumnCanvas.Header
      ><ColumnCanvas.Body
        >{#each rows as row}<div
            class="rui-history-row"
            data-selected={(operation
              ? controller.selectedOperation
              : controller.selectedRevision) === row.revision.eventId}
          >
            <RepositoryGraphSvg {row} {width} rowHeight={88} graphHeight={88} />
            <div class="rui-row-main">
              <button
                class="rui-history-select"
                onclick={() => {
                  if (operation)
                    controller.selectedOperation = row.revision.eventId;
                  else controller.selectRevision(row.revision.eventId);
                  canvas.open("files");
                }}
                ><strong>{row.revision.message}</strong><span class="rui-muted"
                  >{row.revision.author} · {new Date(
                    Number(row.revision.millis),
                  ).toLocaleDateString()}</span
                ></button
              >
              <div class="rui-actions">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Copy full ${operation ? "operation" : "commit"} ID ${row.revision.eventId}`}
                  onclick={() => void controller.copy(row.revision.eventId)}
                  >{row.revision.eventId.slice(0, 8)}</Button
                >{#if row.revision.changeId}<span class="rui-mono"
                    >{row.changeIdEncoded.slice(0, 8)}</span
                  >{/if}
              </div>
              {#if row.revision.tags.length}<TagList
                  tags={row.revision.tags.map((text) => ({
                    id: text,
                    label: text,
                  }))}
                />{/if}
            </div>
          </div>{/each}{#if !rows.length}<Status
            title="No recorded history"
            description="This captured repository has no history to display."
          />{/if}{#if controller.snapshot?.nextCursor}<Button
            onclick={() =>
              void controller.refresh({
                cursor: controller.snapshot?.nextCursor,
              })}>Load older history</Button
          >{/if}</ColumnCanvas.Body
      ></ColumnCanvas.Column
    >
    {#if controller.selectedRevision || controller.selectedOperation}<ColumnCanvas.Column
        id="files"
        columnTitle="Changed files"
        ><ColumnCanvas.Header
          ><ColumnCanvas.Title>Changed files</ColumnCanvas.Title
          ></ColumnCanvas.Header
        ><ColumnCanvas.Body
          ><div class="rui-toolbar">
            <span class="rui-mono"
              >{controller.selectedRevision ||
                controller.selectedOperation}</span
            >{#if (controller.revision?.parents.length ?? 0) > 1}<label
                >Compare parent<select
                  class="rui-select"
                  bind:value={controller.selectedParent}
                  ><option value="">Choose a parent</option
                  >{#each controller.revision?.parents ?? [] as parent}<option
                      value={parent}>{parent.slice(0, 10)}</option
                    >{/each}</select
                ></label
              >{/if}
          </div>
          {#if (controller.revision?.parents.length ?? 0) < 2 || controller.selectedParent}<FileListing
              files={controller.snapshot?.files.filter(
                (f) => f.kind === "file",
              ) ?? []}
              mode={controller.mode}
              selectedPath={controller.selectedPath}
              onSelectPath={(path) => {
                controller.selectedPath = path;
                canvas.open("diff");
              }}
            />{:else}<Status
              title="Select a comparison"
              description="Choose an explicit parent comparison."
            />{/if}</ColumnCanvas.Body
        ></ColumnCanvas.Column
      >{/if}
    {#if controller.file}<ColumnCanvas.Column
        id="diff"
        columnTitle={controller.file.path}
        ><ColumnCanvas.Header
          ><ColumnCanvas.Title>{controller.file.path}</ColumnCanvas.Title
          ><ColumnCanvas.HeaderActions
            ><Button
              size="sm"
              variant="ghost"
              onclick={() =>
                (controller.diffMode =
                  controller.diffMode === "unified" ? "split" : "unified")}
              >{controller.diffMode}</Button
            ><Button
              size="sm"
              variant="ghost"
              aria-pressed={controller.wrap}
              onclick={() => (controller.wrap = !controller.wrap)}>Wrap</Button
            ><Button
              size="sm"
              variant="ghost"
              onclick={() => (controller.selectedPath = "")}>Close diff</Button
            ></ColumnCanvas.HeaderActions
          ></ColumnCanvas.Header
        ><ColumnCanvas.Body
          >{#if controller.file.unavailable}<Status
              unavailable
              title="File unavailable"
              description={controller.file.unavailable}
            />{:else}<FileDiff
              path={controller.file.path}
              oldText={controller.file.previous ?? ""}
              newText={controller.file.text ?? ""}
              viewMode={controller.diffMode}
              wrap={controller.wrap}
            />{/if}</ColumnCanvas.Body
        ></ColumnCanvas.Column
      >{/if}</ColumnCanvas.Root
  >
</section>

<style>
  .rui-history-row {
    display: flex;
    min-height: 88px;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border);
    padding-right: 0.5rem;
  }
  .rui-history-row[data-selected="true"] {
    background: var(--accent);
  }
  .rui-history-select {
    display: grid;
    gap: 0.3rem;
    text-align: left;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    padding: 0.65rem 0;
    cursor: pointer;
    width: 100%;
  }
</style>
