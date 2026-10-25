import { describe, it, expect } from "vitest";
import { auditComposition } from "../scripts/catalog-composition.mjs";
const file = "packages/agent-ui/src/example/Example.stories.ts";
const story = `import Component from './Example.svelte';import Fixture from './Fixture.stories.fixture.svelte';export default {component:Component};export const Basic={render:()=>({Component:Fixture})};`;
function run(fixture: string, extra: Record<string, string> = {}) {
  const sources: Record<string, string> = {
    [file]: story,
    "packages/agent-ui/src/example/Example.svelte": "<p>Production</p>",
    "packages/agent-ui/src/example/Fixture.stories.fixture.svelte": fixture,
    ...extra,
  };
  return auditComposition({
    files: [file],
    read: (path: string) => sources[path] ?? null,
  });
}
describe("actual Storybook production composition", () => {
  it("requires a rendered production subject rather than an unused import", () => {
    expect(
      run(
        `<script>import Component from './Example.svelte';</script><Component />`,
      ),
    ).toEqual([]);
    expect(
      run(
        `<script>import Component from './Example.svelte';</script><p>Fake screen</p>`,
      ).join(),
    ).toContain("misses metadata");
  });
  it("follows local fixtures and fails on missing or dynamic replacements", () => {
    expect(
      run(
        `<script>import Child from './Child.stories.fixture.svelte';</script><Child />`,
        {
          "packages/agent-ui/src/example/Child.stories.fixture.svelte": `<script>import View from './Example.svelte';</script><View />`,
        },
      ),
    ).toEqual([]);
    expect(
      run(
        `<script>import Missing from './Missing.svelte';</script><Missing />`,
      ).join(),
    ).toContain("missing rendered");
    expect(run(`<svelte:component this={component}/>`).join()).toContain(
      "dynamic",
    );
  });
  it("rejects private package imports and unresolved render callbacks", () => {
    expect(
      run(
        `<script>import Component from '@lapismd/design-core/src/Fake.svelte';</script><Component />`,
      ).join(),
    ).toContain("private package");
    expect(
      run("<p/>", {
        [file]: story.replace("()=>({Component:Fixture})", "createFake()"),
      }).join(),
    ).toContain("render callback");
  });
  it("follows an exported production component through a public local barrel", () => {
    expect(
      run(`<script>import {View} from './index.js';</script><View />`, {
        "packages/agent-ui/src/example/index.ts": `export {default as View} from './Example.svelte';`,
      }),
    ).toEqual([]);
  });
  it("resolves shorthand render functions and explicit local render factories", () => {
    const fixture = `<script>import Component from './Example.svelte';</script><Component />`;
    const direct = story
      .replace(
        "export const Basic=",
        "const render=(args)=>({Component:Fixture});export const Basic=",
      )
      .replace("render:()=>({Component:Fixture})", "render");
    expect(run(fixture, { [file]: direct })).toEqual([]);
    const factory = story
      .replace(
        "export const Basic=",
        "const render=(variant)=>()=>({Component:Fixture});export const Basic=",
      )
      .replace("render:()=>({Component:Fixture})", 'render:render("Basic")');
    expect(run(fixture, { [file]: factory })).toEqual([]);
  });
  it("requires complete catalog screens rather than an arbitrary production control", () => {
    const entry = "catalog/AgentScreens.stories.ts";
    const sources: Record<string, string> = {
      [entry]:
        "import View from '../packages/agent-ui/src/example/Example.svelte';export default {component:View};export const Basic={};",
      "packages/agent-ui/src/example/Example.svelte":
        "<p>Production control</p>",
    };
    const read = (path: string) => sources[path] ?? null;
    expect(auditComposition({ files: [entry], read }).join()).toContain(
      "complete production screen",
    );
    expect(
      auditComposition({
        files: [entry],
        read,
        contracts: { [entry]: ["packages/agent-ui/src/example/Screen.svelte"] },
      }).join(),
    ).toContain("complete production screen");
    expect(
      auditComposition({
        files: [entry],
        read,
        contracts: {
          [entry]: ["packages/agent-ui/src/example/Example.svelte"],
        },
      }),
    ).toEqual([]);
    expect(
      auditComposition({
        files: [],
        read,
        contracts: {
          [entry]: ["packages/agent-ui/src/example/Example.svelte"],
        },
      }).join(),
    ).toContain("stale complete-screen");
  });
});
