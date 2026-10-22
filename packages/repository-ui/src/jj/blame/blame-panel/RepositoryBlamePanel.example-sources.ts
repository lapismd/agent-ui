export const Basic =
  '<script lang="ts">\n  import { RepositoryBlamePanel } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryBlamePanel> = $props();\n</script>\n<RepositoryBlamePanel {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryBlamePanel } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryBlamePanel> = $props();\n</script>\n<div style="--ui-repository-blame-panel-font-size:1rem">\n  <RepositoryBlamePanel {...props} />\n</div>';
