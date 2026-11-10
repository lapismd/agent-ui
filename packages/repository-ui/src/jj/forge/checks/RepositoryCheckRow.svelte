<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeCheckRow. -->
<script lang="ts">
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import CircleHelp from "@lucide/svelte/icons/circle-help";
  import Clock from "@lucide/svelte/icons/clock";
  import type { RepositoryCheck } from "./model.js";
  let { check }: { check: RepositoryCheck } = $props();
</script>

<li class="repository-check-row" data-state={check.state}>
  {#if check.state === "passed"}<CircleCheck
      aria-hidden="true"
    />{:else if check.state === "failed"}<CircleX
      aria-hidden="true"
    />{:else if check.state === "unknown"}<CircleHelp
      aria-hidden="true"
    />{:else}<Clock aria-hidden="true" />{/if}
  <span
    >{check.name}<small
      >{check.state}{check.description ? ` · ${check.description}` : ""}</small
    ></span
  >
</li>
