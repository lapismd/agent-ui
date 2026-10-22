export const Basic =
  '<script lang="ts">\n  import { RepositoryFileHistory } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryFileHistory> = $props();\n</script>\n<RepositoryFileHistory {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryFileHistory } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryFileHistory> = $props();\n</script>\n<div style="--ui-repository-file-history-font-size:1rem">\n  <RepositoryFileHistory {...props} />\n</div>';
