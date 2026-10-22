<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import FileQuestionIcon from "@lucide/svelte/icons/file-question-mark";
  let { title, description }: { title: string; description: string } = $props();
</script>

<Empty.Root role="status">
  <Empty.Header>
    <Empty.Media variant="icon"
      ><FileQuestionIcon aria-hidden="true" /></Empty.Media
    >
    <Empty.Title>{title}</Empty.Title>
    <Empty.Description>{description}</Empty.Description>
  </Empty.Header>
</Empty.Root>
