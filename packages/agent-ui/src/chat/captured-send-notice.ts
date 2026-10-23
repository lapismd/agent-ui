import type {
  TranscriptItem,
  TranscriptSubmission,
} from "@lapismd/design-core/chat";

export interface CapturedSendFailure {
  session: string;
  submission: TranscriptSubmission;
  reason: string;
  capturedNoticeId?: string;
}

/** Only newly captured, exact error text may represent this send's refusal. */
export function capturedSendNotice(
  items: readonly TranscriptItem[],
  previous: ReadonlySet<string>,
  reason: string,
): string | undefined {
  return items.find(
    (item) =>
      !previous.has(item.id) &&
      item.notice === "error" &&
      item.blocks.some((block) => block.text === reason),
  )?.id;
}
