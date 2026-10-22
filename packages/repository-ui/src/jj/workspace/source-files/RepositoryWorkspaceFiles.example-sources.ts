export const Basic =
  '<script lang="ts">\n  import { RepositoryWorkspaceFiles } from "@lapismd/repository-ui/jj";\n  import type { StackWorkspaceController } from "@lapismd/repository-ui/stacks";\n  let { controller, source }: { controller: StackWorkspaceController; source: string } = $props();\n</script>\n<RepositoryWorkspaceFiles {controller} {source} onSelect={path => controller.selectFile(source, path)} />';
export const Styling =
  '<div style="--ui-repository-workspace-files-background:var(--background)">\n  <!-- Compose RepositoryWorkspaceFiles here using the public example above. -->\n</div>';
