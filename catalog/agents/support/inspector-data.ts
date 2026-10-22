import type { TranscriptTool } from "@lapismd/design-core/chat";
import { code, patch } from "./conversation-data.js";
export type InspectorVariant =
  "markdown" | "code" | "files" | "failure" | "custom";
export function inspectorTool(variant: InspectorVariant): TranscriptTool {
  const markdown = {
    id: "inspect/markdown",
    revision: "capture-1",
    kind: "markdown" as const,
    label: "notes/review.md",
    path: "notes/review.md",
    text: "# Captured review\n\nThe **original** context and surrounding prose share the same typography.\n\n| Check | Result |\n| --- | --- |\n| Shell | Retained |\n\n- Captured source\n- Exact revision",
  };
  return {
    id: "inspector-demo",
    revision: "capture-1",
    title:
      variant === "failure" ? "Failed vault.read" : "Captured application tool",
    status: variant === "failure" ? "error" : "complete",
    raw: JSON.stringify(
      {
        name: "vault.read",
        input: { path: "notes/review.md" },
        output:
          variant === "failure"
            ? { error: "Unavailable" }
            : { text: markdown.text },
      },
      null,
      2,
    ),
    blocks:
      variant === "code"
        ? [code]
        : variant === "files"
          ? [markdown, code, patch]
          : variant === "failure"
            ? [
                {
                  ...markdown,
                  id: "inspect/error",
                  text: "The admitted note was unavailable. The captured error is retained.",
                },
              ]
            : variant === "custom"
              ? [
                  {
                    ...markdown,
                    id: "inspect/custom",
                    kind: "custom",
                    surface: "plain",
                    text: "Captured local tool output",
                  },
                ]
              : [markdown],
  };
}
