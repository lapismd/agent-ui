import type {
  UserInputAnswers,
  UserInputQuestion,
  UserInputRequest,
} from "./requests.js";
export interface AgentRequestDraft {
  selections: Record<string, string[]>;
  text: Record<string, string>;
  other: Record<string, boolean>;
  optionId?: string;
}
const empty: AgentRequestDraft = { selections: {}, text: {}, other: {} };
/** Host-owned transient drafts. No storage, dispatch or mount-time effects. */
export class AgentRequestController {
  drafts = $state<Record<string, AgentRequestDraft>>({});
  key(session: string, request: string) {
    return JSON.stringify([session, request]);
  }
  get(session: string, request: string): AgentRequestDraft {
    return this.drafts[this.key(session, request)] ?? empty;
  }
  private update(
    session: string,
    request: string,
    patch: Partial<AgentRequestDraft>,
  ) {
    const key = this.key(session, request);
    this.drafts = {
      ...this.drafts,
      [key]: { ...this.get(session, request), ...patch },
    };
  }
  permission(session: string, request: string, optionId: string) {
    this.update(session, request, { optionId });
  }
  select(
    session: string,
    request: string,
    question: UserInputQuestion,
    optionId: string,
  ) {
    if (!question.options?.some((option) => option.id === optionId)) return;
    const draft = this.get(session, request);
    const before = draft.selections[question.id] ?? [];
    const values =
      question.selectionMode === "multiple"
        ? before.includes(optionId)
          ? before.filter((id) => id !== optionId)
          : [...before, optionId]
        : [optionId];
    this.update(session, request, {
      selections: { ...draft.selections, [question.id]: values },
      other:
        question.selectionMode === "multiple"
          ? draft.other
          : { ...draft.other, [question.id]: false },
    });
  }
  chooseOther(session: string, request: string, question: UserInputQuestion) {
    if (!question.allowOther) return;
    const draft = this.get(session, request);
    this.update(session, request, {
      selections:
        question.selectionMode === "multiple"
          ? draft.selections
          : { ...draft.selections, [question.id]: [] },
      other: { ...draft.other, [question.id]: !draft.other[question.id] },
    });
  }
  text(session: string, request: string, question: string, value: string) {
    const draft = this.get(session, request);
    this.update(session, request, {
      text: { ...draft.text, [question]: value },
    });
  }
  clear(session: string, request: string) {
    const next = { ...this.drafts };
    delete next[this.key(session, request)];
    this.drafts = next;
  }
  close() {
    this.drafts = {};
  }
}
export function questionAnswers(
  request: UserInputRequest,
  draft: AgentRequestDraft,
): UserInputAnswers {
  return Object.fromEntries(
    request.questions.map((question) => {
      const selected = draft.selections[question.id] ?? [];
      const values = (question.options ?? [])
        .filter((option) => selected.includes(option.id))
        .map((option) => option.value ?? option.label);
      if (
        !question.options?.length ||
        (question.allowOther && draft.other[question.id])
      ) {
        const text = draft.text[question.id]?.trim();
        if (text) values.push(text);
      }
      return [question.id, values];
    }),
  );
}
export function questionsComplete(
  request: UserInputRequest,
  draft: AgentRequestDraft,
): boolean {
  const answers = questionAnswers(request, draft);
  return request.questions.every((question) => {
    const selected = draft.selections[question.id] ?? [];
    return (
      (question.required === false ||
        (answers[question.id]?.length ?? 0) > 0) &&
      (question.selectionMode === "multiple" || selected.length <= 1) &&
      selected.every((id) =>
        question.options?.some((option) => option.id === id),
      ) &&
      (!draft.other[question.id] ||
        (question.allowOther && !!draft.text[question.id]?.trim())) &&
      (question.maxLength === undefined ||
        (draft.text[question.id]?.length ?? 0) <= question.maxLength)
    );
  });
}
