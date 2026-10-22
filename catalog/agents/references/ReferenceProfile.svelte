<script lang="ts">
  import {
    Avatar,
    avatarIdentityProps,
  } from "@lapismd/design-core/shadcn/avatar";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import MessageIcon from "@lucide/svelte/icons/message-circle";
  import HandIcon from "@lucide/svelte/icons/hand";
  import type { ChatReference } from "@lapismd/design-core/chat";
  let { reference }: { reference: ChatReference } = $props();
</script>

<div class="profile">
  <div class="identity">
    {#if reference.avatar}<Avatar
        {...avatarIdentityProps(reference.avatar)}
        size="lg"
      />{/if}
    <span
      ><strong>{reference.label}</strong><small>@repository principal</small
      ></span
    >
  </div>
  <p class="role">Reviewer</p>
  <p>{reference.description}</p>
  <div class="actions">
    <Button variant="ghost" size="sm" disabled
      ><MessageIcon aria-hidden="true" />Message</Button
    >
    <Button variant="ghost" size="sm" disabled
      ><HandIcon aria-hidden="true" />Wave</Button
    >
  </div>
</div>

<style>
  .profile {
    display: grid;
    gap: 0.625rem;
  }
  .identity {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .identity span {
    display: grid;
    gap: 0.125rem;
  }
  small,
  .role {
    color: var(--muted-foreground);
    font-size: 0.8125rem;
  }
  p {
    margin: 0;
  }
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
    border-top: 1px solid var(--border);
    padding-top: 0.5rem;
  }
</style>
