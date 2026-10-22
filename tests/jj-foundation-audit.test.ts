import { afterEach, expect, test } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { auditFoundations } from "../scripts/agent-foundation-audit.mjs";
import { jjOptions } from "../scripts/jj-foundation-audit.mjs";
let root = "";
const base = "packages/repository-ui/src/jj/example/Example";
const write = (file: string, text: string) => {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), text);
};
function fixture() {
  root = mkdtempSync(path.join(tmpdir(), "jj-foundations-"));
  write(
    ".storybook/main.ts",
    'import remarkGfm from "remark-gfm";export default {remarkPlugins:[remarkGfm]};',
  );
  write(
    "docs/jj-component-families.json",
    JSON.stringify({
      families: [
        {
          primary: "jj/example/Example",
          purpose: "Recorded repository example",
          parts: [],
        },
      ],
    }),
  );
  write(
    base + ".svelte",
    '<div style="gap:var(--ui-repository-example-gap,0.5rem)">Recorded history</div>',
  );
  write(
    base + ".stories.ts",
    'import Component from "./Example.svelte";import {Basic} from "./Example.example-sources";const meta={title:"JJ/History/Example",component:Component,tags:["visual-pending"],parameters:{docs:{source:{code:Basic,language:"tsx",type:"code"}}}};export const Basic: Story={};export const Loading: Story={};',
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
      .map((h) => `## ${h}\n\nDocumented behavior.\n`)
      .join("\n") +
      '<Source code={Basic} language="tsx" /><Source code={Styling} language="tsx" /><Canvas of={Stories.Basic} /><Canvas of={Stories.Loading} /><Markdown>{tokenMarkdown(tokens)}</Markdown>',
  );
  write(
    base + ".example-sources.ts",
    'export const Basic=`<script>import {Example} from "@lapismd/repository-ui/jj";</script><Example/>`;export const Styling=`<div style="--ui-repository-example-gap:1rem"><Example/></div>`;',
  );
  write(
    base + ".tokens.json",
    JSON.stringify({
      component: "Example",
      variables: [
        {
          name: "--ui-repository-example-gap",
          default: "0.5rem",
          description: "Gap",
          owner: "@lapismd/repository-ui",
          source: "jj/example/Example.svelte",
        },
      ],
    }),
  );
}
afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
  root = "";
});
test("JJ families use the same complete contract as Agent foundations", () => {
  fixture();
  expect(auditFoundations(root, jjOptions)).toEqual([]);
});
test.each([".mdx", ".stories.ts", ".tokens.json", ".example-sources.ts"])(
  "JJ rejects missing %s",
  (suffix) => {
    fixture();
    rmSync(path.join(root, base + suffix));
    expect(
      auditFoundations(root, jjOptions).some(
        (f) => f.code === "RUI-DOCS-MISSING",
      ),
    ).toBe(true);
  },
);
test.each([
  "Usage",
  "Anatomy",
  "Variations",
  "Behavior and accessibility",
  "Styling variables",
  "API",
  "Composition",
])("JJ rejects missing %s guidance", (heading) => {
  fixture();
  write(
    base + ".mdx",
    readFileSync(path.join(root, base + ".mdx"), "utf8").replace(
      `## ${heading}\n`,
      "",
    ),
  );
  expect(
    auditFoundations(root, jjOptions).some(
      (f) => f.code === "RUI-DOCS-SECTION",
    ),
  ).toBe(true);
});
test("JJ rejects new unowned components and drifted variable defaults", () => {
  fixture();
  write("packages/repository-ui/src/jj/new/New.svelte", "<p>New</p>");
  expect(
    auditFoundations(root, jjOptions).some(
      (f) => f.code === "RUI-DOCS-UNOWNED",
    ),
  ).toBe(true);
  write(
    base + ".svelte",
    '<div style="gap:var(--ui-repository-example-gap,2rem)">Recorded history</div>',
  );
  expect(
    auditFoundations(root, jjOptions).some(
      (f) => f.code === "RUI-DOCS-TOKEN-DEFAULT",
    ),
  ).toBe(true);
});
test("frozen pre-review scaffolding cannot change behind the documentation gate", () => {
  fixture();
  const inventory = JSON.parse(
    readFileSync(path.join(root, "docs/jj-component-families.json"), "utf8"),
  );
  inventory.deferred = [
    { path: "screens/Old.svelte", sha256: "not-the-current-hash" },
  ];
  write("docs/jj-component-families.json", JSON.stringify(inventory));
  write("packages/repository-ui/src/screens/Old.svelte", "<p>Changed</p>");
  expect(
    auditFoundations(root, jjOptions).some(
      (f) => f.code === "RUI-DOCS-DEFERRED",
    ),
  ).toBe(true);
});
