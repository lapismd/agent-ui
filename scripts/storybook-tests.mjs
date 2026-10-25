import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  assertSelectedStories,
  assertMatrixCoverage,
  storybookMatrix,
} from "./storybook-report.mjs";
mkdirSync(".local/validation/storybook", { recursive: true });
const args = process.argv.slice(2);
if (args[0] === "--") args.shift();
const results = [];
for (const { mode, viewport, args: selectedArgs, report } of storybookMatrix(
  args,
)) {
  console.log(
    `Storybook: ${mode}, ${viewport}, ${selectedArgs.join(" ") || "focused"}`,
  );
  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "vitest",
      "run",
      "--project",
      "storybook",
      "--reporter=default",
      "--reporter=json",
      `--outputFile=${report}`,
      ...selectedArgs,
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        CATALOG_THEME: mode,
        ...(viewport === "narrow"
          ? { CATALOG_NARROW: "1" }
          : { CATALOG_NARROW: "" }),
      },
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  const resultReport = JSON.parse(readFileSync(report, "utf8"));
  results.push({ mode, viewport, report: resultReport });
  console.log(
    `Executed ${assertSelectedStories(resultReport)} ${mode}/${viewport} stories`,
  );
}
const coverage = assertMatrixCoverage(results);
writeFileSync(
  ".local/validation/storybook/summary.json",
  JSON.stringify(coverage, null, 2),
);
console.log(
  `Complete Storybook matrix: ${coverage.casesPerMode} cases x4 = ${coverage.total}`,
);
