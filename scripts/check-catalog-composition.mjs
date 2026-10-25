import { readFileSync } from "node:fs";
import { walk } from "./agent-foundation-audit.mjs";
import { auditComposition } from "./catalog-composition.mjs";
const files = [
  ...walk("packages/agent-ui/src"),
  ...walk("packages/repository-ui/src/jj"),
  ...walk("catalog").filter((path) =>
    /^catalog\/Agent[^/]*\.stories\.ts$/.test(path),
  ),
];
const sources = new Map();
const read = (path) => {
  if (sources.has(path)) return sources.get(path);
  try {
    const value = readFileSync(path, "utf8");
    sources.set(path, value);
    return value;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};
const contracts = JSON.parse(read("docs/catalog-composition-contracts.json"));
const findings = auditComposition({ files, read, contracts });
for (const finding of findings) console.error(`[AUI-GOV-003] ${finding}`);
console.log(
  `Catalog production composition: ${files.filter((p) => p.endsWith(".stories.ts")).length} families, ${findings.length} findings`,
);
process.exitCode = findings.length ? 1 : 0;
