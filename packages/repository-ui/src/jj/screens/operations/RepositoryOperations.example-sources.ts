export const Basic =
  '<script lang="ts">\n  import { RepositoryOperations, OperationController, type HistoryReader } from "@lapismd/repository-ui/jj";\n  import { untrack, onDestroy } from "svelte";\n  let { reader, report }: {reader:HistoryReader; report(error:unknown):void}=$props();\n  const controller=untrack(()=>new OperationController(reader, {report, recovered(){}}));\n  onDestroy(()=>{void controller.close();});\n</script>\n<RepositoryOperations {controller} copyText={(value) => navigator.clipboard.writeText(value)} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryOperations, OperationController, type HistoryReader } from "@lapismd/repository-ui/jj";\n  import { untrack, onDestroy } from "svelte";\n  let { reader, report }: {reader:HistoryReader; report(error:unknown):void}=$props();\n  const controller=untrack(()=>new OperationController(reader, {report, recovered(){}}));\n  onDestroy(()=>{void controller.close();});\n</script>\n<div style="--ui-repository-operations-font-size:1rem">\n  <RepositoryOperations {controller} copyText={(value) => navigator.clipboard.writeText(value)} />\n</div>';
export const HostActions = `<script lang="ts">
  import { RepositoryOperations, OperationController, type HistoryReader, type OperationState } from "@lapismd/repository-ui/jj";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { untrack, onDestroy } from "svelte";
  let { reader, report, review }: { reader: HistoryReader; report(error: unknown): void; review(context: OperationState): void } = $props();
  const controller = untrack(() => new OperationController(reader, { report, recovered() {} }, undefined, { pageSize: 12, maxOperations: 200 }));
  onDestroy(() => { void controller.close(); });
</script>
{#snippet operationActions(context: OperationState)}
  <Button onclick={() => review(context)}>Review operation</Button>
{/snippet}
<RepositoryOperations {controller} {operationActions} searchable copyText={(value) => navigator.clipboard.writeText(value)} />`;
export const Bounded = HostActions.replace(
  "maxOperations: 200",
  "maxOperations: 6",
);
export const HostControls = HostActions.replace(
  "{#snippet operationActions",
  "{#snippet headerControls(context: OperationState)}<Button onclick={() => review(context)}>Host source controls</Button>{/snippet}\n{#snippet operationActions",
).replace(
  "{controller} {operationActions} searchable",
  "{controller} {operationActions} {headerControls} searchable",
);
