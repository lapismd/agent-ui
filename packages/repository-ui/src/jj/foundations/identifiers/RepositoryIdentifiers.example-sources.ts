export const Basic =
  '<script lang="ts">\n  import { RepositoryIdentifiers } from "@lapismd/repository-ui/jj";\n  \n</script>\n<RepositoryIdentifiers commitId={"11".repeat(20)} changeId="zzzzzzzzzzzzzzzz" placement="inline" copyText={(text) => navigator.clipboard.writeText(text)} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryIdentifiers } from "@lapismd/repository-ui/jj";\n  \n</script>\n<div style="--ui-repository-identifiers-font-size:1rem">\n  <RepositoryIdentifiers commitId={"11".repeat(20)} changeId="zzzzzzzzzzzzzzzz" placement="inline" copyText={(text) => navigator.clipboard.writeText(text)} />\n</div>';
