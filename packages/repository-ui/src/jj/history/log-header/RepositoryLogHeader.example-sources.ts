export const Basic =
  '<script lang="ts">\n  import { RepositoryLogHeader } from "@lapismd/repository-ui/jj";\n  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";\n  import { onDestroy } from "svelte";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryLogHeader> = $props();\n  const canvas=ColumnCanvas.createColumnCanvasController<string>({columns:{revisions:{defaultWidth:480,minWidth:360},diff:{defaultWidth:560,minWidth:360,pathLevel:1}}});\n  onDestroy(()=>{void canvas.dispose();});\n</script>\n<ColumnCanvas.Root controller={canvas}><ColumnCanvas.Column id="revisions" columnTitle="JJ Log"><RepositoryLogHeader {...props} /></ColumnCanvas.Column></ColumnCanvas.Root>';
export const Styling =
  '<script lang="ts">\n  import { RepositoryLogHeader } from "@lapismd/repository-ui/jj";\n  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";\n  import { onDestroy } from "svelte";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryLogHeader> = $props();\n  const canvas=ColumnCanvas.createColumnCanvasController<string>({columns:{revisions:{defaultWidth:480,minWidth:360},diff:{defaultWidth:560,minWidth:360,pathLevel:1}}});\n  onDestroy(()=>{void canvas.dispose();});\n</script>\n<div style="--ui-repository-log-header-gap:1rem">\n  <ColumnCanvas.Root controller={canvas}><ColumnCanvas.Column id="revisions" columnTitle="JJ Log"><RepositoryLogHeader {...props} /></ColumnCanvas.Column></ColumnCanvas.Root>\n</div>';

export const HostActions = `<script lang="ts">
  import { RepositoryLogHeader } from "@lapismd/repository-ui/jj";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  let { openRepository }: {openRepository():void} = $props();
  const canvas = ColumnCanvas.createColumnCanvasController({columns:{revisions:{defaultWidth:600,minWidth:280}}});
  import { onDestroy } from "svelte";
  onDestroy(() => { void canvas.dispose(); });
</script>
{#snippet actions()}<Button onclick={openRepository}>Open repository</Button>{/snippet}
<ColumnCanvas.Root controller={canvas}><ColumnCanvas.Column id="revisions" columnTitle="JJ Log">
  <RepositoryLogHeader title="JJ Log" count={0} operations={[]} operation={undefined} busy={false}
    workspaces={[]} workspace={null} onWorkspaceSelect={() => {}} onSelect={() => {}}
    onRefresh={() => {}} copyText={async () => {}} {actions} />
</ColumnCanvas.Column></ColumnCanvas.Root>`;
