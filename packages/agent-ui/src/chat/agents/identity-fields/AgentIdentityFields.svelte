<script lang="ts">
  import { agentAvatar } from "../../../identity/agent-avatar.js";
  import { AvatarPicker } from "@lapismd/design-core/forms/avatar-picker";
  import ChatAgentIcon from "../agent-icon/ChatAgentIcon.svelte";
  import { readAgentAvatarImage } from "../avatar-image.js";
  import type { AcpAgentId } from "../../../profiles/acp-agents.js";
  let {
    avatar = $bindable(""),
    avatarBackground = $bindable(""),
    avatarUploads = $bindable(0),
    label,
    agent,
    disabled,
  }: {
    avatar: string;
    avatarBackground: string;
    avatarUploads: number;
    label: string;
    agent: AcpAgentId;
    disabled: boolean;
  } = $props();
  const labels = {
    codex: "Codex",
    cursor: "Cursor",
    opencode: "OpenCode",
    local: "Lapis AI",
  };
</script>

<div class="agent-editor-sidebar">
  <AvatarPicker
    bind:value={
      () => avatar || agentAvatar(agent) || "", (value) => (avatar = value)
    }
    bind:background={avatarBackground}
    name={label || "Agent"}
    label="Edit agent avatar"
    size="2xl"
    shape="rounded"
    {disabled}
    onUploadImage={async (file, signal) => {
      avatarUploads++;
      try {
        return await readAgentAvatarImage(file, signal);
      } finally {
        avatarUploads--;
      }
    }}
  />
  <strong>{label.trim() || "New agent"}</strong>
  <span class="agent-editor-client"
    ><ChatAgentIcon runtimeAgent={agent} />{labels[agent]}</span
  >
  <p>Available to chats in this vault.</p>
</div>

<style>
  .agent-editor-sidebar {
    display: grid;
    align-content: start;
    justify-items: center;
    gap: 0.875rem;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .agent-editor-sidebar strong {
    max-width: 100%;
  }
  .agent-editor-client {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted-foreground);
  }
  .agent-editor-client :global(svg) {
    width: 1rem;
    height: 1rem;
  }
  .agent-editor-sidebar p {
    margin: 0;
    color: var(--muted-foreground);
    font-size: 0.8125rem;
  }
</style>
