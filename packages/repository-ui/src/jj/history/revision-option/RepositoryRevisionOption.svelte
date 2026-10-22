<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import type { LocalGraphCommit } from "@lapismd/jj-history";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import { encodeJjChangeId } from "../../../history/repository-log-graph.js";
  import RepositoryParentSummary from "../parent-summary/RepositoryParentSummary.svelte";
  import RepositoryComparisonTime from "../comparison-time/RepositoryComparisonTime.svelte";
  let {
    target,
    commit,
    copyText,
  }: {
    target: string;
    commit?: LocalGraphCommit;
    copyText(value: string): Promise<void>;
  } = $props();
</script>

<div role="gridcell" class="repository-review-revision-option">
  <RepositoryParentSummary
    {target}
    author={commit?.author.name}
    email={commit?.author.email}
    description={commit?.description}
  />
  <span
    class="repository-review-revision-ids"
    role="presentation"
    onpointerdown={(event) => event.stopPropagation()}
    onkeydown={(event) => {
      if (event.key === "Enter" || event.key === " ") event.stopPropagation();
    }}
  >
    <RepositoryIdentifiers
      {copyText}
      commitId={target}
      changeId={commit ? encodeJjChangeId(commit.change_id) : ""}
      placement="inline"
    />
  </span>
  <RepositoryComparisonTime
    timestamp={commit ? Number(commit.author.timestamp.millis) : undefined}
  />
</div>

<style>
  .repository-review-revision-option {
    display: flex;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    flex: 1 1 0;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
  }
  .repository-review-revision-ids {
    display: inline-flex;
    flex: none;
  }
</style>
