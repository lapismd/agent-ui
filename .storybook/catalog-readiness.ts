// SPDX-License-Identifier: Apache-2.0; adapted from Design Core catalog readiness.
import type { Plugin } from "vite";

export const CATALOG_READINESS_PATH = "/__lapis_catalog_ready";
const CLIENT_ENTRIES = [
  "/.storybook/preview.ts",
  "/packages/agent-ui/src/chat/transcript/AgentTranscript.mdx",
  "/catalog/AgentScreens.stories.ts",
  "/catalog/agents/references/ReferenceDemo.svelte",
  "/catalog/jj/BrowserDemo.svelte",
  "/catalog/AgentStates.stories.ts",
];

/** Probe the client compiler, not just the already-generated story index. */
export function catalogReadinessPlugin(): Plugin {
  return {
    name: "lapis-catalog-client-readiness",
    apply: "serve",
    configureServer(server) {
      let preparation: Promise<void> | undefined;
      server.middlewares.use(
        CATALOG_READINESS_PATH,
        async (_request, response) => {
          try {
            preparation ??= (async () => {
              const results = await Promise.allSettled(
                CLIENT_ENTRIES.map(async (entry) => {
                  server.config.logger.info(
                    `[catalog-ready] compiling ${entry}`,
                  );
                  if (!(await server.transformRequest(entry))) {
                    throw new Error(
                      `Catalog client entry could not be compiled: ${entry}`,
                    );
                  }
                }),
              );
              const failure = results.find(
                (result) => result.status === "rejected",
              );
              if (failure?.status === "rejected") throw failure.reason;
              server.config.logger.info(
                "[catalog-ready] settling static imports",
              );
              await server.waitForRequestsIdle();
            })();
            await preparation;
            response.statusCode = 200;
            response.end("Catalog client ready");
          } catch (error) {
            preparation = undefined;
            server.config.logger.error(String(error));
            response.statusCode = 503;
            response.end("Catalog client preparation failed");
          }
        },
      );
    },
  };
}
