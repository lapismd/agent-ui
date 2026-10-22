import FolderGitIcon from "@lucide/svelte/icons/folder-git-2";
import BotIcon from "@lucide/svelte/icons/bot";
import HashIcon from "@lucide/svelte/icons/hash";
import ListTodoIcon from "@lucide/svelte/icons/list-todo";
import FolderIcon from "@lucide/svelte/icons/folder-kanban";
import type {
  ChatReference,
  ChatReferenceOptions,
} from "@lapismd/design-core/chat";
export const personId = "1".repeat(32),
  agentId = "2".repeat(32);
export const lapisEmoji = {
  id: "lapis",
  shortcode: "lapis",
  label: "Lapis",
  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236958bd' d='M10 0 20 10 10 20 0 10Z'/%3E%3C/svg%3E",
};
export function referenceData(
  legacy: boolean,
  activate: (reference: ChatReference) => void,
) {
  const records: ChatReference[] = [
    {
      id: personId,
      kind: "person",
      label: "Alex Morgan",
      href: legacy ? `jj-store:member/${personId}` : "/people/alex",
      description: "Design review",
      avatar: { id: personId, name: "Alex Morgan", initials: "AM" },
    },
    {
      id: agentId,
      kind: "agent",
      label: "Reviewer",
      href: legacy ? `jj-store:agent/${agentId}` : "/agents/reviewer",
      description: "Reviews captured changes",
      icon: BotIcon,
    },
    {
      id: "desktop",
      kind: "repository",
      label: "Lapis Desktop",
      href: legacy ? "jj-store:repo/desktop" : "/repositories/desktop",
      icon: FolderGitIcon,
    },
    {
      id: "release",
      kind: "project",
      label: "Shared UI release",
      href: "/projects/release",
      icon: FolderIcon,
    },
    {
      id: "task-42",
      kind: "task",
      label: "Review #42",
      href: "/tasks/42",
      icon: ListTodoIcon,
    },
    {
      id: "design",
      kind: "channel",
      label: "design",
      href: "/threads/design",
      icon: HashIcon,
    },
    {
      id: "lapis",
      kind: "emoji",
      label: ":lapis:",
      presentation: "emoji",
      avatar: { id: "lapis", name: "Lapis", src: lapisEmoji.url },
    },
  ];
  const options: ChatReferenceOptions = {
    resolve: (destination) =>
      records.find((record) => record.href === destination),
    matches: (text) =>
      [
        ...text.matchAll(
          /jj-store-agent:([0-9a-f]{32});|jj-store-member:([0-9a-f]{32})|:lapis:/g,
        ),
      ].flatMap((match) => {
        const reference = records.find(
          (record) => record.id === (match[1] ?? match[2] ?? "lapis"),
        );
        return reference
          ? [
              {
                from: match.index!,
                to: match.index! + match[0].length,
                reference,
              },
            ]
          : [];
      }),
    onActivate: activate,
    ...(legacy
      ? {
          serialize: (reference: ChatReference) =>
            reference.kind === "agent"
              ? `jj-store-agent:${reference.id};`
              : reference.kind === "person"
                ? `jj-store-member:${reference.id}`
                : `[${reference.label}](${reference.href})`,
        }
      : {}),
  };
  const sources = [
    { character: "@", label: "People and agents", kinds: ["person", "agent"] },
    {
      character: "#",
      label: "Repositories and context",
      kinds: ["repository", "project", "task", "channel"],
    },
    { character: ":", label: "Emoji", kinds: ["emoji"] },
  ].map(({ character, label, kinds }) => ({
    character,
    label,
    search: (query: string, signal: AbortSignal) =>
      signal.aborted
        ? []
        : records.filter(
            (record) =>
              kinds.includes(record.kind) &&
              record.label.toLowerCase().includes(query.toLowerCase()),
          ),
  }));
  const person = legacy
    ? `jj-store-member:${personId}`
    : "[Alex Morgan](/people/alex)";
  const agent = legacy
    ? `jj-store-agent:${agentId};`
    : "[Reviewer](/agents/reviewer)";
  const repository = legacy
    ? "[Lapis Desktop](jj-store:repo/desktop)"
    : "[Lapis Desktop](/repositories/desktop)";
  const text = `Ask ${person} and ${agent} to review ${repository}. :lapis: 👋\n\nTrack [Review #42](/tasks/42) in [Shared UI release](/projects/release), then post in [design](/threads/design).\n\nKeep **bold**, _italic_, ~~strikethrough~~, ||spoilers|| and [ordinary links](https://example.com/docs).\n\nBrowse [GitHub](https://github.com/lapismd/agent-ui) and [Forgejo](https://code.forgejo.org/forgejo/forgejo).\n\n- [x] Preserve exact source\n- [ ] Review keyboard and pointer controls\n\n> References do not dispatch an agent.\n\n| Surface | State |\n| --- | --- |\n| Composer | Ready |\n| Preview | Same source |\n\n\`@Reviewer :lapis:\` stays literal.\n\n\`\`\`typescript\nconst reference = "@Reviewer";\n\`\`\``;
  return { options, sources, records, text };
}
