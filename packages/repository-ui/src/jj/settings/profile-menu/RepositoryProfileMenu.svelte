<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store CommunityProfileMenu. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { Avatar, avatarInitials } from "@lapismd/design-core/shadcn/avatar";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import UserIcon from "@lucide/svelte/icons/user";
  import type { PersonalProfile } from "../profile/model.js";
  let {
    profile,
    avatarUrl = "",
    compact = false,
    loading = false,
    onProfile,
    onSettings,
    onRetry,
  }: {
    profile?: PersonalProfile;
    avatarUrl?: string;
    compact?: boolean;
    loading?: boolean;
    onProfile(): void;
    onSettings(): void;
    onRetry?(): void;
  } = $props();
  const name = $derived(profile?.details.display_name || "Local user");
  let menuOpen = $state(false),
    tooltipOpen = $state(false);
  let pendingAction: "profile" | "settings" | undefined;
  function selectAction(action: "profile" | "settings") {
    pendingAction = action;
  }
  function finishAction(open: boolean) {
    if (open || !pendingAction) return;
    const action = pendingAction;
    pendingAction = undefined;
    if (action === "profile") onProfile();
    else onSettings();
  }
</script>

{#if loading}<div
    role="status"
    aria-label="Loading profile menu"
    class="profile-menu-loading"
  >
    <Skeleton style="height:3rem;width:100%" />
  </div>
{:else if !profile}<Empty.Root
    ><Empty.Header
      ><Empty.Media variant="icon"><UserIcon aria-hidden="true" /></Empty.Media
      ><Empty.Title>Profile unavailable</Empty.Title><Empty.Description
        >Read your local profile again.</Empty.Description
      ></Empty.Header
    ><Empty.Content
      ><Button size="sm" variant="ghost" onclick={onRetry}>Retry profile</Button
      ><Button size="sm" variant="ghost" onclick={onSettings}>Settings</Button
      ></Empty.Content
    ></Empty.Root
  >
{:else}
  <div class="community-profile-menu" data-compact={compact || undefined}>
    <Tooltip.Provider>
      <DropdownMenu.Root
        open={menuOpen}
        onOpenChange={(open) => {
          menuOpen = open;
          if (open) tooltipOpen = false;
        }}
        onOpenChangeComplete={finishAction}
      >
        <Tooltip.Root open={tooltipOpen} disabled={!compact || menuOpen}>
          <Tooltip.Trigger>
            {#snippet child({ props: tooltipProps })}
              <span
                {...tooltipProps}
                class="community-profile-menu__tooltip-anchor"
                tabindex="-1"
                onpointerenter={() => (tooltipOpen = true)}
                onpointerleave={() => (tooltipOpen = false)}
              >
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Button
                      {...props}
                      type="button"
                      variant="ghost"
                      class="community-profile-menu__trigger"
                      aria-label={`Open profile menu for ${avatarInitials(name)} ${name}${compact ? "" : " Local profile"}`}
                    >
                      <Avatar
                        {name}
                        src={avatarUrl}
                        shape="circle"
                        size="md"
                        decorative
                      />
                      {#if !compact}
                        <span class="community-profile-menu__identity">
                          <strong>{name}</strong>
                          <small> Local profile </small>
                        </span>
                      {/if}
                    </Button>
                  {/snippet}
                </DropdownMenu.Trigger>
              </span>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content side="right" sideOffset={8}>{name}</Tooltip.Content>
        </Tooltip.Root>

        <DropdownMenu.Content
          preventScroll={false}
          side="top"
          align="start"
          sideOffset={8}
          class="community-profile-menu__content"
          aria-label="Profile menu"
        >
          <DropdownMenu.Group class="community-profile-menu__menu-header">
            <Avatar
              {name}
              src={avatarUrl}
              shape="circle"
              size="md"
              decorative
            />
            <DropdownMenu.Label class="community-profile-menu__menu-identity">
              {name}
            </DropdownMenu.Label>
          </DropdownMenu.Group>

          <DropdownMenu.Group>
            <DropdownMenu.Item onSelect={() => selectAction("settings")}>
              <SettingsIcon
                data-icon="inline-start"
                aria-hidden="true"
              />Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => selectAction("profile")}>
              <UserIcon data-icon="inline-start" aria-hidden="true" />Profile
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Tooltip.Provider>
  </div>
{/if}

<style>
  .profile-menu-loading {
    padding: 0.5rem;
  }

  .community-profile-menu {
    width: var(--ui-repository-profile-menu-width, 100%);
    --community-member-avatar-presence-ring: var(--sidebar, var(--background));

    padding: 0.5rem 0.75rem 0.75rem;
  }

  .community-profile-menu[data-compact] {
    padding-inline: 0.25rem;
  }

  .community-profile-menu__tooltip-anchor {
    display: flex;
    width: 100%;
  }

  :global(.community-profile-menu__trigger[data-ui-component="button"]) {
    width: 100%;
    min-width: 0;
    height: auto;
    min-height: 3rem;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.75rem;
    color: var(--sidebar-foreground, var(--foreground));
    transition:
      color 120ms ease,
      background-color 120ms ease,
      box-shadow 120ms ease;
  }

  :global(.community-profile-menu__trigger[data-ui-component="button"]:hover),
  :global(
    .community-profile-menu__trigger[data-ui-component="button"]:focus-visible
  ),
  :global(
    .community-profile-menu__trigger[data-ui-component="button"][data-state="open"]
  ) {
    color: var(--sidebar-accent-foreground, var(--foreground));
    background: color-mix(
      in srgb,
      var(--sidebar-accent, var(--accent)) 88%,
      transparent
    );
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--foreground) 7%, transparent);
  }

  :global(
    .community-profile-menu[data-compact]
      .community-profile-menu__trigger[data-ui-component="button"]
  ) {
    width: 2.5rem;
    max-width: 100%;
    min-height: 2.5rem;
    justify-content: center;
    margin-inline: auto;
    padding: 0;
  }

  .community-profile-menu__identity,
  :global(.community-profile-menu__menu-identity) {
    display: grid;
    min-width: 0;
    text-align: start;
  }

  .community-profile-menu__identity {
    gap: 0.125rem;
  }

  .community-profile-menu__identity strong,
  .community-profile-menu__identity small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .community-profile-menu__identity strong {
    font-size: var(--community-text-body);
    line-height: 1.1;
  }

  .community-profile-menu__identity small {
    color: var(--muted-foreground);
    font-size: var(--community-text-secondary);
  }

  :global(.community-profile-menu__content) {
    width: min(18rem, calc(100vw - 1rem));
    border-radius: 1rem;
    padding: 0.5rem;
  }

  :global(.community-profile-menu__menu-header) {
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    align-items: center;
    column-gap: 0.75rem;
    min-height: 3rem;
    padding: 0.375rem 0.5rem;
  }

  :global(.community-profile-menu__menu-header > [data-ui-component="avatar"]) {
    grid-row: 1 / span 2;
  }

  :global(.community-profile-menu__menu-identity) {
    grid-column: 2;
    align-self: start;
    justify-items: start;
    padding: 0;
    color: var(--foreground);
  }
</style>
