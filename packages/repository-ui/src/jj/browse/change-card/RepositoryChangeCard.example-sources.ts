export const Basic =
  '<script lang="ts">\n  import { RepositoryChangeCard, type RepositoryBrowserCommit } from "@lapismd/repository-ui/jj";\n  let {commit, copyText}: {commit:RepositoryBrowserCommit;copyText(value:string):Promise<void>} = $props();\n</script>\n<RepositoryChangeCard {commit} now={Date.now()/1000} {copyText} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryChangeCard, type RepositoryBrowserCommit } from "@lapismd/repository-ui/jj";\n  let {commit, copyText}: {commit:RepositoryBrowserCommit;copyText(value:string):Promise<void>} = $props();\n</script>\n<div style="--ui-repository-change-card-description-lines:3"><RepositoryChangeCard {commit} now={Date.now()/1000} {copyText} /></div>';
