<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's recorded file panel. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { FileTypeIcon } from "@lapismd/design-core/shadcn/file-type-icon";
  import { CodeBlock } from "@lapismd/design-core/shadcn/code-block";
  import { resolveDiffLanguage } from "@lapismd/design-core/diff";
  import HistoryIcon from "@lucide/svelte/icons/history";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryFileDisplayControls from "./RepositoryFileDisplayControls.svelte";
  import RepositoryFileAction from "./RepositoryFileAction.svelte";
  import RepositoryFileMetadata from "./RepositoryFileMetadata.svelte";
  import RepositoryMarkdownPreview from "./RepositoryMarkdownPreview.svelte";
  import RepositoryBrowserEmpty from "./RepositoryBrowserEmpty.svelte";
  import { isMarkdownRepositoryPath } from "../logic/paths.js";
  import type {
    RepositoryBrowserFile,
    RepositoryBrowserPhase,
    RepositoryBrowserSelection,
  } from "../logic/types.js";
  import "./files.css";
  let {
    file,
    phase = "ready",
    selection,
    display = "source",
    now,
    fileTreeOpen = false,
    onToggleFileTree = () => {},
    onDisplayChange,
    onRetry,
    onHistory,
    onBlame,
    blame,
    copyText,
    actions,
  }: {
    file?: RepositoryBrowserFile;
    phase?: RepositoryBrowserPhase;
    selection: RepositoryBrowserSelection;
    display?: "source" | "preview" | "blame";
    now: number;
    fileTreeOpen?: boolean;
    onToggleFileTree?: () => void;
    onDisplayChange(mode: "source" | "preview" | "blame"): void;
    onRetry(): void;
    onHistory?(selection: RepositoryBrowserSelection): void;
    onBlame?(selection: RepositoryBrowserSelection): void;
    copyText(value: string): Promise<void>;
    actions?: Snippet<[RepositoryBrowserSelection]>;
    blame?: Snippet<[RepositoryBrowserSelection]>;
  } = $props();
  const markdown = $derived(isMarkdownRepositoryPath(selection.path));
</script>

<section
  class="repository-browser__file-panel"
  aria-label={`File preview for ${selection.path}`}
>
  <div class="repository-browser__file-body">
    <div class="repository-browser__file-panel-stack">
      {#if phase === "loading"}<RepositorySkeleton
          kind="diff"
          label={`Loading ${selection.path}`}
        />
      {:else if phase === "unavailable"}<RepositoryBrowserEmpty
          title="File preview unavailable"
          description="This recorded file could not be read. Retry the same pinned file."
          {onRetry}
        />
      {:else if file}
        <RepositoryFileMetadata
          {file}
          {now}
          {fileTreeOpen}
          {onToggleFileTree}
          {copyText}
        />
        <p
          class="repository-browser__file-panel-stats"
          role="status"
          aria-label="File statistics"
        >
          {file.size === undefined
            ? "Size unavailable"
            : `${file.size.toLocaleString()} bytes`}{file.kind === "text"
            ? ` · ${file.contents ? file.contents.split("\n").length : 0} lines`
            : ""}
        </p>
        <section
          class="repository-browser__file-content-card"
          aria-label={`Source preview for ${file.path}`}
        >
          <header class="repository-browser__file-content-header">
            <span><FileTypeIcon path={file.path} size="s" /> {file.path}</span>
            <div class="repository-browser__file-content-actions">
              {#if file.kind === "text"}<RepositoryFileDisplayControls
                  mode={display}
                  isMarkdown={markdown}
                  canBlame={!!onBlame && !!blame}
                  onSelect={(mode) => {
                    onDisplayChange(mode);
                    if (mode === "blame") onBlame?.(selection);
                  }}
                />{/if}
              {#if onHistory}<RepositoryFileAction
                  label="File history"
                  onclick={() => onHistory?.(selection)}
                  ><HistoryIcon aria-hidden="true" /></RepositoryFileAction
                >{/if}
              <RepositoryFileAction
                label="Copy file path"
                onclick={() => void copyText(file.path)}
                ><CopyIcon aria-hidden="true" /></RepositoryFileAction
              >
              {@render actions?.(selection)}
            </div>
          </header>
          {#if file.kind === "binary"}<div
              class="repository-browser__file-content-unavailable"
            >
              <RepositoryBrowserEmpty
                title="Binary file"
                description={`${file.path} cannot be previewed as text.`}
              />
            </div>
          {:else if file.kind === "unavailable"}<div
              class="repository-browser__file-content-unavailable"
            >
              <RepositoryBrowserEmpty
                title="Preview unavailable"
                description={file.reason}
              />
            </div>
          {:else if !file.contents}<RepositoryBrowserEmpty
              title="Empty file"
              description="This recorded file contains no text."
            />
          {:else if display === "blame" && blame}{@render blame(selection)}
          {:else if display === "preview" && markdown}<RepositoryMarkdownPreview
              content={file.contents}
              label={`Markdown preview for ${file.path}`}
            />
          {:else}<CodeBlock
              code={file.contents}
              language={resolveDiffLanguage(file.path) ?? "plaintext"}
              hasLanguageLabel
              hasCopyButton={false}
              hasLineNumbers
              width="100%"
              container="section"
              highlightMode="spans"
            />{/if}
        </section>
      {:else}<RepositoryBrowserEmpty
          title="No file selected"
          description="Select a recorded file to preview it."
        />{/if}
    </div>
  </div>
</section>
