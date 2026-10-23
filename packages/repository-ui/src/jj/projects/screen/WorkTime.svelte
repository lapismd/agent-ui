<script lang="ts">
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  let { timestamp }: { timestamp: number } = $props();
</script>

<span class="community-relative-time">
  <RelativeTime timestamp={timestamp * 1000} />
</span>

<style>
  .community-relative-time {
    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    align-items: baseline;
    justify-self: start;
    vertical-align: baseline;
  }
</style>
