<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import { repositoryAuthorAvatars } from "../../logic/author-avatars.js";
  import { AuthorCard } from "@lapismd/design-core/shadcn/author-card";
  import { avatarInitials } from "@lapismd/design-core/shadcn/avatar";
  import type {
    AvatarIdentity,
    AvatarSize,
  } from "@lapismd/design-core/shadcn/avatar";
  let {
    name,
    email = "",
    avatarUrl,
    handle,
    size = "xs",
  }: {
    name: string;
    email?: string;
    avatarUrl?: string;
    handle?: string;
    size?: AvatarSize;
  } = $props();
  const resolveAvatar = repositoryAuthorAvatars();
  const normalizedEmail = $derived(email.trim().toLowerCase());
  const author = $derived<AvatarIdentity>({
    id: normalizedEmail || handle || name.trim() || "unknown-author",
    name: name.trim() || email.trim() || "Unknown author",
    src: avatarUrl ?? resolveAvatar?.(normalizedEmail),
  });
</script>

<!-- Keep profile activation separate from graph and command-item activation. -->
<span
  class="repository-review-author-avatar"
  data-size={size}
  onpointerdown={(event) => event.stopPropagation()}
  onclick={(event) => event.stopPropagation()}
  onkeydown={(event) => {
    if (event.key === "Enter" || event.key === " ") event.stopPropagation();
  }}
  role="presentation"
>
  <AuthorCard
    {author}
    label={`${avatarInitials(author.name)} · About ${author.name}`}
    {size}
    handle={email.trim() || handle}
    interaction="hover"
  />
</span>

<style>
  .repository-review-author-avatar {
    display: inline-flex;
    flex: none;
    align-items: center;
    pointer-events: auto;
    --ui-avatar-size: var(--ui-repository-author-avatar-size, 1.25rem);
    --ui-author-card-avatar-size: var(
      --ui-repository-author-avatar-size,
      1.75rem
    );
  }
  .repository-review-author-avatar[data-size="sm"] {
    --ui-avatar-size: var(--ui-repository-author-avatar-size, 1.5rem);
  }
  .repository-review-author-avatar[data-size="lg"] {
    --ui-avatar-size: var(--ui-repository-author-avatar-size, 3rem);
  }
  .repository-review-author-avatar[data-size="xl"] {
    --ui-avatar-size: var(--ui-repository-author-avatar-size, 5rem);
  }
  .repository-review-author-avatar[data-size="2xl"] {
    --ui-avatar-size: var(--ui-repository-author-avatar-size, 8rem);
  }
  .repository-review-author-avatar[data-size="3xl"] {
    --ui-avatar-size: var(--ui-repository-author-avatar-size, 10rem);
  }
</style>
