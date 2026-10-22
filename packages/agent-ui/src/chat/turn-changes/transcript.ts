import type { TranscriptItem } from "@lapismd/design-core/chat";
import type { AiTurnRecord } from "./models.js";
/** Copy of Desktop's immutable turn-boundary insertion, using normalized message IDs. */
export function historyTranscript(
  items: readonly TranscriptItem[],
  records: readonly AiTurnRecord[],
): TranscriptItem[] {
  const after = new Map<number, AiTurnRecord[]>();
  for (const record of records) {
    if (record.phase === "running") continue;
    let index = -1;
    items.forEach((item, position) => {
      if (
        record.afterItemId
          ? item.id === record.afterItemId
          : item.turn?.id === record.context.message ||
            item.id === record.context.message
      )
        index = position;
    });
    if (index < 0) index = items.length - 1;
    after.set(index, [...(after.get(index) ?? []), record]);
  }
  const row = (record: AiTurnRecord): TranscriptItem => ({
    id: `history/${record.context.turn}`,
    kind: "context",
    label: "Saved file changes",
    defaultExpanded: true,
    blocks: [
      {
        id: `history/${record.context.turn}`,
        revision: record.after?.commit ?? "incomplete",
        kind: "custom",
        surface: "plain",
        text: "",
        label: "Saved file changes",
        commentable: false,
      },
    ],
  });
  return [
    ...(after.get(-1) ?? []).map(row),
    ...items.flatMap((item, index) => [
      item,
      ...(after.get(index) ?? []).map(row),
    ]),
  ];
}
