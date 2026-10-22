export const Basic =
  '<script lang="ts">\n  import { RepositoryCommitPicker } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryCommitPicker> = $props();\n</script>\n<RepositoryCommitPicker {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryCommitPicker } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryCommitPicker> = $props();\n</script>\n<div style="--ui-repository-commit-picker-gap:1rem">\n  <RepositoryCommitPicker {...props} />\n</div>';
