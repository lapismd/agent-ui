export const Basic =
  '<script lang="ts">\n  import { RepositoryDiff } from "@lapismd/repository-ui/jj";\n  import type { LocalFileDiffChange } from "@lapismd/jj-history";\n  let {change}:{change:LocalFileDiffChange}=$props();\n</script>\n<RepositoryDiff change={change} viewMode="split" wrap />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryDiff } from "@lapismd/repository-ui/jj";\n  import type { LocalFileDiffChange } from "@lapismd/jj-history";\n  let {change}:{change:LocalFileDiffChange}=$props();\n</script>\n<div style="--ui-repository-diff-min-height:20rem">\n  <RepositoryDiff change={change} viewMode="split" wrap />\n</div>';
