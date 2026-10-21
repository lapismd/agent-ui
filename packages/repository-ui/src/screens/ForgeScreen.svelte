<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import type { RepositoryController } from "../core/controller.svelte.js";
  let { controller }: { controller: RepositoryController } = $props();
  let editing = $state(false);
  let creating = $state(false);
  let title = $state("");
  let body = $state("");
  let method = $state("squash");
  const pr = $derived(controller.pullRequest);
  const check = $derived(
    pr?.checks.find((c) => c.id === controller.selectedCheck),
  );
</script>

<section class="rui-screen" aria-label="Pull request browser">
  <header class="rui-toolbar">
    <h2>Pull requests</h2>
    <Button
      size="sm"
      disabled={!controller.can("create_pr")}
      onclick={() => {
        creating = true;
        editing = true;
        title = "";
        body = "";
      }}>Create pull request</Button
    >
  </header>
  <div class="rui-two-pane">
    <aside class="rui-pane">
      {#each controller.snapshot?.pullRequests ?? [] as item}<Button
          variant={controller.selectedPr === item.id ? "secondary" : "ghost"}
          onclick={() => {
            controller.selectedPr = item.id;
            editing = false;
            creating = false;
          }}>#{item.number} {item.title}</Button
        >{/each}
    </aside>
    <div class={controller.floating ? "rui-screen rui-float" : "rui-screen"}>
      <header class="rui-toolbar">
        <h2>
          {creating
            ? "New pull request"
            : (pr?.title ?? "Choose a pull request")}
        </h2>
        <span class="rui-spacer"></span><Button
          size="sm"
          variant="ghost"
          aria-pressed={controller.floating}
          onclick={() => (controller.floating = !controller.floating)}
          >{controller.floating ? "Redock" : "Float panel"}</Button
        >{#if pr}<Button
            size="sm"
            variant="ghost"
            onclick={() => {
              editing = !editing;
              title = pr!.title;
              body = pr!.body;
            }}>Edit details</Button
          >{/if}
      </header>
      <div class="rui-scroll">
        {#if editing}<label class="rui-field"
            >Title<Input bind:value={title} /></label
          ><label class="rui-field"
            >Description<textarea rows="6" bind:value={body}></textarea></label
          >
          <div class="rui-actions">
            <Button variant="outline" onclick={() => (editing = false)}
              >Cancel edit</Button
            ><Button
              disabled={!title.trim() ||
                !controller.can(creating ? "create_pr" : "edit_pr")}
              onclick={() =>
                controller.prepare(creating ? "create_pr" : "edit_pr", pr?.id, {
                  title,
                  body,
                })}>Review pull request</Button
            >
          </div>{:else if pr}<div class="rui-actions">
            <span>#{pr.number} · {pr.state}{pr.draft ? " · Draft" : ""}</span><a
              href={pr.url}
              target="_blank"
              rel="noreferrer">Open pull request</a
            >
          </div>
          <MarkdownContent content={pr.body} />
          <div class="rui-actions">
            <label
              >Merge method<select class="rui-select" bind:value={method}
                ><option>squash</option><option>merge</option><option
                  >rebase</option
                ></select
              ></label
            ><Button
              disabled={!controller.can("merge_pr")}
              onclick={() => controller.prepare("merge_pr", pr.id, { method })}
              >Review merge</Button
            ><Button
              variant="outline"
              disabled={!controller.can("draft_pr")}
              onclick={() =>
                controller.prepare("draft_pr", pr.id, { draft: !pr.draft })}
              >{pr.draft ? "Mark ready" : "Convert to draft"}</Button
            ><Button
              variant="outline"
              disabled={!controller.can("restack")}
              onclick={() => controller.prepare("restack", pr.id)}
              >Restack</Button
            >
          </div>
          <section class="rui-card">
            <div class="rui-actions">
              <Button
                variant="ghost"
                aria-expanded={controller.checksOpen}
                onclick={() => (controller.checksOpen = !controller.checksOpen)}
                >Checks · {pr.checks.filter((c) => c.state === "success")
                  .length}/{pr.checks.length} successful</Button
              ><Button
                size="sm"
                variant="ghost"
                onclick={() => void controller.refresh()}>Refresh checks</Button
              >
            </div>
            {#if controller.checksOpen}{#each pr.checks as item}<Button
                  variant={controller.selectedCheck === item.id
                    ? "secondary"
                    : "ghost"}
                  onclick={() => (controller.selectedCheck = item.id)}
                  >{item.name} · {item.state}</Button
                >{/each}{#if check}<h3>{check.name}</h3>
                <pre class="rui-mono">{check.log}</pre>{/if}{/if}
          </section>{:else}<div class="rui-empty">
            Select a pull request to inspect its description and checks.
          </div>{/if}
      </div>
    </div>
  </div>
</section>
