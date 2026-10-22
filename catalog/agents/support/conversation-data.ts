import type {
  TranscriptBlock,
  TranscriptItem,
  TranscriptQueuedMessage,
} from "@lapismd/design-core/chat";
export const prose: TranscriptBlock = {
  id: "answer/body",
  revision: "captured-v1",
  kind: "markdown",
  label: "Implementation summary",
  text: "# Captured implementation\n\nKeep the exact captured text, including café 👩🏽‍💻 and repeated words.\n\n- [x] Preserve the original layout\n- [ ] Review the exported components\n\n| Area | State |\n| --- | --- |\n| Chat | Ready |\n| History | Ready |\n\n```typescript\nconst ready = true;\n```\n\n[Component documentation](https://example.com/components)",
};
export const code: TranscriptBlock = {
  id: "tool/source",
  revision: "captured-v1",
  kind: "code",
  label: "src/agent.ts",
  path: "src/agent.ts",
  text: "export const agent = {\n  name: 'Reviewer',\n  enabled: true,\n};",
};
export const patch: TranscriptBlock = {
  id: "tool/patch",
  revision: "captured-v1",
  kind: "patch",
  label: "Agent patch",
  path: "src/agent.ts",
  text: "@@ -1,2 +1,2 @@\n-export const enabled = false;\n+export const enabled = true;",
};
const author = { id: "assistant", name: "Codex", initials: "CX" };
export function supportedMessages(): TranscriptItem[] {
  return [
    {
      id: "session-start",
      kind: "context",
      label: "Session started",
      createdAt: "2026-10-22T09:00:00Z",
      blocks: [],
    },
    {
      id: "prompt",
      kind: "message",
      role: "user",
      label: "Request",
      author: { id: "you", name: "You", initials: "YO" },
      timestamp: "09:00",
      createdAt: "2026-10-22T09:00:00Z",
      sentContext: {
        content:
          "## Workspace context\n\nOnly the admitted project files were supplied.",
        rawContent: '<context scope="agent-ui" />',
        rawLanguage: "xml",
        delivery: "sent",
      },
      blocks: [
        {
          id: "prompt/body",
          revision: "v1",
          kind: "markdown",
          label: "Request",
          text: "Review the agent components and retain their original presentation.",
        },
      ],
    },
    {
      id: "context",
      kind: "context",
      label: "Workspace context",
      blocks: [
        {
          id: "context/body",
          revision: "v1",
          kind: "context",
          label: "Admitted workspace",
          text: "The host supplied a read-only snapshot of **agent-ui**.",
        },
      ],
    },
    {
      id: "thinking",
      kind: "reasoning",
      label: "Reasoning",
      defaultExpanded: true,
      blocks: [
        {
          id: "thinking/body",
          revision: "v1",
          kind: "markdown",
          label: "Reasoning",
          text: "Compare the source components before proposing any layout changes.",
        },
      ],
    },
    {
      id: "tools",
      kind: "tools",
      label: "Tool activity",
      defaultExpanded: true,
      blocks: [],
      tools: [
        {
          id: "read-agent",
          revision: "v1",
          title: "Read src/agent.ts",
          path: "src/agent.ts",
          status: "complete",
          blocks: [code],
          inlineBlocks: [code],
          raw: '{"tool":"read","result":"captured source"}',
          detailPlacement: "sidebar",
        },
        {
          id: "edit-agent",
          revision: "v1",
          title: "Update agent configuration",
          status: "complete",
          blocks: [patch],
          raw: '{"tool":"edit","result":"captured patch"}',
        },
        {
          id: "running-check",
          revision: "v1",
          title: "Check package types",
          status: "running",
          blocks: [
            {
              id: "check/output",
              revision: "v1",
              kind: "code",
              path: "check.log",
              label: "Check output",
              text: "$ pnpm check\nChecking public types…",
            },
          ],
          raw: '{"status":"running"}',
        },
        {
          id: "failed-check",
          revision: "v1",
          title: "Optional network lookup",
          status: "error",
          blocks: [
            {
              id: "lookup/error",
              revision: "v1",
              kind: "markdown",
              label: "Lookup error",
              text: "The simulated network lookup failed. Captured output remains available.",
            },
          ],
          raw: '{"status":"error","code":"DEMO_UNAVAILABLE"}',
        },
        {
          id: "unknown-check",
          revision: "v1",
          title: "Unconfirmed external action",
          status: "unknown",
          blocks: [],
          raw: '{"status":"unknown"}',
        },
      ],
    },
    {
      id: "answer",
      kind: "message",
      role: "assistant",
      label: "Implementation summary",
      author,
      edited: true,
      timestamp: "09:01",
      createdAt: "2026-10-22T09:01:00Z",
      replyCount: 2,
      replyLabel: "Review replies",
      replyParticipants: [{ id: "you", name: "You", initials: "YO" }, author],
      blocks: [
        prose,
        {
          id: "custom/result",
          revision: "v1",
          kind: "custom",
          label: "Host result",
          text: "**Custom result:** all required checks completed.",
          surface: "plain",
        },
      ],
    },
    {
      id: "warning",
      kind: "context",
      notice: "warning",
      label: "Partial context",
      blocks: [
        {
          id: "warning/body",
          revision: "v1",
          kind: "markdown",
          label: "Warning detail",
          text: "One optional source was unavailable. Existing captured content is retained.",
        },
      ],
    },
    {
      id: "error",
      kind: "context",
      notice: "error",
      label: "Request failed",
      blocks: [
        {
          id: "error/body",
          revision: "v1",
          kind: "markdown",
          label: "Error detail",
          text: "The host refused the simulated operation. Your authored draft is retained.",
        },
      ],
    },
    {
      id: "handoff",
      kind: "handoff",
      label: "Handoff summary",
      defaultExpanded: true,
      blocks: [
        {
          id: "handoff/body",
          revision: "v1",
          kind: "context",
          label: "Handoff context",
          text: "Continue with the same captured files and the outstanding review comments.",
        },
      ],
    },
  ];
}
export function queuedMessages(): TranscriptQueuedMessage[] {
  return [
    {
      id: "queued-followup",
      submission: {
        id: "queued-followup",
        text: "Please also review the keyboard behavior and retain the exact captured context. ".repeat(
          5,
        ),
        comments: [],
      },
      recipients: [{ id: "codex", label: "Codex", state: "queued" }],
    },
    {
      id: "unknown-followup",
      submission: {
        id: "unknown-followup",
        text: "Confirm the earlier request before sending anything again.",
        comments: [],
      },
      recipients: [
        {
          id: "opencode",
          label: "OpenCode",
          state: "unknown",
          error: "Delivery is awaiting host confirmation.",
        },
      ],
    },
  ];
}
