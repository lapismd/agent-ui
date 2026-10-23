<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store appearance settings. -->
<script lang="ts">
  import { onDestroy } from "svelte";
  import RepositorySettingsCard from "../settings-card/RepositorySettingsCard.svelte";
  import AppearanceThemes from "./AppearanceThemes.svelte";
  import AppearanceRow from "./AppearanceRow.svelte";
  import AppearanceChoice from "./AppearanceChoice.svelte";
  import { useAppearance } from "./state/store.svelte.js";
  import type {
    FontSize,
    ConversationDensity,
    ConversationView,
  } from "./state/preferences.js";
  import "./appearance.css";
  import "./theme-preview.css";
  const appearance = useAppearance();
  if (!appearance)
    throw new Error(
      "Provide a host-owned appearance store before rendering settings.",
    );
  onDestroy(() => appearance.resetPreview());
</script>

<section class="repository-appearance" aria-label="Appearance settings">
  <AppearanceThemes />

  <RepositorySettingsCard id="preferences" title="Preferences">
    <div class="appearance-card appearance-card--settings">
      <AppearanceRow
        title="Text size"
        description="Adjust application text without changing window geometry."
      >
        <AppearanceChoice
          label="Text size"
          value={appearance.saved.fontSize}
          options={[
            { value: "smaller", label: "Smaller" },
            { value: "default", label: "Default" },
            { value: "larger", label: "Larger" },
          ]}
          onChange={(v) => appearance.update({ fontSize: v as FontSize })}
        />
      </AppearanceRow>
      <AppearanceRow
        title="Conversation style"
        description="Choose the presentation of messages and the composer."
      >
        <AppearanceChoice
          label="Conversation style"
          value={appearance.saved.conversationView}
          options={[
            { value: "document", label: "Document" },
            { value: "classic", label: "Classic" },
          ]}
          onChange={(v) =>
            appearance.update({ conversationView: v as ConversationView })}
        />
      </AppearanceRow>
      <AppearanceRow
        title="Message spacing"
        description="Adjust the density of conversation messages."
      >
        <AppearanceChoice
          label="Message spacing"
          value={appearance.saved.density}
          options={[
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ]}
          onChange={(v) =>
            appearance.update({ density: v as ConversationDensity })}
        />
      </AppearanceRow>
    </div>
  </RepositorySettingsCard>
</section>

<style>
  .repository-appearance {
    display: grid;
    gap: var(--ui-repository-appearance-gap, 1rem);
    min-width: 0;
  }
</style>
