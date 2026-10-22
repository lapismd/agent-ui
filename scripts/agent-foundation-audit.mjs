import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const sourceRoot = "packages/agent-ui/src";
const manifestPath = "docs/agent-component-families.json";
export function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
const compact = (value) => value.replace(/\s+/g, "");
function fallback(source, name) {
  const start = source.indexOf(`var(${name},`);
  if (start < 0) return undefined;
  const from = start + name.length + 5;
  let depth = 1;
  for (let index = from; index < source.length; index++) {
    if (source[index] === "(") depth++;
    if (source[index] === ")" && --depth === 0)
      return source.slice(from, index);
  }
}
export function auditFoundations(root) {
  const findings = [];
  const read = (file) =>
    existsSync(path.join(root, file))
      ? readFileSync(path.join(root, file), "utf8")
      : "";
  const report = (file, code, message) =>
    findings.push({ code, rule: "AUI-FOUND-001", file, line: 1, message });
  let families;
  try {
    families = JSON.parse(read(manifestPath)).families;
  } catch {
    report(
      manifestPath,
      "AUI-DOCS-INVENTORY",
      "Missing or invalid component-family inventory",
    );
    return findings;
  }
  const main = read(".storybook/main.ts");
  if (
    !/import remarkGfm from [\"\']remark-gfm[\"\']/.test(main) ||
    !/remarkPlugins:\s*\[remarkGfm\]/.test(main)
  )
    report(
      ".storybook/main.ts",
      "AUI-DOCS-MARKDOWN",
      "MDX must enable the same GFM table parser as Design Core",
    );
  const members = new Set();
  const primaryStories = new Set();
  const allTokens = new Set();
  for (const family of families) {
    const { primary, parts = [], purpose } = family;
    const prefix = `${sourceRoot}/${primary}`;
    const directory = path.dirname(primary);
    if (
      !purpose ||
      !directory.includes("/") ||
      !/^[a-z0-9-]+$/.test(path.basename(directory))
    )
      report(
        manifestPath,
        "AUI-DOCS-FOLDER",
        `Invalid family folder or purpose: ${primary}`,
      );
    for (const part of [primary + ".svelte", ...parts]) {
      if (members.has(part))
        report(
          manifestPath,
          "AUI-DOCS-OWNER",
          `Duplicate component owner: ${part}`,
        );
      members.add(part);
      if (!read(`${sourceRoot}/${part}`))
        report(manifestPath, "AUI-DOCS-OWNER", `Missing component: ${part}`);
    }
    const required = [
      ".stories.ts",
      ".mdx",
      ".example-sources.ts",
      ".tokens.json",
    ];
    for (const suffix of required)
      if (!read(prefix + suffix))
        report(
          prefix + suffix,
          "AUI-DOCS-MISSING",
          `Family requires colocated ${suffix}`,
        );
    primaryStories.add(prefix + ".stories.ts");
    const stories = read(prefix + ".stories.ts");
    const actualComponent = new RegExp(
      `import\\s+(\\w+)\\s+from\\s+["']\\./${path.basename(primary)}\\.svelte["']`,
    ).exec(stories)?.[1];
    const mdx = read(prefix + ".mdx");
    const examples = read(prefix + ".example-sources.ts");
    if (
      !/title:\s*["']Agents\//.test(stories) ||
      !actualComponent ||
      !new RegExp(`component:\\s*${actualComponent}\\b`).test(stories) ||
      !stories.includes(`./${path.basename(primary)}.svelte`)
    )
      report(
        prefix + ".stories.ts",
        "AUI-DOCS-STORY",
        "Stories must name the actual colocated production component under Agents",
      );
    if (
      !stories.includes("visual-pending") ||
      !/language:\s*["']tsx["']/.test(stories) ||
      !/type:\s*["']code["']/.test(stories) ||
      !stories.includes(".example-sources")
    )
      report(
        prefix + ".stories.ts",
        "AUI-DOCS-SOURCE",
        "Stories require highlighted public consumer source and visual-pending metadata",
      );
    for (const heading of [
      "Usage",
      "Anatomy",
      "Variations",
      "Behavior and accessibility",
      "Styling variables",
      "API",
      "Composition",
    ])
      if (!mdx.includes(`## ${heading}\n`))
        report(
          prefix + ".mdx",
          "AUI-DOCS-SECTION",
          `Missing ${heading} section`,
        );
    if (
      !mdx.includes("tokenMarkdown(tokens)") ||
      !mdx.includes('<Source code={Basic} language="tsx"') ||
      !mdx.includes('<Source code={Styling} language="tsx"')
    )
      report(
        prefix + ".mdx",
        "AUI-DOCS-USAGE",
        "Docs must render the audited token table, public usage and styling examples",
      );
    const variations = [
      ...stories.matchAll(/export const (\w+):\s*Story\s*=/g),
    ].map((match) => match[1]);
    if (variations.length < 2)
      report(
        prefix + ".stories.ts",
        "AUI-DOCS-VARIATIONS",
        "Document at least the basic case and a meaningful variation",
      );
    for (const variation of variations)
      if (!mdx.includes(`<Canvas of={Stories.${variation}}`))
        report(
          prefix + ".mdx",
          "AUI-DOCS-VARIATIONS",
          `Missing rendered ${variation} variation`,
        );
    if (
      !examples.includes("@lapismd/agent-ui") ||
      !examples.includes("export const Basic") ||
      !examples.includes("export const Styling") ||
      /(?:\.stories\.|catalog\/|\.\/|\.\.\/|args\.)/.test(examples)
    )
      report(
        prefix + ".example-sources.ts",
        "AUI-DOCS-EXAMPLE",
        "Examples require complete public imports without catalog/private source boundaries",
      );
    let contract;
    try {
      contract = JSON.parse(read(prefix + ".tokens.json"));
    } catch {
      report(
        prefix + ".tokens.json",
        "AUI-DOCS-TOKENS",
        "Missing or invalid styling contract",
      );
      continue;
    }
    if (!contract.variables?.length)
      report(
        prefix + ".tokens.json",
        "AUI-DOCS-TOKENS",
        "Document at least one supported styling variable",
      );
    for (const token of contract.variables ?? []) {
      allTokens.add(token.name);
      if (
        !/^--ui-/.test(token.name) ||
        !token.description ||
        !token.owner ||
        !token.source ||
        !token.default
      ) {
        report(
          prefix + ".tokens.json",
          "AUI-DOCS-TOKENS",
          "Variable requires name, default, description, owner and source",
        );
        continue;
      }
      const source = token.source.startsWith("@lapismd/")
        ? `node_modules/${token.source}`
        : `${sourceRoot}/${token.source}`;
      if (
        fallback(compact(read(source)), token.name) !== compact(token.default)
      )
        report(
          prefix + ".tokens.json",
          "AUI-DOCS-TOKEN-DEFAULT",
          `Variable default differs from its owning source: ${token.name}`,
        );
    }
    if (!contract.variables?.some((token) => examples.includes(token.name)))
      report(
        prefix + ".example-sources.ts",
        "AUI-DOCS-STYLING",
        "Styling example must use an audited variable",
      );
  }
  for (const file of walk(path.join(root, sourceRoot))) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    const source = read(relative);
    if (
      relative.endsWith(".svelte") &&
      !relative.includes(".stories.") &&
      !members.has(
        path
          .relative(path.join(root, sourceRoot), file)
          .split(path.sep)
          .join("/"),
      )
    )
      report(
        relative,
        "AUI-DOCS-UNOWNED",
        "New component requires a documented family, or explicit ownership as a private compound part",
      );
    if (relative.endsWith(".stories.ts") && !primaryStories.has(relative))
      report(
        relative,
        "AUI-DOCS-UNOWNED",
        "New story family requires a colocated documentation contract",
      );
    if (/\.(?:css|svelte)$/.test(relative) && !relative.includes(".stories."))
      for (const match of source.matchAll(/--ui-agent-[a-z0-9-]+/g))
        if (!allTokens.has(match[0]))
          report(
            relative,
            "AUI-DOCS-TOKEN-UNDOCUMENTED",
            `Styling variable has no audited docs: ${match[0]}`,
          );
  }
  return findings;
}
export default {
  name: "agentFoundations",
  validate: (context) => auditFoundations(context.model.repoRoot),
};
