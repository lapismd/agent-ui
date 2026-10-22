export const Basic =
  '<script lang="ts">\n  import { RepositoryPanel, HistoryController, type HistoryReader } from "@lapismd/repository-ui/jj";\n  import { untrack, onDestroy } from "svelte";\n  let { reader, report }: {reader:HistoryReader; report(error:unknown):void}=$props();\n  const controller=untrack(()=>new HistoryController(reader, {report, recovered(){}}));\n  onDestroy(()=>{void controller.close();});\n</script>\n<RepositoryPanel {controller} copyText={(value) => navigator.clipboard.writeText(value)} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryPanel, HistoryController, type HistoryReader } from "@lapismd/repository-ui/jj";\n  import { untrack, onDestroy } from "svelte";\n  let { reader, report }: {reader:HistoryReader; report(error:unknown):void}=$props();\n  const controller=untrack(()=>new HistoryController(reader, {report, recovered(){}}));\n  onDestroy(()=>{void controller.close();});\n</script>\n<div style="--ui-repository-panel-font-size:1rem">\n  <RepositoryPanel {controller} copyText={(value) => navigator.clipboard.writeText(value)} />\n</div>';

export const HostActions = `<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { RepositoryPanel, HistoryController, type HistoryReader, type HistoryState } from "@lapismd/repository-ui/jj";
  import { Button } from "@lapismd/design-core/shadcn/button";
  let { reader, report, openRepository, reviewCommit, openFile }: {
    reader: HistoryReader; report(error:unknown):void;
    openRepository(operation?:string):void; reviewCommit(commit:string):void; openFile(path?:string):void;
  } = $props();
  const controller = untrack(() => new HistoryController(reader, {report, recovered(){}}, undefined,
    {userEmail:"dev@lapis.md", pageSize:12, maxCommits:200}));
  onDestroy(() => { void controller.close(); });
</script>
{#snippet headerActions(state:HistoryState)}<Button onclick={() => openRepository(state.operation)}>Repository</Button>{/snippet}
{#snippet revisionActions(commit:import("@lapismd/jj-history").LocalGraphCommit)}<Button onclick={() => reviewCommit(commit.id)}>Review</Button>{/snippet}
{#snippet diffActions(state:{path?:string})}<Button onclick={() => openFile(state.path)}>Open file</Button>{/snippet}
<RepositoryPanel {controller} searchable {headerActions} {revisionActions} {diffActions}
  copyText={(value) => navigator.clipboard.writeText(value)} />`;
export const Bounded = HostActions.replace("maxCommits:200", "maxCommits:6");
