<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store repository snapshot command view. -->
<script lang="ts">
  import "./reference-picker.css";
  import RepositoryChangeCard from "../change-card/RepositoryChangeCard.svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as CommandView from "@lapismd/design-core/shadcn/command-view";
  import * as Popover from "@lapismd/design-core/shadcn/popover";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  import XIcon from "@lucide/svelte/icons/x";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryBrowserEmpty from "../file-preview/RepositoryBrowserEmpty.svelte";
  import RepositoryReferenceRows from "./RepositoryReferenceRows.svelte";
  import type { RepositoryReferenceChoice } from "./types.js";
  let {
    value,
    now,
    copyText,
    choices = [],
    hasMore = false,
    loading = false,
    disabled = false,
    unavailable = false,
    onRetry,
    onSelect,
    onLoadMore,
  }: {
    value: string;
    now: number;
    copyText(value: string): Promise<void>;
    choices?: readonly RepositoryReferenceChoice[];
    hasMore?: boolean;
    loading?: boolean;
    disabled?: boolean;
    unavailable?: boolean;
    onRetry?: () => void;
    onSelect: (choice: RepositoryReferenceChoice) => void;
    onLoadMore?: () => void;
  } = $props();
  let open = $state(false),
    tab = $state("bookmark"),
    query = $state("");
  const label = "Repository bookmark or change";
  const heading = "Switch snapshot";
  const visibleRefs = $derived.by(() => {
    const search = query.trim().toLocaleLowerCase();
    return choices.filter((choice) => {
      const searchable = [
        choice.label,
        choice.commit?.message ?? "",
        choice.commit?.author ?? "",
        choice.commit?.eventId ?? "",
        choice.commit?.changeId ?? "",
        ...(choice.searchTerms ?? []),
      ]
        .join(" ")
        .toLocaleLowerCase();
      return choice.kind === tab && (!search || searchable.includes(search));
    });
  });
  const selected = $derived(choices.find((choice) => choice.value === value));
  function handleOpen(next: boolean) {
    open = next;
    if (next) {
      query = "";
      tab = selected?.kind ?? "bookmark";
    }
  }
  function choose(value: string) {
    open = false;
    const choice = choices.find((choice) => choice.value === value);
    if (choice) onSelect(choice);
  }
</script>

{#snippet referenceOption(option: RepositoryReferenceChoice)}
  <CommandView.Item
    role="row"
    value={option.value}
    aria-label={option.label}
    keywords={[option.label, ...(option.searchTerms ?? [])]}
    onSelect={() => choose(option.value)}
  >
    <div role="gridcell" class="reference-cell">
      <CommandView.ItemIcon
        >{#if option.value === value}<CheckIcon
            aria-hidden="true"
          />{/if}</CommandView.ItemIcon
      >
      <CommandView.ItemLabel
        >{#if option.kind === "change" && option.commit}<RepositoryChangeCard
            commit={option.commit}
            {now}
            {copyText}
          />{:else}{option.label}{/if}</CommandView.ItemLabel
      >
      {#if option.kind === "bookmark" && option.targets.length !== 1}<span
          data-ui-component="command-view"
          data-ui-part="trailing"
          ><Badge variant="secondary" aria-hidden="true"
            >{option.targets.length
              ? `${option.targets.length} targets`
              : "deleted"}</Badge
          ></span
        >{/if}
    </div>
  </CommandView.Item>
{/snippet}

<Popover.Root {open} onOpenChange={handleOpen}>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        {disabled}
        class={["repository-reference-picker-trigger", props.class]}
        role="combobox"
        aria-label={label}
      >
        <GitBranchIcon aria-hidden="true" />
        <span
          >{(selected?.kind === "change"
            ? selected.label.split(" · ").slice(0, 2).join(" · ")
            : selected?.label) || "Select snapshot"}</span
        >
        <ChevronDownIcon
          class="repository-reference-picker-command__chevron"
          aria-hidden="true"
        />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content
    class="repository-reference-picker-command"
    align="start"
    style="--ui-popover-width: var(--ui-repository-reference-picker-width, 22rem); --ui-popover-padding: 0.5rem 0.75rem 0.625rem; --ui-popover-gap: 0.25rem"
  >
    <Popover.Header class="repository-reference-picker-command__header">
      <Popover.Title
        class="repository-reference-picker-command__title"
        role="heading"
        aria-level={2}>{heading}</Popover.Title
      >
      <Popover.Close>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="ghost"
            size="icon-sm"
            aria-label="Close snapshot switcher"
          >
            <XIcon />
            <span class="sr-only">Close</span>
          </Button>
        {/snippet}
      </Popover.Close>
    </Popover.Header>
    <CommandView.Root label={heading} shouldFilter={false}>
      <CommandView.Input
        bind:value={query}
        aria-haspopup="grid"
        placeholder={"Find bookmark, change or commit"}
        aria-label={"Find bookmark, change or commit"}
      />
      {#if true}
        <CommandView.Filters
          bind:value={tab}
          label="Snapshot kinds"
          tabs={[
            { id: "bookmark", label: "Bookmarks" },
            { id: "change", label: "Changes" },
          ]}
        />
      {/if}
      <CommandView.List role="grid" aria-label="Repository snapshots">
        {#if visibleRefs.length > 0 && !unavailable}<CommandView.Group
            role="rowgroup"
            heading={tab === "bookmark" ? "Bookmarks" : "Changes"}
          >
            <RepositoryReferenceRows
              rows={visibleRefs}
              row={referenceOption}
              getKey={(option) => option.value}
              estimateSize={() => (tab === "change" ? 94 : 36)}
              {hasMore}
              {loading}
              loadingLabel="Loading more references"
              {onLoadMore}
            />
          </CommandView.Group>{/if}
      </CommandView.List>
      {#if unavailable}<RepositoryBrowserEmpty
          title="Snapshots unavailable"
          description="The host could not read references at this operation."
          {onRetry}
        />
      {:else if loading && visibleRefs.length === 0}<RepositorySkeleton
          kind="files"
          label="Loading snapshots"
        />
      {:else if visibleRefs.length === 0}<RepositoryBrowserEmpty
          title="No matching snapshots"
          description="Try another query or ask the host to load more references."
        />{/if}
    </CommandView.Root>
  </Popover.Content>
</Popover.Root>
