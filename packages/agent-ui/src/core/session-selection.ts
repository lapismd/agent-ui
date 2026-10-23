import type { AgentUiController } from "./controller.svelte.js";
export async function selectHostSession(
  owner: AgentUiController,
  id: string,
  closed: () => boolean,
  fail: (cause: unknown) => void,
) {
  const previous = owner.sessionId;
  owner.drafts[previous] = owner.transcript.message;
  owner.actionBusy = true;
  try {
    const snapshot = await owner.port.selectSession!(id);
    if (closed()) return;
    owner.snapshot = snapshot;
    owner.sessionId = id;
    const draft = snapshot.chat?.draft;
    owner.transcript.message = draft?.text ?? owner.drafts[id] ?? "";
    owner.attachments = draft?.attachments ? [...draft.attachments] : [];
    if (draft?.threads)
      owner.transcript.threads = structuredClone(draft.threads);
    owner.screen = "chat";
  } catch (cause) {
    if (!closed()) fail(cause);
  } finally {
    if (!closed()) owner.actionBusy = false;
  }
}

export function selectAgentSession(
  owner: AgentUiController,
  id: string,
  closed: () => boolean,
  fail: (cause: unknown) => void,
) {
  if (closed() || owner.actionBusy || owner.pending || owner.transcript.sending)
    return;
  if (owner.port.selectSession)
    return selectHostSession(owner, id, closed, fail);
  owner.drafts[owner.sessionId] = owner.transcript.message;
  owner.sessionId = id;
  owner.transcript.message = owner.drafts[id] ?? "";
  owner.screen = "chat";
}
