<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreAgentSessions/StoreAgentSessionRow. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import { Avatar } from "@lapismd/design-core/shadcn/avatar";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import { ArrowLeft, MessagesSquare, Wrench, RefreshCw } from "@lucide/svelte";
  import DirectoryEmpty from "./DirectoryEmpty.svelte";
  import type { AgentDirectoryController } from "../logic/controller.js";
  import type {
    AgentDirectoryState,
    DirectorySession,
    DirectoryCapture,
  } from "../logic/types.js";
  import "./sessions.css";
  let {
    controller,
    view,
    onBack,
    onOpenSession,
    onOpenCapture,
    content,
  }: {
    controller: AgentDirectoryController;
    view: AgentDirectoryState;
    onBack(): void;
    onOpenSession?(session: DirectorySession): void;
    onOpenCapture?(capture: DirectoryCapture): void;
    content?: Snippet;
  } = $props();
  let query = $state("");
  const matches = (row: DirectorySession | DirectoryCapture) =>
    [row.title, row.agentName, row.home]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase().trim());
  const sessions = $derived(view.page?.sessions.filter(matches) ?? []);
  const captures = $derived(view.page?.captures.filter(matches) ?? []);
</script>

<section aria-label="Agent sessions">
  <AppShell.Toolbar label="Agent sessions header"
    ><Button
      variant="ghost"
      size="icon-sm"
      aria-label="Back to agents"
      onclick={onBack}><ArrowLeft aria-hidden="true" /></Button
    ><strong>Agent sessions</strong><Button
      variant="ghost"
      size="icon-sm"
      aria-label="Refresh sessions"
      disabled={view.loading}
      onclick={() => void controller.open()}
      ><RefreshCw aria-hidden="true" /></Button
    ></AppShell.Toolbar
  >
  {#if content}{@render content()}{:else}<div class="session-directory">
      <Input
        type="search"
        aria-label="Search loaded sessions"
        placeholder="Search captured conversations"
        bind:value={query}
      />
      {#if view.loading}<div role="status" aria-label="Loading agent sessions">
          <Skeleton style="height:4rem;width:100%" />
        </div>{/if}
      {#each view.page?.unavailable ?? [] as home (home.home)}<DirectoryEmpty
          title={`${home.name} unavailable`}
          description={home.reason}
          retry={() => void controller.open()}
        />{/each}
      {#if view.error}<DirectoryEmpty
          title="Sessions unavailable"
          description="The session directory could not be refreshed."
          retry={() => void controller.open()}
        />{/if}
      {#if sessions.length}<section aria-label="Running sessions">
          <h2>Running sessions</h2>
          <div role="list" aria-label="Running agent sessions">
            {#each sessions as session (`${session.home}:${session.id}`)}
              <div
                role="listitem"
                class="store-collaboration__row"
                data-kind="agent"
                data-collection
              >
                <button
                  type="button"
                  class="store-collaboration__row-select"
                  aria-label={`Open ${session.title} in ${session.home}`}
                  disabled={!onOpenSession}
                  onclick={() => onOpenSession?.($state.snapshot(session))}
                ></button><span class="store-collaboration__row-leading"
                  ><Avatar
                    name={session.agentName}
                    size="sm"
                    decorative
                  /></span
                ><span class="store-collaboration__row-main"
                  ><span class="store-collaboration__row-title-row"
                    ><span class="store-collaboration__row-title"
                      >{session.title}</span
                    ><span class="store-collaboration__row-actions"
                      >{#if view.page?.capabilities.includes("stop-session")}<Button
                          variant="ghost"
                          size="sm"
                          disabled={view.writing || !!view.pending.length}
                          onclick={() =>
                            void controller.submit({
                              kind: "stop-session",
                              home: session.home,
                              session: session.id,
                            })}>Stop</Button
                        >{/if}</span
                    ></span
                  ><span class="store-collaboration__row-meta"
                    >{session.agentName} · {session.home}<Badge
                      variant="secondary">{session.state}</Badge
                    ></span
                  ></span
                >
              </div>
            {/each}
          </div>
        </section>{/if}
      {#if captures.length}<section aria-label="Saved captures">
          <h2>Captured conversations</h2>
          <div role="list" aria-label="Captured agent sessions">
            {#each captures as capture (`${capture.home}:${capture.id}`)}
              <div
                role="listitem"
                class="store-collaboration__row"
                data-kind="agent"
                data-collection
              >
                <button
                  type="button"
                  class="store-collaboration__row-select"
                  aria-label={`Open captured ${capture.title} in ${capture.home}`}
                  disabled={!onOpenCapture}
                  onclick={() => onOpenCapture?.($state.snapshot(capture))}
                ></button><span class="store-collaboration__row-leading"
                  ><Avatar
                    name={capture.agentName}
                    size="sm"
                    decorative
                  /></span
                ><span class="store-collaboration__row-main"
                  ><span class="store-collaboration__row-title"
                    >{capture.title}</span
                  ><span class="store-collaboration__row-meta"
                    >{capture.agentName} · {capture.home}<span
                      class="store-collaboration__agent-metrics"
                      ><span
                        class="store-collaboration__metric"
                        aria-label={`${capture.transcripts} transcripts`}
                        ><MessagesSquare
                          aria-hidden="true"
                        />{capture.transcripts}</span
                      ><span
                        class="store-collaboration__metric"
                        aria-label={`${capture.tools} tools`}
                        ><Wrench aria-hidden="true" />{capture.tools}</span
                      ></span
                    ></span
                  ></span
                >
              </div>
            {/each}
          </div>
        </section>{/if}
      {#if !sessions.length && !captures.length && !view.loading && !view.error}<DirectoryEmpty
          title={query ? "No matching sessions" : "No agent sessions"}
          description="Captured Codex, Cursor, and OpenCode sessions will appear here."
        />{/if}
      {#if view.page?.next}<Button
          variant="outline"
          disabled={view.loading}
          onclick={() => void controller.more()}>Load more sessions</Button
        >{/if}
    </div>{/if}
</section>

<style>
  .session-directory {
    padding: 1rem;
    display: grid;
    align-content: start;
    gap: 1rem;
    min-width: 0;
  }
  .session-directory h2 {
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }
</style>
