<!-- JJ Store CommunityInboxItem, adapted to explicit metadata identities and public primitives. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Avatar } from "@lapismd/design-core/shadcn/avatar";
  import { formatRelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import type { ThreadRow } from "../logic/types.js";
  let {
    item,
    active,
    onSelect,
  }: { item: ThreadRow; active: boolean; onSelect(): void } = $props();
  const time = $derived(
    item.updatedAt === undefined
      ? undefined
      : formatRelativeTime(item.updatedAt),
  );
</script>

<Button
  variant="ghost"
  class="threads-inbox__item"
  data-active={active ? "" : undefined}
  aria-pressed={active}
  data-ui-part="inbox-conversation"
  onclick={onSelect}
>
  <Avatar
    name={item.author.name}
    src={item.author.avatar}
    size="xs"
    shape="rounded"
    decorative
  />
  <span class="threads-inbox__item-body">
    <span class="sr-only">Open Thread </span>
    <span class="threads-inbox__item-heading"
      ><strong title={item.title}>{item.title}</strong></span
    >
    <span class="threads-inbox__item-detail">
      <span class="threads-inbox__context">{item.author.name}</span>
      {#if time}<span class="threads-inbox__time"
          ><time datetime={time.datetime} title={time.full}>{time.text}</time
          ></span
        >{/if}
    </span>
    {#if item.updatedAt === undefined && item.excerpt}<span
        class="threads-inbox__excerpt">{item.excerpt}</span
      >{/if}
  </span>
</Button>
