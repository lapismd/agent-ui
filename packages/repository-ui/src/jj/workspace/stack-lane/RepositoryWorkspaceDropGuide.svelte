<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackDropGuide. -->
<script lang="ts">
  import "./workspace-drag.css";
  import Check from "@lucide/svelte/icons/check";
  import Ban from "@lucide/svelte/icons/ban";
  import type { WorkspaceDropFeedback } from "../../../stacks/drag.js";
  let { feedback }: { feedback: WorkspaceDropFeedback | null } = $props();
</script>

{#if feedback}<span
    class="workspace-drop-guide"
    role="status"
    aria-label="Drop guide"
  >
    {#if feedback.state === "valid"}<Check
        size={14}
        aria-hidden="true"
      />{:else}<Ban size={14} aria-hidden="true" />{/if}
    {feedback.message}
  </span>{/if}
