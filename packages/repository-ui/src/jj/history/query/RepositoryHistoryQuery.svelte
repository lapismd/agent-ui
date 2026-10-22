<!-- SPDX-License-Identifier: Apache-2.0; adapted from jj-store StoreHistoryQuery. -->
<script lang="ts">
  import { untrack } from "svelte";
  import { SearchFilterInput } from "@lapismd/design-core/filter";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import SearchIcon from "@lucide/svelte/icons/search";
  import SettingsIcon from "@lucide/svelte/icons/settings-2";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import {
    historyExtensions,
    type HistoryLanguage,
  } from "./history-language.js";
  import {
    defaultHistoryQueryInfo,
    type RepositoryHistoryQueryInfo,
  } from "./types.js";
  let {
    language = "revset",
    value,
    busy = false,
    info = defaultHistoryQueryInfo,
    symbols = [],
    onApply,
  }: {
    language?: HistoryLanguage;
    value: string;
    busy?: boolean;
    info?: RepositoryHistoryQueryInfo;
    symbols?: readonly string[];
    onApply(value: string): void;
  } = $props();
  let draft = $state(untrack(() => value)),
    contextOpen = $state(false);
  let previousValue = untrack(() => value);
  $effect(() => {
    const next = value;
    untrack(() => {
      if (draft === previousValue) draft = next;
      previousValue = next;
    });
  });
  const id = $props.id();
  const stableSymbols = $derived(JSON.stringify(info.symbols ?? symbols));
  const extensions = $derived(
    historyExtensions(language, info, JSON.parse(stableSymbols), apply),
  );
  function apply() {
    if (!busy) onApply(draft);
  }
  const operations = $derived(language === "operations");
</script>

<div class="repository-history-query" aria-busy={busy}>
  <SearchFilterInput
    value={draft}
    inputMode="custom"
    showSearchIcon={false}
    ariaLabel={operations ? "Operation query" : "Revision query"}
    placeholder={operations
      ? 'description:"rebase" user:steve'
      : 'mutable() & description("fix")'}
    editorExtensions={extensions}
    onValueChange={(value) => (draft = value)}
    onClearSearch={() => {
      draft = operations ? "" : "all()";
      apply();
    }}
  >
    {#snippet actions()}
      <Button
        size="icon"
        variant="ghost"
        class="repository-history-query__round"
        disabled={busy}
        onclick={apply}
        aria-label="Apply query"
        title="Run history query"><SearchIcon aria-hidden="true" /></Button
      >
      <Button
        size="icon"
        variant={contextOpen ? "default" : "ghost"}
        class="repository-history-query__round"
        aria-label="Query context and syntax"
        title="Query context and syntax"
        aria-expanded={contextOpen}
        aria-controls={id}
        onclick={() => (contextOpen = !contextOpen)}
        ><SettingsIcon aria-hidden="true" /></Button
      >
    {/snippet}
  </SearchFilterInput>
  <Collapsible.Root open={contextOpen}
    ><Collapsible.Content {id}>
      <div class="repository-history-query__context">
        <p>
          {operations
            ? "Filter recorded operation metadata; this is not a revision set."
            : "Use JJ revision-set syntax, functions, aliases and bookmarks."}
        </p>
        <p>
          Ctrl/Cmd+Space opens completion. Tab accepts a suggestion;
          Ctrl/Cmd+Enter runs the query.
        </p>
        <code
          >{operations
            ? info.operation_fields.map((field) => `${field}:`).join(" · ")
            : info.aliases.join(" · ")}</code
        >
      </div>
    </Collapsible.Content></Collapsible.Root
  >
</div>

<style>
  .repository-history-query {
    padding: var(--ui-repository-history-query-padding, 0.5rem 0.75rem);
    border-block-end: 1px solid var(--border);
  }
  .repository-history-query :global(.repository-history-query__round) {
    --ui-button-radius: 999px;
    width: 1.75rem;
    height: 1.75rem;
  }
  .repository-history-query
    :global(.repository-history-query__round[data-variant="default"]) {
    --ui-button-background: var(--accent);
    --ui-button-foreground: var(--primary);
  }
  .repository-history-query__context {
    display: grid;
    gap: 0.75rem;
    margin-block-start: var(--ui-repository-history-query-gap, 0.75rem);
    font-size: 0.8125rem;
  }
  p {
    margin: 0;
  }
  :global(.history-query-string) {
    color: var(--ui-form-code-string, var(--foreground));
  }
  :global(.history-query-function),
  :global(.history-query-field) {
    color: var(--ui-form-code-function, var(--foreground));
  }
  :global(.history-query-alias),
  :global(.history-query-operator) {
    color: var(--ui-form-code-keyword, var(--foreground));
  }
  :global(.history-query-literal) {
    color: var(--ui-form-code-value, var(--foreground));
  }
  :global(.history-query-symbol) {
    color: var(--ui-form-code-property, var(--foreground));
  }
</style>
