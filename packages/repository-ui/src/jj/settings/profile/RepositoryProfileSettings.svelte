<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreProfileSettings. -->
<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Switch } from "@lapismd/design-core/shadcn/switch";
  import { MarkdownComposer } from "@lapismd/design-core/chat";
  import UserIcon from "@lucide/svelte/icons/user";
  import FileTextIcon from "@lucide/svelte/icons/file-text";
  import MailIcon from "@lucide/svelte/icons/mail";
  import FingerprintIcon from "@lucide/svelte/icons/fingerprint";
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import RepositorySettingsPage from "../settings-page/RepositorySettingsPage.svelte";
  import StoreSettingsCard from "../settings-card/RepositorySettingsCard.svelte";
  import StoreSettingsFooter from "../settings-card/RepositorySettingsFooter.svelte";
  import StoreReadOnlyRow from "../read-only-row/RepositoryReadOnlyRow.svelte";
  import StoreDirectoryField from "../settings-card/RepositorySettingsField.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import AvatarRow from "./RepositoryProfileAvatar.svelte";
  import type { RepositoryProfileController } from "./controller.js";
  import "./profile-settings.css";
  let { controller }: { controller: RepositoryProfileController } = $props();
  let model = $state(untrack(() => controller.state)),
    editing = $state(false);
  onMount(() => controller.subscribe((value) => (model = value)));
  const draft = $derived(model.draft);
  const disabled = $derived(model.busy || model.loading || !!model.pending);
  const avatar = $derived(
    draft?.avatar
      ? (model.images[draft.avatar] ?? draft.avatar)
      : model.profile?.details.avatar
        ? ""
        : (model.profile?.avatarUrl ?? ""),
  );
  const dirty = $derived(
    !!model.profile &&
      JSON.stringify(draft) !== JSON.stringify(model.profile.details),
  );
  $effect(() => {
    if (model.outcome === "saved") editing = false;
  });
</script>

<RepositorySettingsPage title="Profile" Icon={UserIcon}>
  <section class="store-directory-settings" aria-label="Profile details">
    {#if !model.profile && model.error}<Empty.Root
        ><Empty.Header>
          <Empty.Media variant="icon"
            ><UserIcon aria-hidden="true" /></Empty.Media
          >
          <Empty.Title>Profile unavailable</Empty.Title>
          <Empty.Description
            >Your local profile could not be read. Your saved identity is
            unchanged.</Empty.Description
          >
        </Empty.Header><Empty.Content
          ><Button onclick={() => void controller.open()}>Retry profile</Button
          ></Empty.Content
        ></Empty.Root
      >
    {:else if !model.profile || !draft}<RepositorySkeleton
        kind="operation"
        label="Loading profile"
      />
    {:else}
      <form
        onsubmit={(event) => {
          event.preventDefault();
          void controller.save();
        }}
      >
        <StoreSettingsCard
          id="profile-info"
          title="Profile info"
          description="Your public details and private contact preference."
          Icon={UserIcon}
        >
          <Field.Group class="store-settings__editable-rows">
            <AvatarRow
              {controller}
              {avatar}
              name={draft.display_name}
              {disabled}
            />
            {#if editing}
              <StoreDirectoryField
                id="profile-display-name"
                label="Display name"
                Icon={UserIcon}
              >
                <Input
                  id="profile-display-name"
                  name="display-name"
                  autocomplete="name"
                  value={draft.display_name}
                  oninput={(event) =>
                    controller.edit("display_name", event.currentTarget.value)}
                  {disabled}
                  maxlength={256}
                />
              </StoreDirectoryField>
              <StoreDirectoryField
                label="Profile description"
                Icon={FileTextIcon}
                description="Tell others about yourself. Markdown is supported."
              >
                <MarkdownComposer
                  bind:value={
                    () => draft.description,
                    (value: string) => controller.edit("description", value)
                  }
                  presentation="document"
                  label="Profile description"
                  inputLabel="Profile description"
                  {disabled}
                  showSendButton={false}
                  showHint={false}
                  onSubmit={() => void controller.save()}
                />
              </StoreDirectoryField>
              <StoreDirectoryField
                id="profile-email"
                label="Email"
                Icon={MailIcon}
                description="Private; used only for your optional Gravatar preference."
              >
                <Input
                  id="profile-email"
                  name="profile-email"
                  autocomplete="email"
                  spellcheck={false}
                  type="email"
                  value={draft.email ?? ""}
                  oninput={(event) =>
                    controller.edit("email", event.currentTarget.value || null)}
                  {disabled}
                  maxlength={254}
                />
              </StoreDirectoryField>
            {/if}
          </Field.Group>
          {#if !editing}<dl class="store-settings__rows">
              <StoreReadOnlyRow
                label="Display name"
                Icon={UserIcon}
                value={draft.display_name}
                emptyLabel="Not set"
              />
              <StoreReadOnlyRow
                label="Profile description"
                Icon={FileTextIcon}
                value={draft.description}
                emptyLabel="Not set"
              />
              <StoreReadOnlyRow
                label="Email"
                Icon={MailIcon}
                value={draft.email}
                emptyLabel="Not set"
                description="Private; Gravatar is optional."
              />
            </dl>{/if}
          <Field.Group class="store-settings__editable-rows">
            <StoreDirectoryField
              id="profile-gravatar"
              label="Use Gravatar"
              Icon={MailIcon}
              description="Allow Gravatar for this email when no profile photo is selected."
            >
              <Switch
                id="profile-gravatar"
                checked={draft.gravatar}
                onCheckedChange={(value) => controller.edit("gravatar", value)}
                {disabled}
              />
            </StoreDirectoryField>
          </Field.Group>
          <dl class="store-settings__rows">
            <StoreReadOnlyRow
              label="Identity"
              copyLabel="Principal ID"
              Icon={FingerprintIcon}
              value={model.profile.principal}
              copyable
            />
          </dl>
          <StoreSettingsFooter>
            {#if model.conflict}<Button
                type="button"
                variant="outline"
                {disabled}
                onclick={() => controller.rebase()}
                >Use my draft with the current version</Button
              >{/if}
            {#if !editing}<Button
                type="button"
                variant="outline"
                disabled={disabled || model.conflict}
                onclick={() => (editing = true)}
                ><PencilIcon aria-hidden="true" />Edit</Button
              >{/if}
            {#if editing || dirty}<Button
                type="button"
                variant="outline"
                {disabled}
                onclick={() => {
                  void controller.cancel();
                  editing = false;
                }}>Cancel</Button
              >
              <Button
                type="submit"
                disabled={!dirty || disabled || model.conflict}
                >{model.busy ? "Saving…" : "Save profile"}</Button
              >{/if}
          </StoreSettingsFooter>
          {#if model.conflict}<StoreSettingsFooter
              ><p>
                Your profile changed elsewhere. Your draft is retained; review
                it against the current version before saving.
              </p></StoreSettingsFooter
            >{/if}
          {#if model.pending}<StoreSettingsFooter>
              {#snippet description()}<p>
                  Save outcome unknown. Your original request and draft are
                  retained.
                </p>{/snippet}
              <Button
                type="button"
                variant="outline"
                disabled={model.busy}
                onclick={() => void controller.inspect()}
                >Check save status</Button
              >
              {#if model.outcome === "not-known"}<Button
                  type="button"
                  disabled={model.busy}
                  onclick={() => void controller.retry()}
                  >Retry original save</Button
                >{/if}
            </StoreSettingsFooter>{/if}
        </StoreSettingsCard>
      </form>
    {/if}
  </section>
</RepositorySettingsPage>
