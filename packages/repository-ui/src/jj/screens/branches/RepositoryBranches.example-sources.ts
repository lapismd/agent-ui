export const Basic =
  '<script lang="ts">\n  import { RepositoryBranches, type RepositoryBranchesController } from "@lapismd/repository-ui/jj";\n  let { controller, copyText }: { controller: RepositoryBranchesController; copyText(value:string):Promise<void> } = $props();\n</script>\n<RepositoryBranches {controller} {copyText} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryBranches, type RepositoryBranchesController } from "@lapismd/repository-ui/jj";\n  let { controller, copyText }: { controller: RepositoryBranchesController; copyText(value:string):Promise<void> } = $props();\n</script>\n<div style="height:40rem;--ui-repository-branches-height:100%"><RepositoryBranches {controller} {copyText} /></div>';
