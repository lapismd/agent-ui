import type { AgentUiController } from "../core/controller.svelte.js";
import type { CatalogGroup, CatalogToolRow } from "./types.js";
import {
  collectCatalogExpandableKeys,
  collectCatalogFolderKeys,
  isCatalogFolderKey,
} from "./tree.js";
import { filterCatalogGroups } from "./filter.js";
export class CatalogController {
  query = $state("");
  openedCatalogPath = $state("");
  expanded = $state(new Set<string>());
  pendingTools = $state(new Set<string>());
  #defaultsApplied = false;
  constructor(readonly owner: () => AgentUiController) {}
  applyDefaults() {
    if (!this.#defaultsApplied && this.groups.length) {
      this.expanded = new Set(collectCatalogFolderKeys(this.groups));
      this.#defaultsApplied = true;
    }
  }
  get groups(): CatalogGroup[] {
    if (this.owner().snapshot?.catalogGroups)
      return this.owner().snapshot!.catalogGroups!;
    const rows = this.owner().snapshot?.catalog ?? [];
    return [
      {
        id: "ai",
        label: "Lapis AI",
        kind: "plugin",
        diagnostics: [],
        tools: rows
          .filter((row) => row.kind === "tool")
          .map((row) => ({
            kind: "tool",
            name: row.name,
            description: row.description,
            effect: "read",
            pluginId: "ai",
            enabled: row.enabled,
            owner: { id: "ai", source: "official" },
          })),
        commands: rows
          .filter((row) => row.kind === "command")
          .map((row) => ({
            kind: "command",
            name: row.name.replace(/^\//, ""),
            description: row.description,
            source: "vault",
            path: `Commands/${row.id}.md`,
          })),
        skills: rows
          .filter((row) => row.kind === "skill")
          .map((row) => ({
            kind: "skill",
            name: row.name,
            description: row.description,
            source: "vault",
            path: `Skills/${row.id}/SKILL.md`,
            shadowed: false,
            userInvocable: true,
          })),
      },
    ].filter(
      (group) =>
        group.tools.length + group.commands.length + group.skills.length > 0,
    ) as CatalogGroup[];
  }
  get visibleGroups() {
    return filterCatalogGroups(this.groups, this.query);
  }
  get loading() {
    return this.owner().loading;
  }
  get error() {
    return this.owner().error;
  }
  get filtering() {
    return Boolean(this.query.trim());
  }
  get expandableKeys() {
    return collectCatalogExpandableKeys(this.visibleGroups);
  }
  get allExpanded() {
    return (
      this.expandableKeys.length > 0 &&
      this.expandableKeys.every(
        (key) =>
          (this.filtering && isCatalogFolderKey(key)) || this.expanded.has(key),
      )
    );
  }
  isOpen(key: string) {
    return (
      (this.filtering && isCatalogFolderKey(key)) || this.expanded.has(key)
    );
  }
  setOpen(key: string, open: boolean) {
    const next = new Set(this.expanded);
    if (open) next.add(key);
    else next.delete(key);
    this.expanded = next;
  }
  toggleAll = () => {
    this.expanded = this.allExpanded ? new Set() : new Set(this.expandableKeys);
  };
  async toggleTool(tool: CatalogToolRow, enabled: boolean) {
    if (this.pendingTools.has(tool.name) || tool.enabled === enabled) return;
    this.pendingTools = new Set([...this.pendingTools, tool.name]);
    try {
      const row = this.owner().snapshot?.catalog.find(
        (row) => row.name === tool.name,
      );
      await this.owner().action("toggle_catalog", row?.id ?? tool.name);
    } finally {
      this.pendingTools = new Set(
        [...this.pendingTools].filter((name) => name !== tool.name),
      );
    }
  }
  async openCatalogFile(path: string) {
    const result = await this.owner().action("open_catalog_file", path);
    if (result?.status === "acknowledged") this.openedCatalogPath = path;
  }
}
/** Hosts may retain native registry admission and subscriptions. */
export type CatalogState = Omit<
  CatalogController,
  "owner" | "expanded" | "applyDefaults"
> & {
  applyDefaults?(): void;
};
