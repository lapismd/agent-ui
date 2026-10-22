<script lang="ts">
  import { RepositoryChangeCard } from "../../packages/repository-ui/src/jj/index.js";
  import { browserCommit, browserNow } from "./support/browser-data.js";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let { variant = "Basic" }: { variant?: string } = $props();
  useDemoAuthors();
  let copied = $state("");
  const commit = $derived({
    ...browserCommit,
    ...(variant === "LongDescription"
      ? {
          message:
            "Extract shared repository browsing while preserving immutable operation and revision identities. Keep the host in charge of navigation, clipboard, admission and read cancellation across every source and Markdown preview.",
        }
      : variant === "UnknownAuthor"
        ? { author: "", authorEmail: "" }
        : variant === "CommitOnly"
          ? { changeId: undefined }
          : variant === "ChangeOnly"
            ? { eventId: "" }
            : {}),
  });
</script>

<div class="change-card-boundary">
  <RepositoryChangeCard
    {commit}
    now={browserNow}
    copyText={async (value) => {
      copied = value;
    }}
  /><output data-testid="change-card-copy" hidden>{copied}</output>
</div>

<style>
  .change-card-boundary {
    padding: 1.5rem;
    max-width: 32rem;
  }
</style>
