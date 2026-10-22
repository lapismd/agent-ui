import type { ApprovalRequest, UserInputRequest } from "./requests.js";
/** Host-observed state; approval does not imply tool execution succeeded. */
export type AgentRequestStatus =
  | "pending"
  | "submitting"
  | "approved"
  | "denied"
  | "answered"
  | "cancelled"
  | "unavailable"
  | "unknown"
  | "refused";
export interface AgentRequestState {
  status: AgentRequestStatus;
  message?: string;
  timestamp?: string;
}
/** Read-only captured presentation. Answer values are deliberately absent. */
export type AgentRequestResult = {
  state: AgentRequestState;
  selectedOptionId?: string;
} & (
  | { kind: "approval"; request: ApprovalRequest }
  | { kind: "question"; request: UserInputRequest }
);
export const requestLabels: Record<AgentRequestStatus, string> = {
  pending: "Response requested",
  submitting: "Submitting response…",
  approved: "Permission granted",
  denied: "Permission denied",
  answered: "Response submitted",
  cancelled: "Request cancelled",
  unavailable: "Request unavailable",
  unknown: "Response outcome unknown",
  refused: "Response was not accepted",
};
export function requestEditable(state: AgentRequestState): boolean {
  return state.status === "pending" || state.status === "refused";
}
