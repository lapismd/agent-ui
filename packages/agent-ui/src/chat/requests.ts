// SPDX-License-Identifier: Apache-2.0
// App-owned contracts recovered from the pre-controller AI plugin; see NOTICE.md.

export type ApprovalKind = "read" | "write" | "execute" | "network" | "other";

export type ApprovalOptionKind =
  | "allow-once"
  | "allow-session"
  | "allow-always"
  | "deny-once"
  | "deny-always"
  | "unknown";

export type ApprovalOption = {
  id: string;
  label: string;
  kind: ApprovalOptionKind;
  /** Explicit host scope; never inferred from allow-always or provider IDs. */
  scopeLabel?: string;
};

export type ApprovalRequest = {
  id: string;
  kind: ApprovalKind;
  title: string;
  origin?: "runtime" | "app-tool";
  tool?: {
    name: string;
    input?: unknown;
  };
  options: ApprovalOption[];
  details?: {
    description?: string;
    path?: string;
    diff?: string;
    resources?: { path: string; kind?: "file" | "folder"; access: string }[];
    command?: string;
    raw?: string;
  };
  metadata?: Record<string, unknown>;
};

export type UserInputOption = {
  id: string;
  label: string;
  description?: string;
  /** Exact host response value; legacy callers use the label. */
  value?: string;
};

export type UserInputQuestion = {
  id: string;
  header: string;
  prompt: string;
  options?: UserInputOption[];
  allowOther: boolean;
  secret: boolean;
  description?: string;
  selectionMode?: "single" | "multiple";
  /** Decorative option labels; defaults to letters. Never changes answer identity. */
  optionLabels?: "letters" | "numbers" | "none";
  inputMode?: "text" | "textarea";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
};

export type UserInputRequest = {
  id: string;
  title: string;
  questions: UserInputQuestion[];
};

export type UserInputAnswers = Record<string, string[]>;
