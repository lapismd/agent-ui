<script lang="ts">
  import { onMount, onDestroy, untrack, tick, type Snippet } from "svelte";
  import { AppShell, AppShellController } from "@lapismd/design-core/shell";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { ThreadsController } from "../logic/controller.js";
  import type { ThreadIdentity, ThreadHome } from "../logic/types.js";
  import ThreadInbox from "./ThreadInbox.svelte";
  import "./threads.css";
  let {
    controller,
    selected,
    onSelect,
    onCreate,
    onRepository,
    conversation,
    details,
    detailsOpen = $bindable(false),
  }: {
    controller: ThreadsController;
    selected?: ThreadIdentity;
    onSelect(value: ThreadIdentity): void;
    onCreate?: () => void;
    onRepository?(home: ThreadHome): void;
    /** Render the existing complete AgentChatScreen; the host retains its controller. */
    conversation?: Snippet<[ThreadIdentity, Snippet]>;
    details?: Snippet<[{ close(): void }]>;
    detailsOpen?: boolean;
  } = $props();
  let view = $state(untrack(() => controller.state));
  onMount(() => controller.subscribe((value) => (view = value)));
  const shell = new AppShellController({ rightClosed: true, rightWidth: 360 });
  onDestroy(() => void shell.dispose());
  let opener: HTMLElement | null = null;
  $effect(() => {
    const open = detailsOpen && details;
    untrack(() => {
      if (open) {
        opener =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        shell.right.open();
        void tick().then(() => {
          if (shell.mobile.resolvedMode === "mobile")
            shell.mobile.show("right", "right", opener);
        });
      } else shell.right.close();
    });
  });
  function close() {
    detailsOpen = false;
    shell.mobile.showMain(false);
    void tick().then(() => opener?.focus({ preventScroll: true }));
  }
</script>

<div class="threads-screen">
  <AppShell.Root
    controller={shell}
    displayMode="auto"
    mobileBreakpoint={704}
    desktopMinMainWidth={0}
  >
    <AppShell.Main
      ><ThreadInbox
        {controller}
        {view}
        {selected}
        {onSelect}
        {onCreate}
        {onRepository}
        {conversation}
        {shell}
      /></AppShell.Main
    >
    {#if details}<AppShell.Sidebar
        side="right"
        variant="attached"
        label="Thread details"
        mobileLabel="Thread details"
        resizeLabel="Resize thread details"
        constraintPriority={0}
        constrainedPresentation="replace-main"
        closeable
      >
        <AppShell.Sidebar.Header
          ><strong>Thread details</strong><AppShell.Sidebar.Close
            label="Close thread details"
            onclick={close}
          /></AppShell.Sidebar.Header
        >
        <AppShell.Sidebar.Body
          >{#if detailsOpen}{@render details({
              close,
            })}{/if}</AppShell.Sidebar.Body
        >
      </AppShell.Sidebar>{/if}
  </AppShell.Root>
</div>
