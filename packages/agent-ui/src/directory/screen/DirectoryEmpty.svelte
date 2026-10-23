<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Bot } from "@lucide/svelte";
  let {
    title,
    description,
    retry,
  }: { title: string; description: string; retry?(): void } = $props();
</script>

<Empty.Root
  ><Empty.Header
    ><Empty.Media variant="icon"><Bot aria-hidden="true" /></Empty.Media
    ><Empty.Title>{title}</Empty.Title><Empty.Description
      >{description}</Empty.Description
    ></Empty.Header
  >
  {#if retry}<Empty.Content
      ><Button variant="outline" onclick={retry}>Retry</Button></Empty.Content
    >{/if}
</Empty.Root>
