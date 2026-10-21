<script lang="ts">
  import { FileListing, MergeEditor } from "@lapismd/design-core/diff";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  let { controller }: { controller: RepositoryController } = $props();
  const conflicts = $derived(controller.snapshot?.conflicts ?? []);
  const active = $derived(
    conflicts.find((f) => f.path === controller.selectedPath) ?? conflicts[0],
  );
</script>

<section class="rui-screen" aria-label="Resolve conflicts">
  <header class="rui-toolbar">
    <h2>Resolve conflicts</h2>
    <span>{conflicts.length} paths</span><Button
      disabled={!active || !controller.can("resolve_conflict")}
      onclick={() =>
        active &&
        controller.prepare("resolve_conflict", active.path, {
          content: controller.conflictDrafts[active.path] ?? active.base,
        })}>Preview resolution</Button
    >
  </header>
  {#if active}<div class="rui-two-pane">
      <aside class="rui-pane">
        <FileListing
          files={conflicts}
          selectedPath={active.path}
          onSelectPath={(path) => (controller.selectedPath = path)}
        />
      </aside>
      <div class="rui-screen">
        {#if active.unavailable}<p class="rui-empty" role="status">
            {active.unavailable}
          </p>{:else}<MergeEditor
            left={active.left}
            base={active.base}
            right={active.right}
            path={active.path}
            onResolvedChange={(state) => {
              if (active)
                controller.conflictDrafts[active.path] = state.content;
            }}
          />{/if}
      </div>
    </div>{:else}<div class="rui-empty">No conflicts to resolve</div>{/if}
</section>
