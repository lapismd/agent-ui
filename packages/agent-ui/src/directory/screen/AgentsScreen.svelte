<script lang="ts">
  import { onMount, onDestroy, untrack, tick, type Snippet } from "svelte";
  import { AppShell, AppShellController } from "@lapismd/design-core/shell";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { AgentDirectoryController } from "../logic/controller.js";
  import type {
    ConfiguredAgent,
    DirectorySession,
    DirectoryCapture,
  } from "../logic/types.js";
  import AgentGallery from "./AgentGallery.svelte";
  import AgentProfile from "./AgentProfile.svelte";
  import AgentConfigurationDialog from "./AgentConfigurationDialog.svelte";
  import AgentSessionDirectory from "./AgentSessionDirectory.svelte";
  let {
    controller,
    sessions = false,
    onSessions,
    onBack,
    onChat,
    onOpenSession,
    onOpenCapture,
    sessionContent,
    copyText,
    onError,
  }: {
    controller: AgentDirectoryController;
    sessions?: boolean;
    onSessions?(agent?: string): void;
    onBack?(): void;
    onChat?(agent: ConfiguredAgent): void;
    onOpenSession?(session: DirectorySession): void;
    onOpenCapture?(capture: DirectoryCapture): void;
    sessionContent?: Snippet;
    copyText?(text: string): Promise<void>;
    onError(error: unknown): void;
  } = $props();
  let view = $state(untrack(() => controller.state));
  onMount(() => controller.subscribe((value) => (view = value)));
  const shell = new AppShellController({ rightClosed: true, rightWidth: 360 });
  onDestroy(() => void shell.dispose());
  let selected = $state<string>(),
    editor = $state<{ agent?: ConfiguredAgent }>();
  let localSessions = $state(false);
  let opener: HTMLElement | null = null;
  const agent = $derived(view.page?.agents.find((a) => a.id === selected));
  $effect(() => {
    if (agent) shell.right.open();
    else shell.right.close();
  });
  function closeProfile() {
    selected = undefined;
    shell.mobile.showMain();
    void tick().then(() => opener?.focus({ preventScroll: true }));
  }
  function openAgent(value: ConfiguredAgent) {
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    selected = value.id;
    void tick().then(() => {
      if (shell.mobile.resolvedMode === "mobile")
        shell.mobile.show("right", "right", opener);
    });
  }
  function showSessions(id?: string) {
    closeProfile();
    if (onSessions) onSessions(id);
    else {
      localSessions = true;
      void controller.open({ ...view.scope, agent: id });
    }
  }
</script>

<div class="agents-screen">
  <AppShell.Root controller={shell} displayMode="auto" desktopMinMainWidth={0}>
    <AppShell.Main
      ><AppShell.Body layout="regions" element="div"
        ><AppShell.Body.Content label="Agents content">
          {#each view.pending as request (request.id)}<section
              class="agent-recovery"
              aria-label="Pending agent request"
            >
              <p>Saved request {request.id}. Its outcome needs inspection.</p>
              <Button
                variant="outline"
                disabled={view.writing}
                onclick={() => void controller.resolve(request.id)}
                >Check outcome</Button
              >
            </section>{/each}
          {#if sessions || localSessions}<AgentSessionDirectory
              {controller}
              {view}
              {onOpenSession}
              {onOpenCapture}
              content={sessionContent}
              onBack={() => {
                localSessions = false;
                if (onBack) onBack();
                else void controller.open({ home: view.scope.home });
              }}
            />
          {:else}<AgentGallery
              {view}
              onRefresh={() => void controller.open()}
              onMore={() => void controller.more()}
              onAdd={() => (editor = {})}
              onOpen={openAgent}
              onEdit={(agent) => (editor = { agent })}
              onDelete={(agent) =>
                void controller.submit({
                  kind: "delete-agent",
                  agent: agent.id,
                  version: agent.version,
                })}
              onSessions={showSessions}
              onChat={onChat
                ? (agent) => onChat!($state.snapshot(agent))
                : undefined}
            />{/if}
        </AppShell.Body.Content></AppShell.Body
      ></AppShell.Main
    >
    {#if agent && view.page}<AppShell.Sidebar
        side="right"
        variant="attached"
        constraintPriority={0}
        constrainedPresentation="replace-main"
        label="Agent details sidebar"
        mobileLabel="Agent details"
        resizeLabel="Resize agent details sidebar"
        closeable
      >
        <AppShell.Sidebar.Header
          ><strong>Agent details</strong><AppShell.Sidebar.Close
            label="Close agent details"
            onclick={closeProfile}
          /></AppShell.Sidebar.Header
        >
        <AppShell.Sidebar.Body
          ><AgentProfile
            {agent}
            page={view.page}
            busy={view.writing || !!view.pending.length}
            onEdit={() => (editor = { agent })}
            onSessions={() => showSessions(agent.id)}
            onChat={onChat ? () => onChat!($state.snapshot(agent)) : undefined}
            {copyText}
            {onError}
          /></AppShell.Sidebar.Body
        >
      </AppShell.Sidebar>{/if}
  </AppShell.Root>
  {#if editor}<AgentConfigurationDialog
      {controller}
      initial={editor.agent}
      onClose={() => (editor = undefined)}
      {onError}
    />{/if}
</div>

<style>
  .agents-screen {
    height: 100%;
    min-width: 0;
    min-height: 0;
    --ui-shell-height: 100%;
    font-size: var(--ui-agent-directory-font-size, 0.8125rem);
  }
  .agent-recovery {
    padding: 1rem;
  }
</style>
