export const Basic =
  '<script lang="ts">\n  import { RepositoryPageFrame } from "@lapismd/repository-ui/jj";\n  let value = $state("projects");\n</script>\n<RepositoryPageFrame title="Projects" context="projects" {value} onSelect={(next) => value = next}>\n  <p>Selected view: {value}</p>\n</RepositoryPageFrame>';
export const Styling =
  '<script lang="ts">\n  import { RepositoryPageFrame } from "@lapismd/repository-ui/jj";\n  let value = $state("projects");\n</script>\n<div style="--ui-repository-page-background:var(--background)">\n<RepositoryPageFrame title="Projects" context="projects" {value} onSelect={(next) => value = next}>\n  <p>Selected view: {value}</p>\n</RepositoryPageFrame>\n</div>';
