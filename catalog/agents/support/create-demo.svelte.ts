import { recordedConversation } from "./recorded-data.js";
import { memoryChanges } from "./changes.svelte.js";
import { outgoingContext } from "./sent-context.js";
import type { AgentTranscriptOptions } from "../../../packages/agent-ui/src/chat/transcript-options.js";
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
  | "typography"
  | "default"
  | "all"
  | "comments"
  | "stale"
  | "error"
  | "message-status"
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
export function createDemo(
  scenario: AgentScenario = "default",
  controllerOptions?: import("../../../packages/agent-ui/src/core/models.js").AgentControllerOptions,
) {
  const port = new MemoryAgentPort();
  const icons: NonNullable<AgentTranscriptOptions["icons"]> = {};
  const captureAbort = new AbortController();
  const changes = scenario === "all" ? memoryChanges() : undefined;
  if (
    ["all", "comments", "stale", "streaming", "typography"].includes(scenario)
  )
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
  if (scenario === "all") {
    port.snapshot.sessions[0].items = supportedMessages();
    const prompt = port.snapshot.sessions[0].items.find(
      (item) => item.id === "prompt",
    )!;
    prompt.sentContext = {
      content: outgoingContext,
      rawContent: outgoingContext,
      rawLanguage: "xml",
      delivery: "sent",
    };
  }
  if (scenario === "all")
    port.snapshot.sessions[0].items.push(...failedMessages());
  if (scenario === "message-status")
    port.snapshot.sessions[0].items = failedMessages();
  if (scenario === "empty") port.snapshot.sessions[0].items = [];
  if (scenario === "queue" || scenario === "busy" || scenario === "streaming")
    port.snapshot.busy = true;
  if (scenario === "queue") port.snapshot.queued = queuedMessages();
  if (scenario === "refused" || scenario === "error") port.fault = "failed";
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
    controllerOptions,
  );
  const panel = createChatPresentation(() => controller);
  if (scenario === "loading") controller.loading = true;
  if (["error", "refused", "unknown"].includes(scenario))
    controller.transcript.message = "Retain my exact authored draft.";
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
  const options: AgentTranscriptOptions = {
    icons,
    changes: changes?.inspection,
    messages: {
      "failed-prompt": { retry: true },
      error: { retry: true },
      prompt: {
        recipients: [{ id: "reviewer", label: "Reviewer" }],
        deliveries: [{ recipient: { id: "reviewer" }, state: "completed" }],
      },
    },
    onRetry: (id) => controller.action("retry_turn", id).then(() => {}),
    onCopyResponse: (text) =>
      controller.action("copy_response", text).then(() => {}),
    onOpenPath: (path) => controller.action("open_path", path).then(() => {}),
    workingLabel: "Agent is working…",
    composer: {
      status:
        scenario === "all"
          ? { type: "warning", message: "Context window is 90% full." }
          : undefined,
    },
    blocks: {
      "local-command/body": { kind: "command" },
      "inventory/body": {
        kind: "inventory",
        inventory: {
          kind: "skills",
          items: [
            {
              kind: "skill",
              name: "Component review",
              description: "Review source-faithful components.",
              path: "Skills/review.md",
            },
          ],
        },
      },
      "local-tool/body": {
        kind: "tool",
        name: "vault.read",
        input: '{"path":"notes/review.md"}',
        output: '{"text":"Captured note"}',
      },
    },
  };
  const ready =
    scenario === "all"
      ? recordedConversation(captureAbort.signal)
          .then((recorded) => {
            if (captureAbort.signal.aborted) return;
            Object.assign(icons, recorded.icons);
            port.snapshot.sessions[0].items = [
              ...recorded.items,
              ...port.snapshot.sessions[0].items,
            ];
            controller.snapshot = structuredClone(port.snapshot);
            controller.transcript.threads = structuredClone(recorded.threads);
          })
          .catch((error) => {
            if (!captureAbort.signal.aborted) controller.error = String(error);
          })
      : scenario === "error"
        ? Promise.resolve()
            .then(() => controller.transcript.send())
            .then(() => {})
        : Promise.resolve();
  return {
    port,
    ready,
    controller,
    panel,
    options,
    changes,
    close: () => {
      captureAbort.abort();
      changes?.inspection.dispose();
      return controller.close();
    },
  };
}

function failedMessages(): import("@lapismd/design-core/chat").TranscriptItem[] {
  return [
    {
      id: "failed-prompt",
      kind: "message",
      role: "user",
      label: "Request",
      author: { id: "you", name: "You" },
      timestamp: "2:30 PM",
      blocks: [
        {
          id: "failed-prompt/body",
          revision: "1",
          kind: "markdown",
          label: "Request",
          text: "Review the captured source and retain my message.",
        },
      ],
      status: {
        type: "error",
        label: "Failed",
        message:
          "The agent could not start this turn. Your message is retained.",
      },
    },
  ];
}
