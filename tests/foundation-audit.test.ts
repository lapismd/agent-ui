import { afterEach, describe, expect, it } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { auditFoundations } from "../scripts/agent-foundation-audit.mjs";
let root: string;
const base = "packages/agent-ui/src/chat/example/Example";
function write(file: string, text: string) {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), text);
}
function fixture() {
  root = mkdtempSync(path.join(tmpdir(), "agent-foundation-audit-"));
  write(
    ".storybook/main.ts",
    `import remarkGfm from "remark-gfm"; export default {remarkPlugins:[remarkGfm]};`,
  );
  write(
    "docs/agent-component-families.json",
    JSON.stringify({
      families: [
        {
          primary: "chat/example/Example",
          purpose: "A reusable example",
          parts: [],
        },
      ],
    }),
  );
  write(
    base + ".svelte",
    '<div style="gap:var(--ui-agent-example-gap, 0.5rem)">Example</div>',
  );
  write(
    base + ".stories.ts",
    'import Component from "./Example.svelte"; import {Basic} from "./Example.example-sources"; const meta = {title:"Agents/Chat/Example", component:Component,tags:["visual-pending"],parameters:{docs:{source:{code:Basic,language:"tsx",type:"code"}}}}; export const Basic: Story = {}; export const Busy: Story = {};',
  );
  write(
    base + ".mdx",
    [
      "Usage",
      "Anatomy",
      "Variations",
      "Behavior and accessibility",
      "Styling variables",
      "API",
      "Composition",
    ]
      .map((heading) => `## ${heading}\n\nReal guidance.\n`)
      .join("\n") +
      '<Source code={Basic} language="tsx" /><Source code={Styling} language="tsx" /><Canvas of={Stories.Basic} /><Canvas of={Stories.Busy} /><Markdown>{tokenMarkdown(tokens)}</Markdown>',
  );
  write(
    base + ".example-sources.ts",
    'export const Basic = `<script>import {Example} from "@lapismd/agent-ui";</script><Example/>`; export const Styling = `<div style="--ui-agent-example-gap:1rem"><Example/></div>`;',
  );
  write(
    base + ".tokens.json",
    JSON.stringify({
      component: "Example",
      variables: [
        {
          name: "--ui-agent-example-gap",
          default: "0.5rem",
          description: "Gap",
          owner: "@lapismd/agent-ui",
          source: "chat/example/Example.svelte",
        },
      ],
    }),
  );
}
afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
});
describe("foundation specification enforcement", () => {
  it("accepts a complete colocated family", () => {
    fixture();
    expect(auditFoundations(root)).toEqual([]);
  });
  it.each([".stories.ts", ".mdx", ".example-sources.ts", ".tokens.json"])(
    "rejects missing %s",
    (suffix) => {
      fixture();
      rmSync(path.join(root, base + suffix));
      expect(
        auditFoundations(root).some((f) => f.code === "AUI-DOCS-MISSING"),
      ).toBe(true);
    },
  );
  it.each([
    "Usage",
    "Anatomy",
    "Variations",
    "Behavior and accessibility",
    "Styling variables",
    "API",
    "Composition",
  ])("rejects absent %s guidance", (heading) => {
    fixture();
    write(
      base + ".mdx",
      readFileSync(path.join(root, base + ".mdx"), "utf8").replace(
        `## ${heading}\n`,
        "",
      ),
    );
    expect(
      auditFoundations(root).some(
        (f) => f.message === `Missing ${heading} section`,
      ),
    ).toBe(true);
  });
  it("rejects a newly added component without docs ownership", () => {
    fixture();
    write("packages/agent-ui/src/chat/new-component/New.svelte", "<p>New</p>");
    expect(
      auditFoundations(root).some((f) => f.code === "AUI-DOCS-UNOWNED"),
    ).toBe(true);
  });
  it("rejects story metadata that names a fixture instead of the production component", () => {
    fixture();
    write(
      base + ".stories.ts",
      readFileSync(path.join(root, base + ".stories.ts"), "utf8").replace(
        "component:Component",
        "component:Fixture",
      ),
    );
    expect(
      auditFoundations(root).some((f) => f.code === "AUI-DOCS-STORY"),
    ).toBe(true);
  });
  it("rejects token defaults that drift from CSS", () => {
    fixture();
    write(
      base + ".svelte",
      '<div style="gap:var(--ui-agent-example-gap, 1rem)">Example</div>',
    );
    expect(
      auditFoundations(root).some((f) => f.code === "AUI-DOCS-TOKEN-DEFAULT"),
    ).toBe(true);
  });
  it("rejects undocumented new styling variables", () => {
    fixture();
    write(
      base + ".svelte",
      readFileSync(path.join(root, base + ".svelte"), "utf8") +
        '<div style="padding:var(--ui-agent-new-padding,0)"></div>',
    );
    expect(
      auditFoundations(root).some(
        (f) => f.code === "AUI-DOCS-TOKEN-UNDOCUMENTED",
      ),
    ).toBe(true);
  });
  it("rejects missing GFM documentation support", () => {
    fixture();
    write(".storybook/main.ts", "export default {};");
    expect(
      auditFoundations(root).some((f) => f.code === "AUI-DOCS-MARKDOWN"),
    ).toBe(true);
  });
  it("rejects omitted variation previews", () => {
    fixture();
    write(
      base + ".mdx",
      readFileSync(path.join(root, base + ".mdx"), "utf8").replace(
        "<Canvas of={Stories.Busy} />",
        "",
      ),
    );
    expect(
      auditFoundations(root).some((f) => f.code === "AUI-DOCS-VARIATIONS"),
    ).toBe(true);
  });
  it("rejects private or story-harness consumer examples", () => {
    fixture();
    write(
      base + ".example-sources.ts",
      'export const Basic = "<Fixture/>";export const Styling = "--ui-agent-example-gap";',
    );
    expect(
      auditFoundations(root).some((f) => f.code === "AUI-DOCS-EXAMPLE"),
    ).toBe(true);
  });
});
