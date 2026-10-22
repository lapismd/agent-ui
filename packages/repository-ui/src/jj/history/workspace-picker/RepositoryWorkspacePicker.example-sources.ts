export const Basic =
  '<script lang="ts">\n  import { RepositoryWorkspacePicker } from "@lapismd/repository-ui/jj";\n  let workspace = $state<string|null>(null);\n</script>\n<RepositoryWorkspacePicker workspaces={[]} selected={workspace} onSelect={(next) => { workspace = next; }} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryWorkspacePicker } from "@lapismd/repository-ui/jj";\n  let workspace = $state<string|null>(null);\n</script>\n<div style="--ui-repository-workspace-picker-font-size:1rem">\n  <RepositoryWorkspacePicker workspaces={[]} selected={workspace} onSelect={(next) => { workspace = next; }} />\n</div>';
