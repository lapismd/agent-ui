<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeChecksRing. -->
<script lang="ts">
  import { repositoryCheckGroups, type RepositoryCheck } from "./model.js";
  let {
    checks,
    unknown = false,
  }: { checks: readonly RepositoryCheck[]; unknown?: boolean } = $props();
  const groups = $derived(repositoryCheckGroups(checks));
  const total = $derived(Math.max(1, checks.length));
</script>

<svg
  viewBox="0 0 36 36"
  width="30"
  height="30"
  class="repository-checks-ring"
  aria-hidden="true"
>
  <circle
    cx="18"
    cy="18"
    r="15.9"
    fill="none"
    stroke="var(--border)"
    stroke-width="3.5"
  />
  {#each groups as group, index}
    <circle
      data-state={unknown ? "unknown" : group.id}
      cx="18"
      cy="18"
      r="15.9"
      fill="none"
      stroke-width="3.5"
      pathLength="100"
      stroke-dasharray={`${Math.max(0, (group.checks.length / total) * 100 - 2)} 100`}
      stroke-dashoffset={-groups
        .slice(0, index)
        .reduce((n, g) => n + (g.checks.length / total) * 100, 0)}
    />
  {/each}
</svg>
