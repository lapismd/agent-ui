// SPDX-License-Identifier: Apache-2.0
// Retained Lapis AI policy; see ../NOTICE.md.

export type CatalogGroupKind = "plugin" | "folders" | "user" | "diagnostics";

export interface CatalogToolRow {
  kind: "tool";
  name: string;
  description: string;
  effect: string;
  pluginId: string;
  enabled: boolean;
  owner: { id: string; source: string };
}

export interface CatalogCommandRow {
  kind: "command";
  name: string;
  description: string;
  source: string;
  path?: string;
}

export interface CatalogSkillRow {
  kind: "skill";
  name: string;
  description: string;
  source: string;
  path?: string;
  pluginId?: string;
  shadowed: boolean;
  userInvocable: boolean;
}

export interface CatalogDiagnosticRow {
  path: string;
  message: string;
}

export interface CatalogGroup {
  id: string;
  label: string;
  kind: CatalogGroupKind;
  tools: CatalogToolRow[];
  commands: CatalogCommandRow[];
  skills: CatalogSkillRow[];
  diagnostics: CatalogDiagnosticRow[];
}
