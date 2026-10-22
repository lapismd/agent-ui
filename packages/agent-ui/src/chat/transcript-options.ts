import type { ToolCallDetailProps } from "@lapismd/design-core/chat";
import type { TranscriptProps } from "@lapismd/design-core/chat";
/** Optional host presentation hooks; the Agent controller retains items, drafts and delivery. */
export type AgentTranscriptOptions = Pick<
  TranscriptProps,
  | "history"
  | "onLoadHistory"
  | "customBlock"
  | "markdown"
  | "supplement"
  | "metadataSupplement"
  | "onOpenThread"
  | "messageActions"
  | "reactions"
  | "onReact"
  | "reactionOptions"
  | "reactionsDisabled"
  | "authorPopover"
  | "beforeItems"
  | "afterItems"
  | "navigation"
> & {
  icons?: Readonly<Record<string, import("svelte").Component>>;
  blocks?: Readonly<Record<string, AgentBlockPresentation>>;
  messages?: Readonly<Record<string, AgentMessagePresentation>>;
  onRetry?: (itemId: string) => void | Promise<void>;
  onCopyResponse?: (text: string) => void | Promise<void>;
  onOpenPath?: (path: string) => void | Promise<void>;
  workingLabel?: string;
  composerStatus?: import("@lapismd/design-core/ai/chat").ComposerStatus;
  composerStatusPosition?: "top" | "bottom";
  changes?: import("./turn-changes/controller.svelte.js").AiHistoryInspection;
};
export type AgentInventory = {
  kind: "skills" | "tools";
  items: { kind: string; name: string; description?: string; path?: string }[];
};
export type AgentBlockPresentation =
  | (AgentToolResultData & {
      kind: "tool";
      view?: import("svelte").Snippet<[AgentToolResultData]>;
    })
  | { kind: "command" | "system" }
  | { kind: "inventory"; inventory: AgentInventory };
export interface AgentMessagePresentation {
  recipients?: readonly { id: string; label: string }[];
  deliveries?: readonly {
    recipient: { id: string };
    state:
      | "pending"
      | "started"
      | "completed"
      | "rejected"
      | "unknown"
      | "not_sent"
      | "cancelled";
  }[];
  retry?: boolean;
}

/** Exact captured tool fields. Host-specific parsing and registry lookup stay outside this package. */
export interface AgentToolResultData extends Omit<
  ToolCallDetailProps,
  "toolName" | "view" | "maximized"
> {
  name: string;
}
