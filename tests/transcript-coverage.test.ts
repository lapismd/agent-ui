import { it, expect } from "vitest";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { auditTranscriptCoverage } from "../scripts/transcript-coverage-audit.mjs";
it("governs every Desktop transcript renderer and fails missing mapping, story and component", () => {
  const root = mkdtempSync(path.join(tmpdir(), "transcript-coverage-"));
  try {
    for (const dir of ["docs", "packages/agent-ui/src", "catalog"])
      cpSync(path.resolve(dir), path.join(root, dir), { recursive: true });
    const file = path.join(root, "docs/desktop-transcript-coverage.json"),
      base = readFileSync(file, "utf8");
    expect(auditTranscriptCoverage(root)).toEqual([]);
    const missing = JSON.parse(base);
    missing.rows.pop();
    writeFileSync(file, JSON.stringify(missing));
    expect(
      auditTranscriptCoverage(root).some((f) =>
        f.message.includes("Missing renderer mapping"),
      ),
    ).toBe(true);
    const invalid = JSON.parse(base);
    invalid.rows[0].story = "agents-missing--story";
    invalid.rows[0].component = "missing.svelte";
    writeFileSync(file, JSON.stringify(invalid));
    const findings = auditTranscriptCoverage(root);
    expect(
      findings.some((f) => f.message.includes("Missing review story")),
    ).toBe(true);
    expect(
      findings.some((f) => f.message.includes("Incomplete renderer mapping")),
    ).toBe(true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
