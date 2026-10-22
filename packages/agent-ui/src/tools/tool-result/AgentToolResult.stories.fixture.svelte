<script lang="ts">
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import AgentToolResult from "./AgentToolResult.svelte";
  import type { AgentToolResultData } from "../../chat/transcript-options.js";
  let {
    kind = "generic",
    registered = false,
  }: {
    kind?:
      | "generic"
      | "shell"
      | "file-read"
      | "file-edit"
      | "search"
      | "partial"
      | "error"
      | "unavailable";
    registered?: boolean;
  } = $props();
  const result = $derived<AgentToolResultData>({
    name: "Captured application tool",
    input: '{"path":"notes/review.md"}',
    output: '{"text":"Captured result"}',
    raw: '{"tool":"vault.read","capture":"exact"}',
    ...(kind === "shell"
      ? {
          detail: {
            kind: "shell",
            command: "pnpm check",
            cwd: "Projects/agent-ui",
            output: "Checks passed",
            exitCode: 0,
          },
        }
      : kind === "file-read"
        ? {
            detail: {
              kind: "file-read",
              path: "notes/review.md",
              content: "# Review\n\nCaptured source remains unchanged.",
              language: "markdown",
            },
          }
        : kind === "file-edit"
          ? {
              detail: {
                kind: "file-edit",
                files: [
                  {
                    path: "src/agent.ts",
                    oldText: "export const enabled = false;\n",
                    newText: "export const enabled = true;\n",
                  },
                ],
              },
            }
          : kind === "search"
            ? {
                detail: {
                  kind: "search",
                  query: "AgentTranscript",
                  matches: [
                    {
                      path: "src/chat.ts",
                      line: 14,
                      text: "import AgentTranscript from './AgentTranscript.svelte';",
                    },
                  ],
                },
              }
            : kind === "partial"
              ? {
                  capture: {
                    partial: true,
                    truncated: true,
                    note: "Only the captured tail is available.",
                  },
                  detail: {
                    kind: "file-edit",
                    files: [
                      {
                        path: "src/agent.ts",
                        partial: true,
                        capturedText: "export const enabled = true;",
                        capturedSide: "after",
                      },
                    ],
                  },
                }
              : kind === "unavailable"
                ? {
                    detail: {
                      kind: "unavailable",
                      reason: "No captured file bytes are available.",
                    },
                  }
                : kind === "error"
                  ? { error: "The host denied access to the requested file." }
                  : {}),
  });
</script>

{#snippet custom(capture: AgentToolResultData)}<MarkdownContent
    content={`### Registered host result\n\n${capture.name}\n\n**Rendered by the host-provided view.**`}
    fullWidth
  />{/snippet}
<div class="tool-result-host">
  <AgentToolResult {result} view={registered ? custom : undefined} />
</div>

<style>
  .tool-result-host {
    padding: 1rem;
    min-width: 0;
  }
</style>
