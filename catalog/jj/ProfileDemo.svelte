<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import {
    RepositoryProfileSettings,
    RepositoryProfileMenu,
    RepositoryProfileController,
    type ProfilePort,
    type ProfileDraft,
  } from "../../packages/repository-ui/src/jj/settings/index.js";
  let {
    variant = "Basic",
    menu = false,
  }: { variant?: string; menu?: boolean } = $props();
  let profile = {
    principal: "11111111111111111111111111111111",
    revision: 1,
    details: {
      display_name: "Alex Morgan",
      description:
        "Building with **JJ**.\n\n[Profile guide](https://example.test/profile)\n\n- Local projects\n- Markdown notes",
      avatar: null as string | null,
      email: null as string | null,
      gravatar: false,
    },
  };
  let draft: ProfileDraft | null = null;
  let view = $state(""),
    failure = untrack(() => variant === "Unavailable");
  const urls: string[] = [];
  const port: ProfilePort = {
    async read(signal) {
      if (variant === "Loading")
        await new Promise<void>((resolve) =>
          signal.addEventListener("abort", () => resolve(), { once: true }),
        );
      signal.throwIfAborted();
      if (failure) throw Error("Unavailable");
      return { profile, draft: draft ?? undefined };
    },
    async draft(value) {
      draft = structuredClone(value);
    },
    async save(request) {
      if (variant === "Unknown") return { state: "unknown" };
      if (variant === "Conflict")
        return { state: "conflict", profile: { ...profile, revision: 2 } };
      profile = {
        ...profile,
        revision: profile.revision + 1,
        details: request.details,
      };
      return { state: "saved", profile };
    },
    async inspect() {
      return {
        state: "saved",
        profile: { ...profile, revision: 2, details: draft!.details },
      };
    },
    async upload(file, signal) {
      signal.throwIfAborted();
      const url = URL.createObjectURL(file);
      urls.push(url);
      return { reference: "asset:demo", url };
    },
  };
  const controller = new RepositoryProfileController(port);
  let model = $state(controller.state);
  const release = controller.subscribe((value) => (model = value));
  void controller.open();
  onDestroy(() => {
    release();
    void controller.close();
    urls.forEach((url) => URL.revokeObjectURL(url));
  });
</script>

{#if menu}<div style="width:16rem;background:var(--sidebar);padding:.5rem">
    <RepositoryProfileMenu
      profile={model.profile}
      loading={model.loading}
      compact={variant === "Compact"}
      onProfile={() => (view = "Profile selected")}
      onSettings={() => (view = "Settings selected")}
      onRetry={() => {
        failure = false;
        void controller.open();
      }}
    />
    {#if view}<p role="status">{view}</p>{/if}
  </div>{:else}<div style="height:100dvh">
    <RepositoryProfileSettings {controller} />
  </div>{/if}
