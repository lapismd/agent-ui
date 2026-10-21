// SPDX-License-Identifier: Apache-2.0
// Retained Lapis AI History; see ../NOTICE.md.
import type { ConversationListEntry } from "./models.js";
import type { ConversationLocation } from "./models.js";
export function entryKey(entry: ConversationListEntry): string {
  return `${entry.location.scopeDir}\u0000${entry.location.conversationId}`;
}

export function sameLocation(
  left: ConversationLocation | null,
  right: ConversationLocation,
): boolean {
  return (
    left?.scopeDir === right.scopeDir &&
    left.conversationId === right.conversationId
  );
}
