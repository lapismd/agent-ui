<script lang="ts">
  import StoreSettingsCard from "../settings-card/RepositorySettingsCard.svelte";
  import SectionIcon from "@lucide/svelte/icons/palette";
  import SunMoon from "@lucide/svelte/icons/sun-moon";
  import Sun from "@lucide/svelte/icons/sun";
  import Moon from "@lucide/svelte/icons/moon";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { Switch } from "@lapismd/design-core/shadcn/switch";
  import { useAppearance } from "./state/store.svelte.js";
  import {
    themeNames,
    pairedThemes,
    lightThemes,
    themePairs,
    themeLabel,
    accents,
  } from "./state/theme-catalog.js";
  import type { ColorMode } from "./state/preferences.js";
  import AppearanceChoice from "./AppearanceChoice.svelte";
  import AppearanceRow from "./AppearanceRow.svelte";
  import ThemePreview from "./ThemePreview.svelte";
  const store = useAppearance()!;
  let expanded = $state(false);
  const paired = $derived(store.saved.mode === "system");
  const buzz = $derived(store.theme === "buzz" || store.theme === "buzz-dark");
  const original = $derived(
    store.theme === "original" || store.theme === "original-dark",
  );
  const selected = $derived(
    paired && !lightThemes.has(store.saved.theme)
      ? (themePairs.get(store.saved.theme) ?? store.saved.theme)
      : store.saved.theme,
  );
  const themes = $derived(
    paired
      ? pairedThemes
      : store.saved.mode === "light"
        ? [
            ...pairedThemes,
            ...themeNames.filter(
              (n) => lightThemes.has(n) && !themePairs.has(n),
            ),
          ]
        : [
            ...pairedThemes.map((n) => themePairs.get(n)!),
            ...themeNames.filter(
              (n) => !lightThemes.has(n) && !themePairs.has(n),
            ),
          ],
  );
</script>

<StoreSettingsCard id="appearance-theme" title="Theme" Icon={SectionIcon}>
  <div class="appearance-card appearance-card--settings">
    <AppearanceRow
      title="Color mode"
      description="Follow your system or choose a light or dark appearance."
    >
      <AppearanceChoice
        label="Color mode"
        value={store.saved.mode}
        options={[
          { value: "system", label: "System", icon: SunMoon },
          { value: "light", label: "Light", icon: Sun },
          { value: "dark", label: "Dark", icon: Moon },
        ]}
        onChange={(v) => store.mode(v as ColorMode)}
      />
    </AppearanceRow>
    <AppearanceRow
      title="Theme style"
      description="Choose the colors used throughout the application."
    >
      <button
        class="appearance-theme-trigger"
        type="button"
        aria-label={`Theme style, ${themeLabel(selected)}`}
        aria-expanded={expanded}
        aria-controls="appearance-theme-options"
        onclick={() => (expanded = !expanded)}
        ><ThemePreview theme={selected} {paired} /><ChevronDown
          aria-hidden="true"
        /></button
      >
    </AppearanceRow>
    {#if expanded}<div
        id="appearance-theme-options"
        class="appearance-theme-gallery"
        aria-label="Theme styles"
      >
        {#each themes as theme (theme)}<button
            type="button"
            class="appearance-theme-tile"
            aria-label={`Use ${themeLabel(theme)} theme`}
            aria-pressed={selected === theme}
            onclick={() => store.update({ theme })}
            ><ThemePreview {theme} {paired} /><span>{themeLabel(theme)}</span
            ></button
          >{/each}
      </div>{/if}
    {#if !buzz && !original}<AppearanceRow
        title="Accent color"
        description="Choose the highlight color used throughout the application."
      >
        <div class="appearance-accents" aria-label="Accent colors">
          {#each accents as color}<button
              type="button"
              data-accent={color.name.toLowerCase()}
              aria-label={`Use ${color.name} accent`}
              title={color.name}
              aria-pressed={store.saved.accent === color.value}
              onclick={() => store.update({ accent: color.value })}
              ><span></span></button
            >{/each}
        </div>
      </AppearanceRow>{/if}
    {#if buzz}<AppearanceRow
        title="Prominent active tab"
        description="Give the selected navigation item a higher-contrast background."
        ><Switch
          aria-label="Prominent active tab"
          checked={store.saved.prominent}
          onCheckedChange={(prominent) => store.update({ prominent })}
        /></AppearanceRow
      >{/if}
  </div>
</StoreSettingsCard>
