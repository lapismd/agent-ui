<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { RepositoryStackWorkspace } from "../../packages/repository-ui/src/jj/index.js";
  import {
    StackWorkspaceController,
    type WorkspaceCommand,
  } from "../../packages/repository-ui/src/stacks/index.js";
  import { MockStackWorkspaceAdapter } from "../support/stacks/adapter.js";
  import {
    workspaceFixture,
    fixtureFile,
    fixtureCommit,
  } from "../support/stacks/data.js";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Alert from "@lapismd/design-core/shadcn/alert";
  import * as Select from "@lapismd/design-core/shadcn/select";
  import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  useDemoAuthors();
  const data = workspaceFixture();
  data.workspaces[0]!.unassigned.push(
    fixtureFile("src/panels.ts", ["align panels"]),
  );
  data.stacks[0]!.commits[0]!.immutable = true;
  data.stacks[0]!.commits.push(
    fixtureCommit("api3", "Polish repository API", [
      fixtureFile("src/errors.ts", ["explain failures"]),
    ]),
  );
  data.stacks[0]!.heads[0]!.commit = "api3";
  const adapter = new MockStackWorkspaceAdapter(data);
  const controller = new StackWorkspaceController(adapter);
  controller.page = "workspace";
  let command = $state<WorkspaceCommand | null>(null);
  let applied = $state(0);
  function request(next: WorkspaceCommand) {
    command =
      next.kind === "create_commit"
        ? { ...next, message: next.message || "Stage selected changes" }
        : next.kind === "create_stack"
          ? {
              ...next,
              name:
                next.name || `feature/drop-${controller.snapshot!.revision}`,
            }
          : next;
    if (
      (command.kind === "transfer" && !command.target) ||
      (command.kind === "move_commit" && !command.stack)
    )
      return;
    void controller.prepare(command);
  }
  async function apply() {
    const planned = controller.preview?.request.command;
    await controller.apply();
    applied = adapter.calls.length;
    if (
      planned?.kind === "create_stack" &&
      planned.selections?.length &&
      !controller.error
    ) {
      const stack = controller.snapshot!.stacks.find(
        (stack) => stack.name === planned.name,
      )!;
      request({
        kind: "create_commit",
        stack: stack.id,
        message: "Stage dropped changes",
        selections: planned.selections,
      });
    }
  }
  onMount(() => void controller.refresh());
  onDestroy(() => controller.close());
  function destination(value: string) {
    if (command?.kind !== "move_commit") return;
    const [kind, id] = value.split(":");
    request(
      kind === "stack"
        ? { ...command, stack: id! }
        : {
            kind: "reorder_commit",
            commit: command.commit,
            target: id!,
            placement: kind === "above" ? "above" : "below",
          },
    );
  }
</script>

<div class="drag-demo">
  <Alert.Root>
    <ArrowLeftRight aria-hidden="true" />
    <Alert.Title>Drag changes between columns</Alert.Title>
    <Alert.Description>
      Drag a file or folder from Unstaged onto a stack or commit. Open a file
      diff to drag individual hunks. Drag commits to another branch header, or
      to a row edge to reorder them. Keyboard: select a file, then choose Stage
      changes in the destination stack.
    </Alert.Description>
  </Alert.Root>
  {#if command?.kind === "move_commit" && !command.stack}<section
      class="preview"
      aria-label="Choose commit destination"
    >
      <Select.Root type="single" onValueChange={destination}
        ><Select.Trigger aria-label="Commit destination"
          >Move or reorder commit</Select.Trigger
        ><Select.Content
          ><Select.Group
            ><Select.Label>Another stack</Select.Label
            >{#each controller.snapshot?.stacks ?? [] as stack}<Select.Item
                value={`stack:${stack.id}`}
                label={stack.name}>{stack.name}</Select.Item
              >{/each}</Select.Group
          ><Select.Group
            ><Select.Label>Reorder in current stack</Select.Label
            >{#each controller.snapshot?.stacks
              .find( (stack) => stack.commits.some((commit) => commit.id === (command?.kind === "move_commit" ? command.commit : "")) )
              ?.commits.filter((commit) => commit.id !== (command?.kind === "move_commit" ? command.commit : "")) ?? [] as commit}<Select.Item
                value={`above:${commit.id}`}
                label={`Above ${commit.message}`}
                >Above {commit.message}</Select.Item
              ><Select.Item
                value={`below:${commit.id}`}
                label={`Below ${commit.message}`}
                >Below {commit.message}</Select.Item
              >{/each}</Select.Group
          ></Select.Content
        ></Select.Root
      >
    </section>{/if}
  {#if command?.kind === "transfer" && !command.target}<section
      class="preview"
      aria-label="Choose move destination"
    >
      <Select.Root
        type="single"
        onValueChange={(target) => {
          if (command?.kind === "transfer" && target)
            request({ ...command, target });
        }}
      >
        <Select.Trigger aria-label="Move changes to"
          >Choose a destination</Select.Trigger
        >
        <Select.Content
          ><Select.Group
            ><Select.Label>Move selected changes</Select.Label>
            <Select.Item value="unassigned" label="Unstaged"
              >Unstaged</Select.Item
            >
            {#each controller.snapshot?.stacks ?? [] as stack}{#each stack.commits.filter((commit) => !commit.immutable && commit.id !== (command?.kind === "transfer" ? command.selection.source : undefined)) as commit}<Select.Item
                  value={commit.id}
                  label={commit.message}
                  >{stack.name} · {commit.message}</Select.Item
                >{/each}{/each}
          </Select.Group></Select.Content
        >
      </Select.Root>
    </section>{/if}
  {#if controller.preview}<section class="preview" aria-label="Drop preview">
      <strong>{controller.preview.title}</strong>
      <p>{controller.preview.summary}</p>
      <Button size="sm" disabled={controller.busy} onclick={() => void apply()}
        >Apply in example</Button
      >
      <Button
        size="sm"
        variant="outline"
        disabled={controller.busy}
        onclick={() => controller.cancelPreview()}>Cancel</Button
      >
    </section>
  {/if}
  {#if controller.validation || controller.error}<p role="status">
      {controller.validation || controller.error}
    </p>{/if}
  {#if applied}<p role="status">
      Applied {applied} change{applied === 1 ? "" : "s"} in this example.
    </p>{/if}
  <div class="screen">
    <RepositoryStackWorkspace
      {controller}
      copyText={async () => {}}
      onCommand={request}
    />
  </div>
  <output
    hidden
    data-testid="workspace-drag-state"
    data-loaded={controller.snapshotLoaded}
    data-command={JSON.stringify(command)}
    data-applied={applied}
    data-revision={controller.snapshot?.revision}
    data-snapshot={JSON.stringify(controller.snapshot)}
  ></output>
</div>

<style>
  .drag-demo {
    height: 100dvh;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
  }
  .screen {
    flex: 1;
    min-height: 0;
  }
  .preview {
    flex: none;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--background);
  }
  .preview p {
    margin: 0.35rem 0 0.5rem;
    font-size: 0.8125rem;
  }
  .drag-demo > p {
    margin: 0;
    font-size: 0.8125rem;
  }
</style>
