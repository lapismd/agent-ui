export const Basic =
  '<script lang="ts">\n  import { RepositoryGraph } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryGraph> = $props();\n</script>\n<RepositoryGraph {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryGraph } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryGraph> = $props();\n</script>\n<div style="--ui-repository-graph-font-size:1rem">\n  <RepositoryGraph {...props} />\n</div>';
