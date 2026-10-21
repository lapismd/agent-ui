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
  };
  metadata?: Record<string, unknown>;
};

export type UserInputOption = {
  id: string;
  label: string;
  description?: string;
};

export type UserInputQuestion = {
  id: string;
  header: string;
  prompt: string;
  options?: UserInputOption[];
  allowOther: boolean;
  secret: boolean;
};

export type UserInputRequest = {
  id: string;
  title: string;
  questions: UserInputQuestion[];
};

export type UserInputAnswers = Record<string, string[]>;
