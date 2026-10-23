<!-- JJ Store CommunityInbox regions, with host-owned conversation and repository callbacks. -->
<script lang="ts">
  import { tick, type Snippet } from "svelte";
  import {
    AppShell,
    type AppShellController,
  } from "@lapismd/design-core/shell";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { ResponsiveTabs } from "@lapismd/design-core/shadcn/responsive-tabs";
  import { PanelToggleIcon } from "@lapismd/design-core/shadcn/panel-toggle";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { MessagesSquare, Plus, Search, X } from "@lucide/svelte";
  import ThreadList from "./ThreadList.svelte";
  import { createInboxResize } from "./resize.svelte.js";
  import type { ThreadsController } from "../logic/controller.js";
  import type {
    ThreadsState,
    ThreadIdentity,
    ThreadHome,
  } from "../logic/types.js";
  let {
    controller,
    view,
    selected,
    onSelect,
    onCreate,
    onRepository,
    conversation,
    shell,
  }: {
    controller: ThreadsController;
    view: ThreadsState;
    selected?: ThreadIdentity;
    onSelect(value: ThreadIdentity): void;
    onCreate?: () => void;
    onRepository?(home: ThreadHome): void;
    conversation?: Snippet<[ThreadIdentity, Snippet]>;
    shell: AppShellController;
  } = $props();
  let body = $state<HTMLElement | null>(null),
    list = $state<HTMLElement | null>(null),
    listOpen = $state(true);
  let query = $state(""),
    search = $state(false),
    filter = $state("all");
  const resize = createInboxResize(
    () => body,
    () => list,
  );
  const mobile = $derived(shell.mobile.resolvedMode === "mobile");
  const expanded = $derived(mobile ? shell.mobile.stage === "left" : listOpen);
  let searchInput = $state<HTMLInputElement | null>(null);
  $effect(() => {
    if (search) void tick().then(() => searchInput?.focus());
  });
  $effect(() => {
    if (mobile && !selected) shell.mobile.show("left", "thread-conversations");
  });
  function select(value: ThreadIdentity) {
    onSelect(value);
    if (mobile) shell.mobile.showMain();
  }
</script>

<AppShell.Body
  bind:ref={body}
  layout="regions"
  label="Threads inbox"
  class="threads-inbox"
>
  <AppShell.Body.Sidebar
    bind:ref={list}
    side="left"
    panelId="thread-conversations"
    label="Thread conversations"
    mobileLabel="Threads"
    class="threads-inbox__list-region"
    bind:open={listOpen}
    style={resize.width === undefined
      ? undefined
      : `--ui-shell-body-sidebar-width:${resize.width}px`}
  >
    <div class="threads-inbox__list">
      <AppShell.Toolbar label="Threads navigation">
        {#if search}<Input
            bind:ref={searchInput}
            aria-label="Search loaded threads"
            bind:value={query}
          /><Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close thread search"
            onclick={() => {
              search = false;
              query = "";
            }}><X aria-hidden="true" /></Button
          >
        {:else}<ResponsiveTabs
            value={filter}
            onValueChange={(value) => (filter = value)}
            label="Thread views"
            items={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ]}
          >
            {#snippet leading()}<Button
                variant="ghost"
                size="icon-sm"
                aria-label="Search threads"
                onclick={() => (search = true)}
                ><Search aria-hidden="true" /></Button
              >{/snippet}
            {#snippet trailing()}<Button
                variant="ghost"
                size="icon-sm"
                aria-label="New Thread"
                disabled={!onCreate}
                onclick={() => onCreate?.()}><Plus aria-hidden="true" /></Button
              >{/snippet}
          </ResponsiveTabs>{/if}
      </AppShell.Toolbar>
      <div class="threads-inbox__items">
        <ThreadList
          {view}
          {selected}
          {query}
          {filter}
          onSelect={select}
          onRetry={(home) => {
            if (home) void controller.read(home);
            else void controller.open();
          }}
          onMore={(home) => {
            if (home) void controller.read(home, true);
            else void controller.moreHomes();
          }}
          {onRepository}
        />
      </div>
    </div>
  </AppShell.Body.Sidebar>
  {#if listOpen && !mobile}<button
      type="button"
      class="threads-inbox__resize-handle"
      data-resizing={resize.resizing ? "" : undefined}
      aria-label="Resize thread conversations"
      title="Drag to resize. Double-click to reset width."
      onpointerdown={resize.begin}
      onpointermove={resize.move}
      onpointerup={resize.finish}
      onpointercancel={resize.finish}
      ondblclick={resize.reset}
      onkeydown={resize.key}><span aria-hidden="true"></span></button
    >{/if}
  <AppShell.Body.Content
    label="Selected thread"
    class="threads-inbox__thread-region"
  >
    <div class="threads-inbox__thread">
      {#snippet navigation()}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle thread conversations"
          aria-pressed={expanded}
          onclick={() => {
            if (mobile) {
              if (expanded) shell.mobile.showMain();
              else
                shell.mobile.show(
                  "left",
                  "thread-conversations",
                  document.activeElement as HTMLElement,
                );
            } else listOpen = !listOpen;
          }}><PanelToggleIcon side="left" {expanded} /></Button
        >{/snippet}
      {#if selected && conversation}{@render conversation(selected, navigation)}
      {:else}<AppShell.Toolbar label="Thread navigation"
          >{@render navigation()}<strong>Threads</strong></AppShell.Toolbar
        ><Empty.Root class="threads-inbox__selection-empty" role="status"
          ><Empty.Header
            ><Empty.Media variant="icon"
              ><MessagesSquare aria-hidden="true" /></Empty.Media
            ><Empty.Title>Select a thread</Empty.Title><Empty.Description
              >Choose a Thread on the left, or create one.</Empty.Description
            ></Empty.Header
          ><Empty.Content
            ><Button disabled={!onCreate} onclick={() => onCreate?.()}
              >Create Thread</Button
            ></Empty.Content
          ></Empty.Root
        >{/if}
    </div>
  </AppShell.Body.Content>
</AppShell.Body>
