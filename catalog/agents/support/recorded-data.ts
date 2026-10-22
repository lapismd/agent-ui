// Apache-2.0; Desktop's materialized Design Core / jj-store recorded conversation.
import captureUrl from "./reference/design-core-reference.json?url";
import avatar from "./reference/design-core-codex.svg?url";
import FileText from "@lucide/svelte/icons/file-text";
import FilePen from "@lucide/svelte/icons/file-pen";
import Terminal from "@lucide/svelte/icons/terminal";
import Search from "@lucide/svelte/icons/search";
import Wrench from "@lucide/svelte/icons/wrench";
import Folder from "@lucide/svelte/icons/folder";
import Bot from "@lucide/svelte/icons/bot";
import type { Component } from "svelte";
import type {
  TranscriptItem,
  TranscriptCommentThread,
} from "@lapismd/design-core/chat";
const glyphs = {
  "file-text": FileText,
  "file-pen": FilePen,
  terminal: Terminal,
  search: Search,
  wrench: Wrench,
  folder: Folder,
  bot: Bot,
};
export async function recordedConversation(signal?: AbortSignal) {
  const response = await fetch(captureUrl, { signal });
  if (!response.ok)
    throw new Error("Recorded conversation fixture unavailable.");
  const capture: unknown = await response.json();
  const icons: Record<string, Component> = {};
  function restore(value: unknown): unknown {
    if (value === "__CODEX_AVATAR__") return avatar;
    if (Array.isArray(value)) return value.map(restore);
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      if (typeof record.icon === "string" && typeof record.id === "string")
        icons[record.id] = glyphs[record.icon as keyof typeof glyphs];
      return Object.fromEntries(
        Object.entries(record)
          .filter(([key]) => key !== "icon")
          .map(([key, entry]) => [key, restore(entry)]),
      );
    }
    return value;
  }
  const data = restore(capture) as {
    items: TranscriptItem[];
    threads: TranscriptCommentThread[];
  };
  return { ...data, icons };
}
