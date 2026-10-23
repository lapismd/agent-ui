<script lang="ts">
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  let { timestamp }: { timestamp: number } = $props();
</script>

<RelativeTime timestamp={timestamp * 1000} />
