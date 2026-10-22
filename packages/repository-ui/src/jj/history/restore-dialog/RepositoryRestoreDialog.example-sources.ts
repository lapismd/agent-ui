export const Basic =
  '<script lang="ts">\n  import { RepositoryRestoreDialog } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryRestoreDialog> = $props();\n</script>\n<RepositoryRestoreDialog {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryRestoreDialog } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryRestoreDialog> = $props();\n</script>\n<div style="--ui-repository-restore-dialog-gap:1rem">\n  <RepositoryRestoreDialog {...props} />\n</div>';
