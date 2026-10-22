<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import "../../styles/repository-column-chrome.css";
  import "../../styles/repository-review-identifiers.css";
  import "../../styles/repository-picker-options.css";
  import { onDestroy, type Snippet } from "svelte";
  import { AppShell, AppShellController } from "@lapismd/design-core/shell";
  let { children, surface }: { children: Snippet; surface?: Snippet } =
    $props();
  const shell = new AppShellController();
  onDestroy(() => void shell.dispose());
</script>

<div class="repository-shell">
  <AppShell.Root
    controller={shell}
    displayMode="desktop"
    desktopMinMainWidth={0}
  >
    <AppShell.Main>
      <AppShell.Body layout="regions" element="div">
        <div class="repository-body-frame">{@render children()}</div>
      </AppShell.Body>
    </AppShell.Main>
    {@render surface?.()}
  </AppShell.Root>
</div>

<style>
  .repository-shell {
    height: var(--ui-repository-shell-height, 100%);
    min-width: 0;
    min-height: 0;
    --ui-shell-height: 100%;
  }
  .repository-body-frame {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow: hidden;
  }
</style>
