<!-- SPDX-License-Identifier: Apache-2.0; adapted from jj-store's stack workspace spacer. -->
<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import MoveHorizontalIcon from "@lucide/svelte/icons/move-horizontal";
</script>

<Empty.Root style="height:100%">
  <Empty.Header>
    <Empty.Media variant="icon"
      ><MoveHorizontalIcon aria-hidden="true" /></Empty.Media
    >
    <Empty.Title>Resize columns</Empty.Title>
    <Empty.Description
      >Drag the edge of the Diff column to adjust its width.</Empty.Description
    >
  </Empty.Header>
</Empty.Root>
