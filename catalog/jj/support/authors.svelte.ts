import { onMount } from "svelte";
import { provideRepositoryAuthorAvatars } from "../../../packages/repository-ui/src/jj/index.js";
/** Catalog-owned version of Desktop's display-only enrichment; no repository IO. */
export function useDemoAuthors() {
  const urls = $state<Record<string, string>>({});
  provideRepositoryAuthorAvatars((email) => urls[email]);
  onMount(() => {
    let live = true;
    void crypto.subtle
      .digest("SHA-256", new TextEncoder().encode("dev@lapis.md"))
      .then((digest) => {
        const hash = Array.from(new Uint8Array(digest), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join("");
        if (live)
          urls["dev@lapis.md"] =
            `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
      });
    return () => {
      live = false;
    };
  });
}
