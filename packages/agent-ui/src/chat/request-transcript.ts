import type { TranscriptItem } from "@lapismd/design-core/chat";
import CheckIcon from "@lucide/svelte/icons/shield-check";
import DeniedIcon from "@lucide/svelte/icons/shield-x";
import AnswerIcon from "@lucide/svelte/icons/message-circle-check";
import { requestLabels, type AgentRequestResult } from "./request-state.js";

/** Project captured outcomes into the public transcript's native disclosure rows. */
export function requestTranscript(
  items: readonly TranscriptItem[],
  results: Readonly<Record<string, AgentRequestResult>> = {},
): TranscriptItem[] {
  return items.map((item) => {
    if (item.blocks.length !== 1) return item;
    const result = results[item.blocks[0].id];
    if (!result) return item;
    return {
      ...item,
      kind: "context",
      label: `${requestLabels[result.state.status]}: ${result.request.title}`,
      icon:
        result.kind === "question"
          ? AnswerIcon
          : result.state.status === "denied"
            ? DeniedIcon
            : CheckIcon,
      tone: result.state.status === "denied" ? "destructive" : undefined,
      defaultExpanded: false,
    };
  });
}
