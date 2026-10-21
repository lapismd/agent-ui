// SPDX-License-Identifier: Apache-2.0; Lapis Desktop presentation contracts.
export type AiThinkingLevel = "default" | "off" | "low" | "medium" | "high";
export type ModelRef = {
  provider: string;
  model: string;
  displayName?: string;
  badges?: string[];
  description?: string;
  isDefault?: boolean;
  supportedThinking?: AiThinkingLevel[];
};
