<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store CommunityAgentEditorDialog. -->
<script lang="ts">
  import { untrack, onMount } from "svelte";
  import { DialogFrame } from "@lapismd/design-core/forms/dialog";
  import { AvatarPicker } from "@lapismd/design-core/forms/avatar-picker";
  import { MarkdownComposer } from "@lapismd/design-core/chat";
  import * as Dialog from "@lapismd/design-core/shadcn/dialog";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import * as Select from "@lapismd/design-core/shadcn/select";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ChatAgentModelSelect from "../../chat/agents/agent-model-select/ChatAgentModelSelect.svelte";
  import type { AgentDirectoryController } from "../logic/controller.js";
  import type { ConfiguredAgent } from "../logic/types.js";
  let {
    controller,
    initial,
    onClose,
    onError,
  }: {
    controller: AgentDirectoryController;
    initial?: ConfiguredAgent;
    onClose(): void;
    onError(error: unknown): void;
  } = $props();
  let open = $state(true),
    ready = $state(false),
    saving = $state(false);
  const key = untrack(() => initial?.id ?? "new");
  let draft = $state<ConfiguredAgent>(
    untrack(() =>
      structuredClone(
        $state.snapshot(
          initial ?? {
            id: crypto.randomUUID(),
            version: "",
            name: "",
            client:
              controller.state.page?.clients.find((c) => c.available)?.id ?? "",
            model: "",
            description: "",
            instructions: "",
            avatar: "",
          },
        ),
      ),
    ),
  );
  const id = $props.id();
  const invalid = $derived(
    !draft.name.trim() ||
      draft.name.length > 128 ||
      [...draft.description].length > 280 ||
      new TextEncoder().encode(draft.instructions).length > 32768 ||
      !draft.client,
  );
  onMount(() => {
    let disposed = false;
    void controller
      .draft(key)
      .then((saved) => {
        if (!disposed) {
          if (saved) draft = saved;
          ready = true;
        }
      })
      .catch(onError);
    return () => {
      disposed = true;
    };
  });
  let queued = Promise.resolve();
  let latest = $state<ConfiguredAgent>();
  onMount(() =>
    controller.subscribe((state) => {
      if (state.page)
        latest = state.page.agents.find((agent) => agent.id === draft.id);
    }),
  );
  const conflict = $derived(!!latest && latest.version !== draft.version);
  $effect(() => {
    if (!open) void queued.then(onClose);
  });
  $effect(() => {
    if (!ready || saving) return;
    const value = $state.snapshot(draft);
    queued = controller
      .draft(key, value)
      .then(() => {})
      .catch(onError);
  });
  async function save(event: SubmitEvent) {
    event.preventDefault();
    if (!ready || saving || invalid || conflict) return;
    saving = true;
    await queued;
    if (
      await controller.submit({
        kind: "save-agent",
        agent: $state.snapshot(draft),
      })
    ) {
      try {
        await controller.draft(key, null);
        open = false;
      } catch (error) {
        onError(error);
      }
    }
    saving = false;
  }
</script>

<Dialog.Root bind:open>
  <DialogFrame
    title={initial ? "Edit agent" : "Add agent"}
    description="Manage agent presentation, saved instructions, and runtime defaults."
    descriptionHidden
    size="large"
    surface="inset"
    busy={saving}
    closeLabel="Close agent editor"
  >
    {#snippet sidebar()}<div class="agent-editor-sidebar">
        <AvatarPicker
          name={draft.name || "Agent"}
          value={draft.avatar ?? ""}
          onValueChange={(value) => (draft.avatar = value)}
          label="Choose agent image"
          size="2xl"
          shape="rounded"
          disabled={!ready || saving}
        /><strong>{draft.name || "New agent"}</strong>
        <p>Available to chats on this device.</p>
      </div>{/snippet}
    <form id={`${id}-form`} aria-label="Agent configuration" onsubmit={save}>
      <Field.Group>
        {#if conflict && latest}<Field.Field>
            <Field.Error
              >Agent configuration changed while this form was open. Your draft
              is retained.</Field.Error
            >
            <Button
              variant="outline"
              disabled={saving}
              onclick={() => {
                if (latest) draft.version = latest.version;
              }}>Keep draft and use latest version</Button
            >
          </Field.Field>{/if}
        <Field.Field
          ><Field.Label for={`${id}-name`}>Agent name</Field.Label><Input
            id={`${id}-name`}
            bind:value={draft.name}
            maxlength={128}
            required
            disabled={!ready || saving}
          /></Field.Field
        >
        <Field.Field
          ><Field.Label>Description <span>Optional</span></Field.Label
          ><MarkdownComposer
            bind:value={draft.description}
            label="Description composer"
            inputLabel="Description"
            placeholder="What this agent does, in a sentence"
            showSendButton={false}
            showHint={false}
            submitOnEnter={false}
            onSubmit={() => {}}
            disabled={!ready || saving}
          /><Field.Description>Up to 280 characters.</Field.Description
          ></Field.Field
        >
        <Field.Field
          ><Field.Label>Agent instructions</Field.Label><MarkdownComposer
            bind:value={draft.instructions}
            label="Agent instructions composer"
            inputLabel="Agent instructions"
            placeholder="Describe how this agent should work."
            showSendButton={false}
            showHint={false}
            submitOnEnter={false}
            onSubmit={() => {}}
            disabled={!ready || saving}
          /><Field.Description
            >Used with the first prompt of future sessions. Existing sessions
            retain their original instructions.</Field.Description
          ></Field.Field
        >
        <Field.Field
          ><Field.Label for={`${id}-client`}>Agent harness</Field.Label
          ><Select.Root
            type="single"
            bind:value={draft.client}
            disabled={!ready || saving}
            ><Select.Trigger id={`${id}-client`}
              >{controller.state.page?.clients.find(
                (c) => c.id === draft.client,
              )?.label ?? "Select a harness"}</Select.Trigger
            ><Select.Content
              ><Select.Group
                >{#each controller.state.page?.clients ?? [] as client (client.id)}<Select.Item
                    value={client.id}
                    label={client.label}
                    disabled={!client.available}
                    >{client.label}{!client.available
                      ? " · unavailable"
                      : ""}</Select.Item
                  >{/each}</Select.Group
              ></Select.Content
            ></Select.Root
          ></Field.Field
        >
        <Field.Field
          ><Field.Label for={`${id}-model`}>Model</Field.Label
          ><ChatAgentModelSelect
            id={`${id}-model`}
            bind:value={
              () => draft.model || null, (value) => (draft.model = value ?? "")
            }
            options={[]}
            allowCustom
            defaultLabel="Harness default model"
            disabled={!ready || saving}
          /></Field.Field
        >
        <Field.Description
          >Saving applies to future messages. Queued messages keep their
          captured settings.</Field.Description
        >
      </Field.Group>
    </form>
    {#snippet footer()}<Button
        variant="outline"
        disabled={saving}
        onclick={() => (open = false)}>Cancel</Button
      ><Button
        type="submit"
        form={`${id}-form`}
        disabled={!ready ||
          conflict ||
          saving ||
          invalid ||
          controller.state.writing ||
          !!controller.state.pending.length}
        >{saving ? "Saving…" : "Save agent"}</Button
      >{/snippet}
  </DialogFrame>
</Dialog.Root>

<style>
  .agent-editor-sidebar {
    display: grid;
    align-content: start;
    justify-items: center;
    gap: 0.875rem;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .agent-editor-sidebar p {
    margin: 0;
    color: var(--muted-foreground);
    font-size: 0.8125rem;
  }
</style>
