<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import FolderSearch from "@lucide/svelte/icons/folder-search";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  let {
    title = "No changed files",
    description = "No files changed in this source.",
    unavailable = false,
    onRetry,
  }: {
    title?: string;
    description?: string;
    unavailable?: boolean;
    onRetry?: () => void;
  } = $props();
</script>

<Empty.Root role="status" style="--text-lg:0.875rem;--text-sm:0.8125rem">
  <Empty.Header
    ><Empty.Media variant="icon"
      >{#if unavailable}<TriangleAlert aria-hidden="true" />{:else}<FolderSearch
          aria-hidden="true"
        />{/if}</Empty.Media
    ><Empty.Title>{title}</Empty.Title><Empty.Description
      >{description}</Empty.Description
    ></Empty.Header
  >
  {#if onRetry}<Empty.Content
      ><Button variant="outline" size="sm" onclick={onRetry}>Retry</Button
      ></Empty.Content
    >{/if}
</Empty.Root>
