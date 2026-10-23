<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import FolderKanban from "@lucide/svelte/icons/folder-kanban";
  let {
    title,
    description,
    retry,
  }: { title: string; description: string; retry?: () => void } = $props();
</script>

<Empty.Root
  ><Empty.Header
    ><Empty.Media variant="icon"><FolderKanban /></Empty.Media><Empty.Title
      >{title}</Empty.Title
    ><Empty.Description>{description}</Empty.Description></Empty.Header
  >{#if retry}<Empty.Content
      ><Button variant="outline" onclick={retry}>Retry</Button></Empty.Content
    >{/if}</Empty.Root
>
