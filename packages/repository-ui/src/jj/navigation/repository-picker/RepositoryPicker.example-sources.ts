export const Basic =
  '<script lang="ts">\n  import { RepositoryPicker } from "@lapismd/repository-ui/jj";\n  let value = $state("lapis");\n</script>\n<RepositoryPicker repositories={[{id:"lapis",name:"Lapis",description:"Local checkout"}]} {value} controlled onChange={(next) => value = next} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryPicker } from "@lapismd/repository-ui/jj";\n  let value = $state("lapis");\n</script>\n<div style="--ui-repository-picker-width:min(26rem, calc(100vw - 2rem))">\n<RepositoryPicker repositories={[{id:"lapis",name:"Lapis",description:"Local checkout"}]} {value} controlled onChange={(next) => value = next} />\n</div>';
