export const Basic =
  '<script lang="ts">\n  import { RepositorySourcePicker } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositorySourcePicker> = $props();\n</script>\n<RepositorySourcePicker {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositorySourcePicker } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositorySourcePicker> = $props();\n</script>\n<div style="--ui-repository-source-picker-gap:1rem">\n  <RepositorySourcePicker {...props} />\n</div>';
