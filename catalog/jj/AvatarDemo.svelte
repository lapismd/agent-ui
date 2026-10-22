<script lang="ts">
  import { onMount } from "svelte";
  import type { AvatarSize } from "@lapismd/design-core/shadcn/avatar";
  import { RepositoryAuthorAvatar } from "../../packages/repository-ui/src/jj/index.js";
  let { variant }: { variant: string } = $props();
  const sizes: AvatarSize[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
  let avatarUrl = $state<string>();
  onMount(() => {
    if (variant !== "Gravatar") return;
    let live = true;
    // Display enrichment is owned by this catalog host, just as in Desktop.
    void crypto.subtle
      .digest("SHA-256", new TextEncoder().encode("dev@lapis.md"))
      .then((digest) => {
        const hash = Array.from(new Uint8Array(digest), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join("");
        if (live)
          avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404&s=320`;
      });
    return () => {
      live = false;
    };
  });
</script>

<div class="avatar-demo" aria-label="Author avatar examples">
  {#each variant === "Sizes" ? sizes : ["xs" as const] as size (size)}
    <figure>
      <RepositoryAuthorAvatar
        name={variant === "Fallback"
          ? "Unknown author"
          : variant === "Gravatar"
            ? "Lapis developer"
            : "Ada Lovelace"}
        email={variant === "Gravatar" ? "dev@lapis.md" : ""}
        avatarUrl={variant === "Gravatar" ? avatarUrl : undefined}
        {size}
      />
      <figcaption>
        {variant === "Gravatar" ? "dev@lapis.md · Gravatar" : size}
      </figcaption>
    </figure>
  {/each}
</div>

<style>
  .avatar-demo {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 2rem;
    background: var(--background);
    color: var(--foreground);
  }
  figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }
  figcaption {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }
</style>
