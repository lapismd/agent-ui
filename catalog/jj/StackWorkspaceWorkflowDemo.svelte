<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { RepositoryStackWorkspace } from "../../packages/repository-ui/src/jj/index.js";
  import {
    StackWorkspaceController,
    type WorkspaceCommand,
  } from "../../packages/repository-ui/src/stacks/index.js";
  import { RepositoryPullRequestReview } from "../../packages/repository-ui/src/jj/forge/pull-request/review.svelte.js";
  import { pullRequestScope } from "../../packages/repository-ui/src/jj/forge/pull-request/scope.js";
  import type { PullRequestRequest } from "../../packages/repository-ui/src/jj/forge/pull-request/types.js";
  import { MockStackWorkspaceAdapter } from "../support/stacks/adapter.js";
  import { workspaceFixture } from "../support/stacks/data.js";
  import { recordedPullRequest } from "./support/pull-request-data.js";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Alert from "@lapismd/design-core/shadcn/alert";
  import GitPullRequest from "@lucide/svelte/icons/git-pull-request";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let {
    page = "workspace",
    floating = false,
  }: { page?: "branches" | "workspace"; floating?: boolean } = $props();
  useDemoAuthors();
  const adapter = new MockStackWorkspaceAdapter(workspaceFixture());
  const controller = new StackWorkspaceController(adapter);
  controller.page = untrack(() => page);
  const review = new RepositoryPullRequestReview();
  let prRequest = $state<PullRequestRequest | null>(null);
  let requests = $state<string[]>([]),
    applied = $state(0);
  let message = $state("");
  function request(command: WorkspaceCommand) {
    requests.push(JSON.stringify(command));
    if (
      command.kind === "create_commit" &&
      !command.message &&
      controller.snapshot
    ) {
      for (const selection of command.selections ?? [command.selection])
        controller.commitDrafts.open(
          controller.snapshot,
          command.stack,
          selection,
        );
    } else void controller.prepare(command);
  }
  async function apply() {
    const command = controller.preview?.request.command;
    await controller.apply();
    applied = adapter.calls.length;
    if (controller.error || !controller.snapshot) return;
    if (command?.kind === "create_commit")
      controller.commitDrafts.clear(controller.snapshot.active!, command.stack);
    review.sync(pullRequestScope(controller.snapshot), review.records);
  }
  function prAction(request: PullRequestRequest) {
    prRequest = request;
    review.pending = true;
  }
  function applyPr() {
    if (!prRequest || !controller.snapshot) return;
    const action = prRequest.action;
    const next = review.records.map((pr) =>
      pr.id !== prRequest!.id
        ? pr
        : action.kind === "edit"
          ? { ...pr, title: action.title, body: action.body }
          : action.kind === "draft"
            ? { ...pr, draft: action.draft }
            : action.kind === "merge"
              ? { ...pr, state: "merged" as const }
              : pr,
    );
    review.sync(pullRequestScope(controller.snapshot), next);
    if (action.kind === "edit")
      review.draft(review.pr(prRequest.branch)!).editing = false;
    message = `Applied ${action.kind} in this example.`;
    review.pending = false;
    prRequest = null;
  }
  onMount(() => {
    void (async () => {
      await controller.refresh();
      if (!controller.snapshot) return;
      const stack = controller.snapshot.stacks[0]!;
      review.sync(pullRequestScope(controller.snapshot), [
        recordedPullRequest(stack.name, stack.commits.at(-1)!.id),
      ]);
      review.select(stack.name);
      if (page === "branches") controller.selectStack(stack.id, stack.name);
      controller.selectCommit(stack.commits.at(-1)!.id, stack.id);
      controller.selectFile(
        stack.commits.at(-1)!.id,
        stack.commits.at(-1)!.files[0]!.path,
        undefined,
        stack.id,
      );
    })();
  });
  onDestroy(() => controller.close());
</script>

<div class="workflow-demo">
  <Alert.Root
    ><GitPullRequest aria-hidden="true" /><Alert.Title
      >Stacks and pull request workflow</Alert.Title
    ><Alert.Description
      >Review the PR above the diff. Edit or float its details; changes stay in
      this example until Apply. Branch and commit actions request exact host
      commands.</Alert.Description
    ></Alert.Root
  >
  {#if controller.preview}<section
      class="workflow-preview"
      aria-label="Command preview"
    >
      <strong>{controller.preview.title}</strong>
      <p>{controller.preview.summary}</p>
      <Button size="sm" disabled={controller.busy} onclick={() => void apply()}
        >Apply in example</Button
      ><Button
        size="sm"
        variant="outline"
        disabled={controller.busy}
        onclick={() => controller.cancelPreview()}>Cancel</Button
      >
    </section>{/if}
  {#if prRequest}<section
      class="workflow-preview"
      aria-label="Pull request action preview"
    >
      <strong>Review {prRequest.action.kind} for PR #{prRequest.number}</strong>
      <p>Head {prRequest.expectedSha}. This affects the example only.</p>
      <Button size="sm" onclick={applyPr}>Apply PR action</Button><Button
        size="sm"
        variant="outline"
        onclick={() => {
          review.pending = false;
          prRequest = null;
        }}>Cancel PR action</Button
      >
    </section>{/if}
  {#if message}<p role="status">{message}</p>{/if}
  <div class="workflow-screen">
    <RepositoryStackWorkspace
      {controller}
      pullRequests={review}
      copyText={async (text) => {
        message = `Copied ${text}`;
      }}
      onCommand={request}
      onPullRequestAction={prAction}
      onSubmitStack={(stack) =>
        (message = `Submit stack requested for ${stack.name}`)}
      onWorkspaceSettings={() => (message = "Workspace settings requested")}
      onPushBranch={(branch) => (message = `Push requested for ${branch}`)}
      onCreatePullRequest={(branch) =>
        (message = `Create PR requested for ${branch}`)}
    />
  </div>
  <output
    hidden
    data-testid="workspace-workflow-state"
    data-loaded={controller.snapshotLoaded}
    data-pr-request={JSON.stringify(prRequest)}
    data-requests={JSON.stringify(requests)}
    data-applied={applied}
    data-read-key={controller.snapshot?.readKey}
    data-floating-requested={floating}
  ></output>
</div>

<style>
  .workflow-demo {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    box-sizing: border-box;
    min-height: 0;
  }
  .workflow-screen {
    flex: 1;
    min-height: 0;
  }
  .workflow-preview {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.8125rem;
  }
  .workflow-preview p {
    margin: 0.5rem 0;
  }
  .workflow-demo > p {
    margin: 0;
    font-size: 0.8125rem;
  }
</style>
