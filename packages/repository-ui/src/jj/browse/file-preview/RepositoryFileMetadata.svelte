<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's file-panel header. -->
<script lang="ts">
  import RepositoryCommitDetails from "../../history/commit-message/RepositoryCommitDetails.svelte";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import RepositoryFileAction from "./RepositoryFileAction.svelte";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import type { RepositoryBrowserFile } from "../logic/types.js";
  let {
    file,
    now,
    fileTreeOpen,
    onToggleFileTree,
    copyText,
  }: {
    file: RepositoryBrowserFile;
    now: number;
    fileTreeOpen: boolean;
    onToggleFileTree(): void;
    copyText(value: string): Promise<void>;
  } = $props();
</script>

<RepositoryCommitDetails compact description={file.commit?.message ?? ""}>
  {#snippet children(toggle, panel)}
    <section
      class="repository-browser__file-panel-info"
      aria-label="Selected file metadata"
    >
      <RepositoryFileAction
        panelExpanded={fileTreeOpen}
        class="repository-browser__file-panel-tree-toggle"
        label={fileTreeOpen
          ? "Hide repository file tree"
          : "Show repository file tree"}
        onclick={onToggleFileTree}
      />
      {#if file.commit}
        <RepositoryAuthorAvatar
          name={file.commit.author}
          email={file.commit.authorEmail}
          size="sm"
        />
        <span class="repository-browser__file-panel-info-message"
          ><strong>{file.commit.author}</strong> committed
          <span>{file.commit.message.split("\n")[0]}</span></span
        >
        {@render toggle()}
        <div class="repository-browser__file-panel-info-actions">
          <RepositoryIdentifiers
            commitId={file.commit.eventId}
            changeId={file.commit.changeId}
            placement="inline"
            {copyText}
          /><RelativeTime
            timestamp={file.commit.createdAt * 1000}
            now={now * 1000}
          />
        </div>
      {:else}<span class="repository-browser__file-panel-info-message"
          >{file.path}</span
        >{/if}
    </section>

    {@render panel()}
  {/snippet}
</RepositoryCommitDetails>
