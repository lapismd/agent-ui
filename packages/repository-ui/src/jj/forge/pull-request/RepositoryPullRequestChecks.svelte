<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeChecks. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import CircleHelp from "@lucide/svelte/icons/circle-help";
  import Clock from "@lucide/svelte/icons/clock";
  import Refresh from "@lucide/svelte/icons/refresh-cw";
  import type { RepositoryPullRequestReview } from "./review.svelte.js";
  import type {
    RepositoryPullRequestRecord,
    PullRequestRequest,
  } from "./types.js";
  let {
    review,
    pr,
    disabled,
    onAction,
  }: {
    review: RepositoryPullRequestReview;
    pr: RepositoryPullRequestRecord;
    disabled: boolean;
    onAction?(request: PullRequestRequest): void;
  } = $props();
  let expanded = $state(true);
  const current = $derived(pr.checks?.sha === pr.sha && pr.checks.complete);
  const summary = $derived(
    !pr.checks
      ? "Checks unavailable"
      : !current
        ? "Checks need refresh"
        : !pr.checks.items.length
          ? "No checks reported"
          : pr.checks.items.some((c) => c.state === "failed")
            ? "Some checks were not successful"
            : pr.checks.items.every((c) => c.state === "passed")
              ? "All checks have passed"
              : "Checks are running",
  );
</script>

<section class="repository-pr__checks" aria-label="CI checks">
  <div class="repository-pr__check-summary">
    <Button
      variant="ghost"
      size="sm"
      aria-expanded={expanded}
      onclick={() => (expanded = !expanded)}>{summary}</Button
    ><Button
      variant="ghost"
      size="icon-sm"
      aria-label="Refresh checks"
      disabled={disabled || !onAction || !pr.capabilities.includes("checks")}
      onclick={() => {
        const request = review.request(pr, { kind: "checks" });
        if (request) onAction?.(request);
      }}><Refresh aria-hidden="true" /></Button
    >
  </div>
  {#if expanded}
    {#if pr.checks}<p class="repository-pr__check-revision">
        {current ? "Revision" : "Observed revision"}
        <code>{pr.checks.sha.slice(0, 8)}</code>{pr.checks.complete
          ? ""
          : " · Results incomplete"}
      </p>
      <ul class="repository-pr__check-list">
        {#each pr.checks.items as check (check.id)}<li data-state={check.state}>
            {#if check.state === "passed"}<CircleCheck
                aria-hidden="true"
              />{:else if check.state === "failed"}<CircleX
                aria-hidden="true"
              />{:else if check.state === "unknown"}<CircleHelp
                aria-hidden="true"
              />{:else}<Clock aria-hidden="true" />{/if}<span
              >{check.name}<small
                >{check.state}{check.description
                  ? ` · ${check.description}`
                  : ""}</small
              ></span
            >
          </li>{/each}
      </ul>
    {/if}
  {/if}
</section>
