import type { AgentSnapshot } from "../../packages/agent-ui/src/core/models.js";
import type { TranscriptItem } from "@lapismd/design-core/chat";
export const message = (
  id: string,
  text: string,
  role: "user" | "assistant" = "assistant",
): TranscriptItem => ({
  id,
  kind: "message",
  role,
  label: role === "user" ? "You" : "Assistant",
  author: {
    id: role,
    name: role === "user" ? "You" : "Codex",
    initials: role === "user" ? "YO" : "CX",
  },
  blocks: [
    {
      id: id + "/body",
      revision: "1",
      kind: "markdown",
      label: "Message",
      text,
    },
  ],
});
export function agentFixture(): AgentSnapshot {
  const items: TranscriptItem[] = [
    message(
      "request",
      "Review the workspace changes and explain the next steps.",
      "user",
    ),
    {
      id: "tool-row",
      kind: "tools",
      label: "Workspace inspection",
      blocks: [],
      tools: [
        {
          id: "read-settings",
          revision: "1",
          title: "Read src/settings.ts",
          path: "src/settings.ts",
          status: "complete",
          blocks: [
            {
              id: "read-settings/code",
              revision: "1",
              kind: "code",
              label: "src/settings.ts",
              path: "src/settings.ts",
              text: "export const settings = { theme: 'lapis' };",
            },
          ],
          raw: '{"tool":"read","path":"src/settings.ts","result":"captured source"}',
          detailPlacement: "sidebar",
        },
      ],
    },
    message(
      "reply",
      "## Workspace review\n\nThe changes add keyboard shortcuts and retain the selected theme.\n\n1. Inspect the file diff.\n2. Add comments to exact captured text.\n3. Preview the commit before applying it.\n\n```ts\nconst ready = true;\n```\n\n| Check | State |\n| --- | --- |\n| Types | Passed |\n| Interactions | Ready |",
    ),
  ];
  return {
    sessions: [
      {
        id: "review",
        title: "Review workspace changes",
        agent: "Codex",
        updatedAt: "2026-10-21 12:00",
        status: "active",
        items,
      },
      {
        id: "planning",
        title: "Plan the agent UI extraction",
        agent: "OpenCode",
        updatedAt: "2026-10-20 10:00",
        status: "active",
        items: [
          message(
            "plan",
            "Preserve public package boundaries and controller ownership.",
          ),
        ],
      },
      {
        id: "archived",
        title: "Archived research",
        agent: "Cursor",
        updatedAt: "2026-10-19 09:00",
        status: "archived",
        items: [message("archive", "A retained conversation.")],
      },
    ],
    agents: [
      {
        id: "codex",
        name: "Codex",
        provider: "Codex",
        model: "GPT-6",
        description: "Workspace implementation and review",
        enabled: true,
      },
      {
        id: "opencode",
        name: "OpenCode",
        provider: "OpenCode",
        model: "Provider default",
        description: "Independent project assistant",
        enabled: true,
      },
      {
        id: "cursor",
        name: "Cursor",
        provider: "Cursor",
        model: "Automatic",
        description: "Editor-integrated assistance",
        enabled: false,
      },
    ],
    catalog: [
      {
        id: "read",
        kind: "tool",
        name: "Read file",
        description: "Read an explicitly admitted file.",
        enabled: true,
      },
      {
        id: "edit",
        kind: "tool",
        name: "Edit file",
        description: "Apply a guarded change after host approval.",
        enabled: true,
      },
      {
        id: "research",
        kind: "skill",
        name: "Research",
        description: "Gather and compare evidence.",
        enabled: true,
      },
      {
        id: "summarise",
        kind: "command",
        name: "/summarise",
        description: "Summarise the current conversation.",
        enabled: false,
      },
    ],
    imports: [
      {
        id: "capture",
        title: "Recorded workspace review",
        source: "Codex local capture",
        items,
        progress: 100,
        status: "ready",
      },
      {
        id: "import-other",
        title: "Architecture discussion",
        source: "OpenCode capture",
        items: [
          message(
            "architecture",
            "Keep execution and credentials in host adapters.",
          ),
        ],
        progress: 100,
        status: "ready",
      },
    ],
    requests: [],
    queued: [],
    busy: false,
    chat: {
      scope: "",
      scopes: ["", "Projects", "Projects/agent-ui"],
      files: [
        { id: "notes/plan.md", label: "plan.md" },
        { id: "src/settings.ts", label: "settings.ts" },
      ],
      usage: { used: 32000, limit: 128000 },
      approvalPolicy: "ask",
      automaticallyMentionAgents: false,
    },
    capabilities: [
      "chat_settings",
      "send",
      "stop",
      "new_session",
      "delete_session",
      "open_catalog_file",
      "archive",
      "respond",
      "cancel_queued",
      "toggle_catalog",
      "import",
    ],
  };
}
