import type { AgentUiController } from "../core/controller.svelte.js";
import type { ConversationListEntry, ConversationLocation } from "./models.js";
import {
  buildConversationHistoryTree,
  conversationHistoryFolderPaths,
} from "./conversation-history-tree.js";
/** History presentation; the host controller retains all conversation effects. */
export class HistoryController {
  query = $state("");
  showArchived = $state(false);
  selectedScope = $state("");
  openScopes = $state(new Set<string>());
  #followedScope?: string;
  #treeSelected = false;
  constructor(readonly owner: () => AgentUiController) {
    this.syncScope();
  }
  syncScope() {
    const path = this.scopeDir;
    if (path === this.#followedScope) return;
    this.#followedScope = path;
    if (this.#treeSelected) return;
    this.selectedScope = path;
    const next = new Set(this.openScopes);
    if (!path) next.add("");
    const segments = path.split("/").filter(Boolean);
    for (let index = 0; index < segments.length; index++)
      next.add(segments.slice(0, index + 1).join("/"));
    this.openScopes = next;
  }
  get scopeDir() {
    return this.owner().snapshot?.chat?.scope ?? "";
  }
  get activeConversation(): ConversationLocation | null {
    return { scopeDir: this.scopeDir, conversationId: this.owner().sessionId };
  }
  get entries(): ConversationListEntry[] {
    const query = this.query.trim().toLocaleLowerCase();
    return (this.owner().snapshot?.sessions ?? [])
      .filter(
        (row) =>
          (this.showArchived || row.status !== "archived") &&
          `${row.title} ${row.agent}`.toLocaleLowerCase().includes(query),
      )
      .map((row) => ({
        location: { scopeDir: row.scope ?? "", conversationId: row.id },
        metadata: {
          title: row.title,
          updatedAt: row.updatedAt,
          status: row.status,
        },
        preview: row.preview,
      }));
  }
  get loading() {
    return this.owner().loading;
  }
  get error() {
    return this.owner().error;
  }
  get folders() {
    return buildConversationHistoryTree(this.entries);
  }
  get folderPaths() {
    return conversationHistoryFolderPaths(this.folders);
  }
  get allFoldersOpen() {
    return (
      this.folderPaths.length > 0 &&
      this.folderPaths.every((path) => this.openScopes.has(path))
    );
  }
  get creationScopeLabel() {
    return this.selectedScope || "Vault root";
  }
  get expandFoldersLabel() {
    return this.allFoldersOpen
      ? "Collapse all conversation folders"
      : "Expand all conversation folders";
  }
  get newChatLabel() {
    return `New chat in ${this.creationScopeLabel}`;
  }
  updateQuery = (value: string) => {
    this.query = value;
  };
  setFolderOpen(path: string, open: boolean) {
    const next = new Set(this.openScopes);
    if (open) next.add(path);
    else next.delete(path);
    this.openScopes = next;
  }
  selectFolder(path: string) {
    this.#treeSelected = true;
    this.selectedScope = path;
  }
  toggleAllFolders = () => {
    this.openScopes = this.allFoldersOpen
      ? new Set()
      : new Set(this.folderPaths);
  };
  async newConversation() {
    const result = await this.owner().action("new_session", undefined, {
      scope: this.selectedScope,
    });
    if (result?.status === "acknowledged")
      this.owner().selectSession(result.snapshot.sessions[0]?.id ?? "");
  }
  async openConversation(location: ConversationLocation) {
    this.owner().selectSession(location.conversationId);
  }
  async setArchived(entry: ConversationListEntry, archived: boolean) {
    await this.owner().action("archive", entry.location.conversationId, {
      archived,
    });
  }
  async remove(entry: ConversationListEntry) {
    await this.owner().action("delete_session", entry.location.conversationId);
  }
}
export type HistoryState = HistoryController;
