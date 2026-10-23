// Adapted from Design Core catalog readiness regression coverage.
import { describe, expect, it, vi } from "vitest";
import type { ViteDevServer } from "vite";
import {
  catalogReadinessPlugin,
  CATALOG_READINESS_PATH,
} from "../.storybook/catalog-readiness.js";

function fixture() {
  let handler: (request: unknown, response: unknown) => Promise<void>;
  const transformRequest = vi.fn().mockResolvedValue({ code: "export {};" });
  const waitForRequestsIdle = vi.fn().mockResolvedValue(undefined);
  const error = vi.fn();
  const use = vi.fn((_path, middleware) => {
    handler = middleware;
  });
  const server = {
    transformRequest,
    waitForRequestsIdle,
    middlewares: { use },
    config: { logger: { error, info: vi.fn() } },
  };
  const plugin = catalogReadinessPlugin();
  (plugin.configureServer as (server: ViteDevServer) => void)(
    server as unknown as ViteDevServer,
  );
  const response = () => ({ statusCode: 0, end: vi.fn() });
  return {
    server,
    response,
    probe: (res: ReturnType<typeof response>) => handler({}, res),
  };
}

describe("catalog client preparation", () => {
  it("prepares repository loading stories before accepting cold browser work", async () => {
    const f = fixture();
    await f.probe(f.response());
    expect(f.server.transformRequest).toHaveBeenCalledWith(
      "/catalog/jj/BrowserDemo.svelte",
    );
  });
  it("refuses readiness when the Transcript documentation cannot compile", async () => {
    const f = fixture();
    f.server.transformRequest.mockImplementation(async (entry) =>
      entry === "/packages/agent-ui/src/chat/transcript/AgentTranscript.mdx"
        ? null
        : { code: "export {};" },
    );
    const failed = f.response();
    await f.probe(failed);
    expect(failed.statusCode).toBe(503);
    expect(f.server.waitForRequestsIdle).not.toHaveBeenCalled();
    f.server.transformRequest.mockResolvedValue({ code: "export {};" });
    const repaired = f.response();
    await f.probe(repaired);
    expect(repaired.statusCode).toBe(200);
  });
  it("refuses readiness until the complete Agent screens can compile", async () => {
    const f = fixture();
    f.server.transformRequest.mockImplementation(async (entry) =>
      entry === "/catalog/AgentScreens.stories.ts"
        ? null
        : { code: "export {};" },
    );
    const response = f.response();
    await f.probe(response);
    expect(response.statusCode).toBe(503);
    expect(f.server.waitForRequestsIdle).not.toHaveBeenCalled();
  });
  it("does not report ready before client imports settle", async () => {
    const f = fixture();
    let finish!: () => void;
    f.server.waitForRequestsIdle.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const response = f.response();
    const pending = f.probe(response);
    await vi.waitFor(() =>
      expect(f.server.waitForRequestsIdle).toHaveBeenCalled(),
    );
    expect(response.end).not.toHaveBeenCalled();
    finish();
    await pending;
    expect(response.statusCode).toBe(200);
    expect(f.server.middlewares.use).toHaveBeenCalledWith(
      CATALOG_READINESS_PATH,
      expect.any(Function),
    );
  });

  it("shares completed preparation between probes", async () => {
    const f = fixture();
    await f.probe(f.response());
    const count = f.server.transformRequest.mock.calls.length;
    await f.probe(f.response());
    expect(f.server.transformRequest).toHaveBeenCalledTimes(count);
    expect(f.server.waitForRequestsIdle).toHaveBeenCalledTimes(1);
  });

  it("fails closed on missing client entries and retries after repair", async () => {
    const f = fixture();
    f.server.transformRequest.mockResolvedValueOnce(null);
    const failed = f.response();
    await f.probe(failed);
    expect(failed.statusCode).toBe(503);
    expect(f.server.waitForRequestsIdle).not.toHaveBeenCalled();
    const repaired = f.response();
    await f.probe(repaired);
    expect(repaired.statusCode).toBe(200);
  });
});
