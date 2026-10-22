export const Basic =
  '<script lang="ts">\n  import { RepositoryOperationPinPicker } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryOperationPinPicker> = $props();\n</script>\n<RepositoryOperationPinPicker {...props} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryOperationPinPicker } from "@lapismd/repository-ui/jj";\n  import type { ComponentProps } from "svelte";\n  let props: ComponentProps<typeof RepositoryOperationPinPicker> = $props();\n</script>\n<div style="--ui-repository-operation-pin-picker-font-size:1rem">\n  <RepositoryOperationPinPicker {...props} />\n</div>';
