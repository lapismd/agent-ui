<!-- Copied/adapted from JJ Store StoreRepositoryDirectoryRow, Apache-2.0. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import { GitBranch } from "@lucide/svelte";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import WorkTime from "./WorkTime.svelte";
  import RepositoryActivityBar from "./RepositoryActivityBar.svelte";
  import type { WorkHome } from "../logic/types.js";
  import "./community-work-directory.css";
  let {
    id,
    home,
    status = "",
    onOpen,
    actions,
  }: {
    id: string;
    home?: WorkHome;
    status?: string;
    onOpen?(home: WorkHome): void;
    actions?: Snippet;
  } = $props();
  const actor = $derived(home?.summary?.contributor);
</script>

<article
  class="community-projects__row community-projects__repository-row store-projects__repository-directory-row"
>
  <span class="community-projects__row-icon"
    ><GitBranch aria-hidden="true" /></span
  >
  <button
    type="button"
    class="community-projects__row-main community-projects__repository-target"
    disabled={!home?.available || !onOpen}
    onclick={() => home && onOpen?.(home)}
  >
    <span class="sr-only">Open repository </span>
    <span class="store-projects__repository-copy"
      ><span class="store-projects__repository-title"
        ><strong title={id}>{home?.name ?? id}</strong>{#if status}<Badge
            variant="secondary">{status}</Badge
          >{/if}</span
      ><span class="store-projects__repository-description"
        >{home?.available
          ? home.summary?.description ||
            home.description ||
            "No change description"
          : "Separate access required"}</span
      ></span
    >
    <span class="store-projects__repository-access"
      >{home?.available
        ? `${home.writable ? "Write" : "Read"} access`
        : ""}</span
    >
  </button>
  {#if home?.available}<div
      class="community-projects__row-meta store-projects__repository-metadata"
    >
      {#if actor}<RepositoryAuthorAvatar
          name={actor.name ?? actor.created_by}
          avatarUrl={actor.avatarUrl}
          size="xs"
        />{:else}<span aria-label="Contributor unavailable">—</span>{/if}
      {#if home.summary}<RepositoryActivityBar {...home.summary} />{:else}<span
          class="store-projects__repository-date">Activity unavailable</span
        >{/if}
      {#if home.summary?.updatedAtMillis}<WorkTime
          timestamp={home.summary.updatedAtMillis / 1000}
        />{:else}<span
          class="store-projects__repository-date"
          title="No recorded activity date">—</span
        >{/if}
      {@render actions?.()}
    </div>{:else}{@render actions?.()}{/if}
</article>
