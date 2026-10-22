export const Basic =
  '<script lang="ts">\n  import { RepositoryFileHistory, RepositoryShell } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryFileHistory> = $props();\n</script>\n<RepositoryShell><RepositoryFileHistory {...props} /></RepositoryShell>';
export const Styling =
  '<script lang="ts">\n  import { RepositoryFileHistory, RepositoryShell } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryFileHistory> = $props();\n</script>\n<div style="--ui-repository-file-history-font-size:1rem">\n  <RepositoryShell><RepositoryFileHistory {...props} /></RepositoryShell>\n</div>';
