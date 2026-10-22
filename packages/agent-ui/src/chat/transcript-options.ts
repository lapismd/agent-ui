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
>;
