<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeChecks. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import * as Menu from "@lapismd/design-core/shadcn/dropdown-menu";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import RefreshCw from "@lucide/svelte/icons/refresh-cw";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Settings2 from "@lucide/svelte/icons/settings-2";
  import ListFilter from "@lucide/svelte/icons/list-filter";
  import List from "@lucide/svelte/icons/list";
  import CircleHelp from "@lucide/svelte/icons/circle-help";
  import RepositoryChecksRing from "./RepositoryChecksRing.svelte";
  import RepositoryCheckRow from "./RepositoryCheckRow.svelte";
  import {
    repositoryCheckGroups,
    type RepositoryChecksSnapshot,
    type RepositoryCheckState,
  } from "./model.js";
  import "./checks.css";
  let {
    checks,
    currentSha,
    disabled = false,
    onRefresh,
  }: {
    checks?: RepositoryChecksSnapshot;
    currentSha: string;
    disabled?: boolean;
    onRefresh?: () => void;
  } = $props();
  let expanded = $state(true),
    grouped = $state(true);
  let collapsed = $state<Partial<Record<RepositoryCheckState, boolean>>>({});
  const current = $derived(checks?.sha === currentSha);
  const groups = $derived(repositoryCheckGroups(checks?.items ?? []));
  const summary = $derived(
    !checks
      ? "Checks unavailable"
      : !current
        ? "Checks need refresh"
        : !checks.complete
          ? "Checks incomplete"
          : !checks.items.length
            ? "No checks reported"
            : checks.items.some((c) => c.state === "failed")
              ? "Some checks were not successful"
              : checks.items.some(
                    (c) => c.state === "running" || c.state === "queued",
                  )
                ? "Checks are running"
                : checks.items.every((c) => c.state === "passed")
                  ? "All checks have passed"
                  : "Checks need attention",
  );
  const counts = $derived(
    groups
      .map((group) => `${group.checks.length} ${group.label.toLowerCase()}`)
      .join(" · "),
  );
</script>

<section class="repository-checks" aria-label="CI checks">
  <Collapsible.Root bind:open={expanded}>
    <div class="repository-checks__summary">
      <Collapsible.Trigger>
        {#snippet child({ props })}<Button
            {...props}
            variant="ghost"
            class="repository-checks__disclosure"
          >
            <RepositoryChecksRing
              checks={checks?.items ?? []}
              unknown={!current || !checks?.complete}
            />
            <span class="repository-checks__name"
              ><strong>{summary}</strong><small>{counts}</small></span
            >
          </Button>{/snippet}
      </Collapsible.Trigger>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Refresh checks"
        disabled={disabled || !onRefresh}
        onclick={onRefresh}><RefreshCw aria-hidden="true" /></Button
      >
      <Menu.Root>
        <Menu.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-xs"
              aria-label="Check display options"
              ><Settings2 aria-hidden="true" /></Button
            >{/snippet}</Menu.Trigger
        >
        <Menu.Content align="end"
          ><Menu.RadioGroup
            value={grouped ? "status" : "none"}
            onValueChange={(value) => (grouped = value === "status")}
          >
            <Menu.RadioItem value="status"
              ><ListFilter aria-hidden="true" />Group by status</Menu.RadioItem
            >
            <Menu.RadioItem value="none"
              ><List aria-hidden="true" />No grouping</Menu.RadioItem
            >
          </Menu.RadioGroup></Menu.Content
        >
      </Menu.Root>
      <Collapsible.Trigger
        >{#snippet child({ props })}<Button
            {...props}
            variant="ghost"
            size="icon-xs"
            aria-label={expanded ? "Collapse checks" : "Expand checks"}
            ><ChevronDown
              style={expanded ? undefined : "transform:rotate(-90deg)"}
              aria-hidden="true"
            /></Button
          >{/snippet}</Collapsible.Trigger
      >
    </div>
    <Collapsible.Content>
      {#if checks}<p class="repository-checks__revision">
          {current ? "Revision" : "Observed revision"}
          <code>{checks.sha.slice(0, 8)}</code>{checks.complete
            ? ""
            : " · Results incomplete"}
        </p>{/if}
      {#if !checks?.items.length}<Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"
              ><CircleHelp aria-hidden="true" /></Empty.Media
            ><Empty.Title
              >{checks
                ? "No CI checks reported"
                : "CI results unavailable"}</Empty.Title
            ><Empty.Description
              >Refresh checks for the selected revision.</Empty.Description
            ></Empty.Header
          ></Empty.Root
        >
      {:else}
        <ScrollArea
          style="max-height:var(--ui-repository-checks-max-height,24rem)"
          aria-label="Check results"
        >
          {#if grouped}
            {#each groups as group (group.id)}
              <Collapsible.Root
                open={!collapsed[group.id]}
                onOpenChange={(open) => (collapsed[group.id] = !open)}
              >
                <Collapsible.Trigger
                  >{#snippet child({ props })}<Button
                      {...props}
                      variant="ghost"
                      size="sm"
                      class="repository-checks__group-heading"
                      >{group.checks.length}
                      {group.label}
                      {group.checks.length === 1
                        ? "check"
                        : "checks"}<ChevronDown
                        style={collapsed[group.id]
                          ? "transform:rotate(-90deg)"
                          : undefined}
                        aria-hidden="true"
                      /></Button
                    >{/snippet}</Collapsible.Trigger
                >
                <Collapsible.Content
                  ><ul class="repository-checks__list">
                    {#each group.checks as check (check.id)}<RepositoryCheckRow
                        {check}
                      />{/each}
                  </ul></Collapsible.Content
                >
              </Collapsible.Root>
            {/each}
          {:else}<ul class="repository-checks__list">
              {#each checks.items as check (check.id)}<RepositoryCheckRow
                  {check}
                />{/each}
            </ul>{/if}
        </ScrollArea>
      {/if}
    </Collapsible.Content>
  </Collapsible.Root>
</section>
