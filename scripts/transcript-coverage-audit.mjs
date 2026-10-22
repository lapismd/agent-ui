import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { walk } from "./agent-foundation-audit.mjs";
const required = [
  "recorded-conversation",
  "system-and-notice",
  "sent-context",
  "message-metadata",
  "recipient-delivery",
  "tool-inspector",
  "tool-results",
  "inventory",
  "command-report",
  "working",
  "queue",
  "comments",
  "turn-summary",
  "changes-rail",
  "changes-file",
  "history-dialogs",
];
export function auditTranscriptCoverage(root) {
  const file = "docs/desktop-transcript-coverage.json",
    findings = [];
  const report = (message) =>
    findings.push({
      code: "AUI-TRANSCRIPT-COVERAGE",
      rule: "AUI-PARITY-001",
      file,
      line: 1,
      message,
    });
  let coverage;
  try {
    coverage = JSON.parse(readFileSync(path.join(root, file), "utf8"));
  } catch {
    report("Missing Desktop transcript coverage inventory");
    return findings;
  }
  if (
    !coverage.sourceRevision ||
    coverage.sourceRepository !== "lapis-desktop" ||
    !coverage.composition
  )
    report(
      "Coverage must identify the Desktop composition and source revision",
    );
  const slug = (value) =>
    value
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const stories = new Set();
  for (const source of [
    ...walk(path.join(root, "packages/agent-ui/src")),
    ...walk(path.join(root, "catalog")),
  ].filter((file) => file.endsWith(".stories.ts"))) {
    const text = readFileSync(source, "utf8"),
      title = /title:\s*["']([^"']+)["']/.exec(text)?.[1];
    const id =
      /id:\s*["']([^"']+)["']/.exec(text)?.[1] ?? (title && slug(title));
    if (id)
      for (const match of text.matchAll(/export const (\w+):\s*Story\s*=/g))
        stories.add(`${id}--${slug(match[1])}`);
  }
  const ids = new Set();
  for (const row of coverage.rows ?? []) {
    if (ids.has(row.id)) report(`Duplicate renderer: ${row.id}`);
    ids.add(row.id);
    if (!stories.has(row.story)) report(`Missing review story: ${row.story}`);
    if (
      !row.component ||
      !row.source ||
      !row.behavior ||
      !row.story ||
      !existsSync(path.join(root, "packages/agent-ui/src", row.component ?? ""))
    )
      report(`Incomplete renderer mapping: ${row.id}`);
  }
  for (const id of required)
    if (!ids.has(id)) report(`Missing renderer mapping: ${id}`);
  return findings;
}
export default {
  name: "desktop-transcript-coverage",
  validate: (context) => auditTranscriptCoverage(context.model.repoRoot),
};
