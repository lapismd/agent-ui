<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  let {
    unavailable = false,
    onRetry,
  }: { unavailable?: boolean; onRetry?(): void } = $props();
</script>

<Empty.Root role="status"
  ><Empty.Header
    ><Empty.Media variant="icon"><GitBranchIcon /></Empty.Media><Empty.Title
      >{unavailable ? "Branches unavailable" : "Choose a branch"}</Empty.Title
    ><Empty.Description
      >{unavailable
        ? "The captured references could not be read. Retry the pinned operation."
        : "Select a bookmark or working copy to inspect its recorded history."}</Empty.Description
    ></Empty.Header
  >{#if unavailable && onRetry}<Empty.Content
      ><Button variant="outline" size="sm" onclick={onRetry}
        >Retry branches</Button
      ></Empty.Content
    >{/if}</Empty.Root
>
