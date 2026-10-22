import { commentAnchor } from "@lapismd/design-core/chat";
import { AgentUiController } from "../../../packages/agent-ui/src/core/index.js";
import { createChatPresentation } from "../../../packages/agent-ui/src/chat/presentation-adapter.svelte.js";
import { MemoryAgentPort } from "../../support/agent-adapter.js";
import {
  prose,
  code,
  supportedMessages,
  queuedMessages,
} from "./conversation-data.js";
export type AgentScenario =
  | "default"
  | "all"
  | "comments"
  | "stale"
  | "error"
  | "refused"
  | "unknown"
  | "queue"
  | "busy"
  | "loading"
  | "empty"
  | "streaming"
  | "attachments"
  | "approval"
  | "question";
export function createDemo(scenario: AgentScenario = "default") {
  const port = new MemoryAgentPort();
  if (["all", "comments", "stale", "streaming"].includes(scenario))
    port.snapshot.sessions[0].items = supportedMessages();
  if (scenario === "comments" || scenario === "stale")
    port.snapshot.sessions[0].items = [
      {
        id: "answer",
        kind: "message",
        role: "assistant",
        label: "Implementation summary",
        blocks: [prose, code],
      },
    ];
  if (scenario === "empty") port.snapshot.sessions[0].items = [];
  if (scenario === "queue" || scenario === "busy" || scenario === "streaming")
    port.snapshot.busy = true;
  if (scenario === "queue") port.snapshot.queued = queuedMessages();
  if (scenario === "refused") port.fault = "failed";
  if (scenario === "unknown") port.fault = "unknown";
  if (scenario === "approval" || scenario === "question")
    port.snapshot.requests = [
      {
        id: `${scenario}-exact-1`,
        kind: scenario,
        title:
          scenario === "approval"
            ? "Allow editing src/agent.ts?"
            : "Which behavior should be retained?",
        details: "The host requires an explicit response.",
        options: [
          { id: "allow-once", label: "Allow once" },
          { id: "deny", label: "Deny" },
        ],
      },
    ];
  const controller = new AgentUiController(
    port,
    structuredClone(port.snapshot),
  );
  const panel = createChatPresentation(() => controller);
  if (scenario === "loading") controller.loading = true;
  if (["error", "refused", "unknown"].includes(scenario))
    controller.transcript.message = "Retain my exact authored draft.";
  if (scenario === "error")
    controller.error =
      "The host is temporarily unavailable. Your draft is retained.";
  if (scenario === "attachments")
    controller.attachments = ["notes/plan.md", "src/settings.ts"];
  if (scenario === "comments" || scenario === "stale") {
    controller.transcript.threads = [prose, code].map((block, index) => ({
      id: `review-thread-${index}`,
      label: block.label,
      sourceKind: block.kind,
      anchor: commentAnchor(
        block,
        index === 0
          ? {
              from: block.text.indexOf("Keep"),
              to: block.text.indexOf("Keep") + 28,
            }
          : { from: 0, to: block.text.indexOf("\n") },
      ),
      comments: [
        {
          id: `review-comment-${index}`,
          author: { id: "you", name: "You", initials: "YO" },
          text:
            index === 0
              ? "Keep this captured wording."
              : "Retain the original export.",
          status: index === 0 ? "draft" : "sent",
          messageId: `published-${index}`,
          version: "v1",
        },
      ],
    }));
    if (scenario === "stale")
      controller.snapshot!.sessions[0].items[0].blocks = [
        {
          ...prose,
          revision: "captured-v2",
          text: "A newer source revision is available.",
        },
      ];
  }
  return { port, controller, panel, close: () => controller.close() };
}
