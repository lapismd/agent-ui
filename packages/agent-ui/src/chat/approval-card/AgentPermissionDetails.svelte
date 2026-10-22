<script lang="ts">
  import { FileTypeIcon } from "@lapismd/design-core/shadcn/file-type-icon";
  import { CodeBlock } from "@lapismd/design-core/shadcn/code-block";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import type { ApprovalRequest } from "../requests.js";
  let { request }: { request: ApprovalRequest } = $props();
  const resources = $derived(
    request.details?.resources ??
      (request.details?.path
        ? [
            {
              path: request.details.path,
              kind: "file" as const,
              access:
                request.kind === "read" ? "Read access" : "Requested access",
            },
          ]
        : []),
  );
</script>

{#if resources.length}
  <ul class="agent-permission-resources" aria-label="Requested resources">
    {#each resources as resource, index (`${index}/${resource.path}`)}
      <li>
        {#if resource.kind === "folder"}<FolderIcon
            aria-hidden="true"
          />{:else}<FileTypeIcon path={resource.path} size="s" />{/if}<code
          title={resource.path}>{resource.path}</code
        ><span>{resource.access}</span>
      </li>
    {/each}
  </ul>
{/if}
{#if request.details?.command}<CodeBlock
    code={request.details.command}
    language="bash"
    title="Requested command"
    size="sm"
    width="full"
    isWrapped
  />{/if}
{#if request.details?.diff}<CodeBlock
    code={request.details.diff}
    language="diff"
    title="Proposed changes"
    size="sm"
    width="full"
    maxHeight="16rem"
  />{/if}
{#if request.details?.raw || request.tool?.input !== undefined}
  <Collapsible.Root
    ><Collapsible.Trigger
      >{#snippet child({ props })}<Button {...props} variant="ghost" size="sm"
          >Captured request details</Button
        >{/snippet}</Collapsible.Trigger
    ><Collapsible.Content
      ><CodeBlock
        code={request.details?.raw ??
          JSON.stringify(request.tool?.input, null, 2)}
        language="json"
        title="Captured request"
        size="sm"
        width="full"
        maxHeight="16rem"
      /></Collapsible.Content
    ></Collapsible.Root
  >
{/if}
