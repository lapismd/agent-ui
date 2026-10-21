// SPDX-License-Identifier: Apache-2.0; Lapis Desktop chat-time.ts.
export function formatChatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
