<script lang="ts">
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  let { controller }: { controller: RepositoryController } = $props();
  const sections = $derived([
    ...new Set(controller.snapshot?.settings.map((s) => s.section) ?? []),
  ]);
</script>

<section class="rui-screen" aria-label="Repository settings">
  <header class="rui-toolbar">
    <h2>Repository settings</h2>
    {#each sections as section}<Button
        size="sm"
        variant={controller.settingsSection === section ? "secondary" : "ghost"}
        onclick={() => (controller.settingsSection = section)}>{section}</Button
      >{/each}
  </header>
  <div class="rui-scroll">
    {#each controller.snapshot?.settings.filter((s) => s.section === controller.settingsSection) ?? [] as setting}<section
        class="rui-card"
      >
        <label class="rui-field"
          ><strong>{setting.label}</strong><span class="rui-muted"
            >{setting.description}</span
          >{#if typeof setting.value === "boolean"}<input
              type="checkbox"
              checked={Boolean(controller.drafts[setting.id] ?? setting.value)}
              disabled={setting.readonly || controller.busy}
              onchange={(event) =>
                (controller.drafts[setting.id] = event.currentTarget.checked)}
            />{:else if setting.options}<select
              value={String(controller.drafts[setting.id] ?? setting.value)}
              disabled={setting.readonly || controller.busy}
              onchange={(event) =>
                (controller.drafts[setting.id] = event.currentTarget.value)}
              >{#each setting.options as option}<option>{option}</option
                >{/each}</select
            >{:else}<Input
              value={String(controller.drafts[setting.id] ?? setting.value)}
              disabled={setting.readonly || controller.busy}
              oninput={(event) =>
                (controller.drafts[setting.id] = event.currentTarget.value)}
            />{/if}</label
        >
      </section>{/each}
  </div>
  <footer class="rui-toolbar">
    <span class="rui-muted">Changes are saved only after confirmation.</span
    ><span class="rui-spacer"></span><Button
      variant="outline"
      onclick={() => (controller.drafts = {})}>Cancel changes</Button
    ><Button
      disabled={!Object.keys(controller.drafts).length ||
        !controller.can("save_settings")}
      onclick={() =>
        controller.prepare("save_settings", undefined, {
          ...controller.drafts,
        })}>Review settings</Button
    >
  </footer>
</section>
