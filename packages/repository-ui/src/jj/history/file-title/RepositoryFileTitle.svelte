<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import { FileTypeIcon } from "@lapismd/design-core/shadcn/file-type-icon";
  let { path }: { path?: string } = $props();
</script>

<span class="repository-review-file-title">
  {#if path}<FileTypeIcon {path} size="s" />{/if}
  <span title={path}>{path ?? "Diff"}</span>
</span>

<style>
  .repository-review-file-title {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    min-width: 0;
  }
  .repository-review-file-title > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
