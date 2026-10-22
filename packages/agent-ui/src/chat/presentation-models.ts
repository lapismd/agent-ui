import type { ComponentProps, Snippet } from "svelte";
import type { AvatarIdentity } from "@lapismd/design-core/shadcn/avatar";
import type {
  ComposerStatus,
  MarkdownComposer,
  TranscriptController,
} from "@lapismd/design-core/chat";
export type ApprovalPolicy = "ask" | "allow-all";
export type {
  AgentRecipientOption,
  ComposerPersonOption,
} from "../profiles/recipients.js";
import type { AgentRecipientOption } from "../profiles/recipients.js";
export type { AgentProfileEditorContext } from "../profiles/context.js";
import type { AgentProfileEditorContext } from "../profiles/context.js";
export type SettingsPatch = Partial<
  import("../profiles/preferences.js").ChatProfilePreferences
>;
export type AiChatPanelProps = AgentProfileEditorContext & {
  transcriptFrame?: boolean;
  repository?: boolean;
  fileSearch?: boolean;
  selectRuntime?: boolean;
};
export type ComposerState = {
  draft: string;
  selectedRuntime: string;
  selectedAgent: string;
  selectedModel: string;
  selectedThinking: string;
  contextPercent: number;
  composerStatus?: ComposerStatus;
  recipientOptions: readonly AgentRecipientOption[];
  recipients: { selectedIds: readonly string[] };
  catalogState?: { loading: boolean };
  modelOptions: { model: string; displayName?: string; badges?: string[] }[];
  changeAgent(agent: string, runtime: string): void;
  changeModel(model: string): void;
  changeThinking(thinking: string): void;
  insertReference(value: string): void;
  setAutomaticallyMentionAgents(value: boolean): void;
  removeRecipient(id: string): void;
  selectRecipient(id: string): void;
};
export type FileOption = { id: string; label: string };
export type AttachmentsState = {
  attachOpen: boolean;
  attachSideOffset: number;
  attachItems: FileOption[];
  attachments: { path: string; name: string }[];
  drawerHost: HTMLElement | null;
  drawerCollapsed: boolean;
  requestDrafts?: import("./request-controller.svelte.js").AgentRequestController;
  requestSessionId?: string;
  requestState?: import("./request-state.js").AgentRequestState;
  /** Dismiss only the exact local prompt without a host decision. */
  dismissRequest?: (itemId: string) => void;
  responseDisabled?: boolean;
  pendingInteraction?:
    | {
        type: "approval";
        id: string;
        request: import("./requests.js").ApprovalRequest;
      }
    | {
        type: "question";
        id: string;
        request: import("./requests.js").UserInputRequest;
      };
  onAttachOpenChange(open: boolean): void;
  addAttachment(item: FileOption): void;
  removeAttachment(path: string): void;
};
export type AiChatController = {
  busy: boolean;
  repository: boolean;
  queuedMessages: { pending: readonly unknown[]; saving: boolean };
  usage?: { used: number; limit: number };
  cancel(): Promise<void>;
  respondToApproval(
    request: string,
    option: string,
    item: string,
  ): Promise<unknown>;
  respondToQuestion(
    request: string,
    answers: import("./requests.js").UserInputAnswers,
    item: string,
  ): Promise<unknown>;
};
export type ChatPanelActions = {
  perform<T>(action: () => T | Promise<T>): Promise<T>;
  formatTokenCount(count: number): string;
};
export type ConversationsState = {
  scopePickerOpen: boolean;
  scopePathLabel: string;
  scopeFolders: string[];
  onScopePickerOpenChange(open: boolean): void;
  changeConversationScope(folder: string): Promise<void>;
};
export type TranscriptPanelProps = {
  panelProps: AiChatPanelProps;
  controller: AiChatController;
  composerState: ComposerState;
  attachmentsState: AttachmentsState;
  conversationsState: ConversationsState;
  actions: ChatPanelActions;
};
export type ChatSessionContent = {
  avatars: AvatarIdentity[];
  extensions?: ComponentProps<typeof MarkdownComposer>["extensions"];
  state: TranscriptController;
};
