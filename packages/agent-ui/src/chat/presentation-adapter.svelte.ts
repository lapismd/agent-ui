import {
  currentAgentRequest,
  dismissCurrentPermission,
} from "../core/request-actions.svelte.js";
import { controllerComposerFeedback } from "./composer-feedback.js";
import type { AgentUiController } from "../core/controller.svelte.js";
import type { SettingsPatch, TranscriptPanelProps } from "./presentation.js";
import { normalizeAcpAgent } from "../profiles/acp-agents.js";
import { agentAvatar } from "../identity/agent-avatar.js";
/** Controller projection only: the extracted UI never reads an App or native service. */
export function createChatPresentation(
  owner: () => AgentUiController,
): TranscriptPanelProps {
  let attachOpen = $state(false),
    scopePickerOpen = $state(false);
  let drawerHost = $state<HTMLElement | null>(null),
    drawerCollapsed = $state(false);
  let model = $state(""),
    thinking = $state("default");
  const recipientOptions = () =>
    (owner().snapshot?.agents ?? []).map((agent) => ({
      id: agent.id,
      label: agent.name,
      agent: normalizeAcpAgent(agent.provider.toLowerCase()),
      model: agent.model,
      description: agent.description,
      avatar: agentAvatar(agent.provider),
      ...agent.profile,
    }));
  const settings = () => ({
    approvalPolicy: owner().snapshot?.chat?.approvalPolicy ?? ("ask" as const),
    automaticallyMentionAgents:
      owner().snapshot?.chat?.automaticallyMentionAgents ?? false,
    agentParticipants: recipientOptions(),
  });
  return {
    panelProps: {
      get initializing() {
        return owner().loading;
      },
      validateParticipants(value) {
        if (!Array.isArray(value)) throw new Error("Invalid agent profiles");
        return value;
      },
      transcriptFrame: true,
      repository: true,
      fileSearch: true,
      selectRuntime: true,
      get settings() {
        return settings();
      },
      async onSettingsChange(patch: SettingsPatch) {
        const outcome = await owner().action(
          "chat_settings",
          undefined,
          {
            ...("approvalPolicy" in patch
              ? { approvalPolicy: patch.approvalPolicy! }
              : {}),
            ...("automaticallyMentionAgents" in patch
              ? {
                  automaticallyMentionAgents: patch.automaticallyMentionAgents!,
                }
              : {}),
          },
          patch.agentParticipants,
        );
        if (outcome?.status !== "acknowledged")
          throw new Error("Settings were not acknowledged.");
      },
      onError(error) {
        owner().error = error?.message ?? "";
      },
    },
    controller: {
      get busy() {
        return owner().busy;
      },
      repository: true,
      get usage() {
        return owner().snapshot?.chat?.usage;
      },
      queuedMessages: {
        get pending() {
          return owner().snapshot?.queued ?? [];
        },
        get saving() {
          return owner().actionBusy;
        },
      },
      cancel: async () => {
        await owner().action("stop");
      },
      respondToApproval: (request, option) =>
        owner().respondToApproval(request, option),
      respondToQuestion: (request, answers) =>
        owner().respondToQuestion(request, answers),
    },
    composerState: {
      get draft() {
        return owner().transcript.message;
      },
      set draft(value) {
        owner().transcript.message = value;
      },
      selectedRuntime: "acp",
      get selectedAgent() {
        return owner().selectedAgent;
      },
      get selectedModel() {
        return (
          model ||
          owner().snapshot?.agents.find((a) => a.id === owner().selectedAgent)
            ?.model ||
          ""
        );
      },
      get selectedThinking() {
        return thinking;
      },
      get contextPercent() {
        const usage = owner().snapshot?.chat?.usage;
        return usage && usage.limit > 0
          ? Math.min(100, Math.round((usage.used / usage.limit) * 100))
          : 0;
      },
      get composerStatus() {
        return controllerComposerFeedback(owner());
      },
      get recipientOptions() {
        return recipientOptions();
      },
      recipients: {
        get selectedIds() {
          return owner().recipients;
        },
      },
      get modelOptions() {
        return [
          ...new Set(owner().snapshot?.agents.map((a) => a.model) ?? []),
        ].map((model) => ({ model }));
      },
      changeAgent(agent) {
        owner().selectedAgent = agent;
        model = "";
      },
      changeModel(value) {
        model = value;
      },
      changeThinking(value) {
        thinking = value;
      },
      insertReference(value) {
        owner().transcript.message += value + " ";
      },
      setAutomaticallyMentionAgents(value) {
        void thisSettings({ automaticallyMentionAgents: value });
      },
      removeRecipient(id) {
        owner().recipients = owner().recipients.filter((value) => value !== id);
      },
      selectRecipient(id) {
        if (owner().recipients.length < 4 && !owner().recipients.includes(id))
          owner().recipients = [...owner().recipients, id];
      },
    },
    attachmentsState: {
      get attachOpen() {
        return attachOpen;
      },
      set attachOpen(value) {
        attachOpen = value;
      },
      attachSideOffset: 8,
      get drawerHost() {
        return drawerHost;
      },
      set drawerHost(value) {
        drawerHost = value;
      },
      get drawerCollapsed() {
        return drawerCollapsed;
      },
      set drawerCollapsed(value) {
        drawerCollapsed = value;
      },
      get requestDrafts() {
        return owner().requests;
      },
      get requestSessionId() {
        return owner().sessionId;
      },
      get requestState() {
        if (!owner().snapshot?.capabilities.includes("respond"))
          return { status: "unavailable" as const };
        return owner().requestFeedback &&
          owner().requestFeedback?.requestId ===
            currentAgentRequest(owner())?.id
          ? owner().requestFeedback!.state
          : { status: "pending" as const };
      },
      get responseDisabled() {
        return owner().actionBusy || !!owner().pending;
      },
      dismissRequest: (id) => dismissCurrentPermission(owner(), id),
      get pendingInteraction() {
        const request = currentAgentRequest(owner());
        if (!request) return;
        return request.kind === "approval"
          ? {
              type: "approval" as const,
              id: request.id,
              request: request.approval ?? {
                id: request.id,
                kind: "other" as const,
                title: request.title,
                details: { description: request.details },
                options: request.options.map((option) => ({
                  ...option,
                  kind: option.kind ?? ("unknown" as const),
                })),
              },
            }
          : {
              type: "question" as const,
              id: request.id,
              request: request.question ?? {
                id: request.id,
                title: request.title,
                questions: [
                  {
                    id: request.id,
                    header: "Question",
                    prompt: request.title,
                    options: request.options,
                    allowOther: true,
                    secret: false,
                  },
                ],
              },
            };
      },
      get attachItems() {
        return owner().snapshot?.chat?.files ?? [];
      },
      get attachments() {
        return owner().attachments.map((path) => ({
          path,
          name: path.split("/").at(-1) ?? path,
        }));
      },
      onAttachOpenChange(value) {
        attachOpen = value;
      },
      addAttachment(file) {
        if (!owner().attachments.includes(file.id))
          owner().attachments = [...owner().attachments, file.id];
        attachOpen = false;
      },
      removeAttachment(path) {
        owner().attachments = owner().attachments.filter(
          (value) => value !== path,
        );
      },
    },
    conversationsState: {
      get scopePickerOpen() {
        return scopePickerOpen;
      },
      set scopePickerOpen(value) {
        scopePickerOpen = value;
      },
      get scopePathLabel() {
        return owner().snapshot?.chat?.scope || "Vault root";
      },
      get scopeFolders() {
        return owner().snapshot?.chat?.scopes ?? [""];
      },
      onScopePickerOpenChange(value) {
        scopePickerOpen = value;
      },
      async changeConversationScope(scope) {
        await owner().action("chat_settings", undefined, { scope });
        scopePickerOpen = false;
      },
    },
    actions: {
      async perform(action) {
        return action();
      },
      formatTokenCount(count) {
        return Intl.NumberFormat("en", { notation: "compact" }).format(count);
      },
    },
  };
  async function thisSettings(patch: SettingsPatch) {
    await owner().action("chat_settings", undefined, {
      automaticallyMentionAgents: patch.automaticallyMentionAgents!,
    });
  }
}
