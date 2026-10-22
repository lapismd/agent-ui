export const Basic = `<script lang="ts">
  import { onMount } from "svelte";
  import { RepositoryDiffViewer, createRepositoryDiffMenu, type HistoryController } from "@lapismd/repository-ui/jj";
  let { controller, copyText, reveal }: {
    controller: HistoryController;
    copyText(text: string): Promise<void>;
    reveal(path: string): Promise<void>;
  } = $props();
  let snapshot = $state(controller.state);
  onMount(() => controller.subscribe(value => snapshot = value));
  const items = createRepositoryDiffMenu({ copyText, reveal: context => reveal(context.path) });
</script>
<RepositoryDiffViewer comparisonKey={[snapshot.operation, snapshot.base, snapshot.revision?.id].join(":")}
  from={snapshot.base ?? ""} to={snapshot.revision?.id ?? ""} operation={snapshot.operation}
  files={snapshot.paths} entries={snapshot.diffs} selectedPath={snapshot.path}
  selectionRequest={snapshot.pathRequest} fileMode="all" viewMode="split" pageSize={20}
  hasMore={!!snapshot.nextPath} limitReached={snapshot.pathsLimitReached}
  onLoad={path => controller.loadDiff(path)} onMore={() => controller.morePaths()}
  getDiffMenuItems={() => items} />`;
export const Styling = `<script lang="ts">
  import { RepositoryDiffViewer, type HistoryController } from "@lapismd/repository-ui/jj";
  let { controller }: { controller: HistoryController } = $props();
</script>
<div style="--ui-repository-diff-viewer-padding:0.5rem">
  <RepositoryDiffViewer comparisonKey="retained-comparison" from="previous" to="current"
    files={[]} entries={{}} fileMode="all" onLoad={path => controller.loadDiff(path)}
    onMore={() => controller.morePaths()} />
</div>`;
