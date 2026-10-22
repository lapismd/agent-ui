<script lang="ts">
  import { untrack } from "svelte";
  import { RepositoryReferencePicker } from "../../packages/repository-ui/src/jj/index.js";
  import { browserReferences, browserNow } from "./support/browser-data.js";
  let { variant = "Basic" }: { variant?: string } = $props();
  let value = $state(
    untrack(() => (variant === "Changes" ? "change:aaaa" : "bookmark:main")),
  );
  let loaded = $state(false),
    recovered = $state(false);
  const choices = $derived(
    variant === "Empty" ||
      variant === "Loading" ||
      (variant === "Unavailable" && !recovered)
      ? []
      : variant === "Dense"
        ? [
            ...browserReferences,
            ...Array.from({ length: 150 }, (_, i) => ({
              value: `bookmark:topic-${i}`,
              label: `feature/topic-${String(i).padStart(3, "0")}`,
              kind: "bookmark" as const,
              targets: [String(i).padStart(40, "0")],
            })),
          ]
        : variant === "Paged" && !loaded
          ? browserReferences.slice(0, 2)
          : browserReferences,
  );
</script>

<div class="reference-picker-boundary">
  <RepositoryReferencePicker
    {value}
    now={browserNow}
    copyText={async () => {}}
    {choices}
    disabled={variant === "Disabled"}
    loading={variant === "Loading"}
    unavailable={variant === "Unavailable" && !recovered}
    onRetry={() => (recovered = true)}
    hasMore={variant === "Paged" && !loaded}
    onLoadMore={() => (loaded = true)}
    onSelect={(choice) => (value = choice.value)}
  />
  <output hidden data-testid="reference-value">{value}</output>
</div>

<style>
  .reference-picker-boundary {
    padding: 1.5rem;
    min-height: 26rem;
  }
</style>
