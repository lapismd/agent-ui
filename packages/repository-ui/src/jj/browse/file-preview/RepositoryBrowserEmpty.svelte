<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import FileQuestionIcon from "@lucide/svelte/icons/file-question-mark";
  import FolderOpenIcon from "@lucide/svelte/icons/folder-open";
  let {
    title,
    description,
    folder = false,
    onRetry,
  }: {
    title: string;
    description: string;
    folder?: boolean;
    onRetry?: () => void;
  } = $props();
</script>

<Empty.Root
  role="status"
  style="--text-lg:var(--ui-repository-browser-status-title-size,0.875rem);--text-sm:var(--ui-repository-browser-status-description-size,0.8125rem)"
>
  <Empty.Header>
    <Empty.Media variant="icon"
      >{#if folder}<FolderOpenIcon aria-hidden="true" />{:else}<FileQuestionIcon
          aria-hidden="true"
        />{/if}</Empty.Media
    >
    <Empty.Title>{title}</Empty.Title><Empty.Description
      >{description}</Empty.Description
    >
  </Empty.Header>
  {#if onRetry}<Empty.Content
      ><Button variant="outline" size="sm" onclick={onRetry}
        >Retry preview</Button
      ></Empty.Content
    >{/if}
</Empty.Root>
