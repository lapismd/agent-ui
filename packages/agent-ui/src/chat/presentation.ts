export type * from "./presentation-models.js";
import type { ApprovalPolicy } from "./presentation-models.js";
export const APPROVAL_POLICIES = [
  {
    value: "ask",
    label: "Ask for approval",
    description: "Review actions that need approval.",
  },
  {
    value: "allow-all",
    label: "Approve for me",
    description: "Approve offered one-time permissions.",
  },
] as const;
export function normalizeApprovalPolicy(value: unknown): ApprovalPolicy {
  return value === "allow-all" ? "allow-all" : "ask";
}
export function formatDirectoryContextLabel(folder: string): string {
  return folder || "Vault root";
}

export function isApprovalPolicy(value: unknown): value is ApprovalPolicy {
  return value === "ask" || value === "allow-all";
}
