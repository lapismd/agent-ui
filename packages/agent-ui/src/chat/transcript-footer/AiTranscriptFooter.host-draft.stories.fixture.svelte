<script lang="ts">
  import { onDestroy } from "svelte";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { createDemo } from "../../../../../catalog/agents/support/create-demo.svelte.js";
  import Composer from "../message-composer/ChatMessageComposer.svelte";
  import Footer from "./AiTranscriptFooter.svelte";
  import "../panel.css";
  const demo = createDemo("default");
  const { controller, panel } = demo;
  controller.transcript.threads = [];
  let draft = $state("");
  let requests = $state(0);
  let submitted = $state("");
  const hostedPanel = {
    ...panel,
    composerState: Object.create(panel.composerState, {
      draft: { get: () => draft },
    }),
  };
  function send() {
    requests++;
    submitted = draft;
  }
  onDestroy(() => void demo.close());
</script>

<Tooltip.Provider>
  <div class="host-draft-review">
    <Composer bind:value={draft} view="document" onSend={send} />
    <Footer
      panel={hostedPanel}
      state={controller.transcript}
      blocked={false}
      onSend={send}
    />
    <output
      hidden
      data-testid="host-draft-state"
      data-transcript-message={controller.transcript.message}
      data-requests={requests}
      data-submitted={submitted}
    ></output>
  </div>
</Tooltip.Provider>

<style>
  .host-draft-review {
    box-sizing: border-box;
    max-width: 42rem;
    padding: 1rem;
  }
</style>
