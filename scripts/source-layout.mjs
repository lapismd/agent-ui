import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { format } from "prettier";
export const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
export async function normalized(text, file) {
  if (file.endsWith(".svg")) return text;
  return format(text, { filepath: file, plugins: ["prettier-plugin-svelte"] });
}
export async function layout(text, file) {
  return (await normalized(text, file))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}
const ledger = JSON.parse(
  await readFile("docs/desktop-layout-sources.json", "utf8"),
);
const sourceFlag = process.argv.indexOf("--source-root");
const sourceRoot =
  sourceFlag === -1 ? undefined : path.resolve(process.argv[sourceFlag + 1]);
let compared = 0;
for (const row of ledger.copies) {
  const destination = await readFile(row.destination, "utf8");
  if (
    sha256(await normalized(destination, row.destination)) !==
    row.destinationSha256
  )
    throw new Error(
      `Extracted source fingerprint changed: ${row.destination}. Review and document its source adaptation.`,
    );
  if (!sourceRoot) continue;
  const source = await readFile(
    path.join(sourceRoot, row.sourceRepository, row.source),
    "utf8",
  );
  if (sha256(source) !== row.sourceSha256)
    throw new Error(`Reference source drift: ${row.source}`);
  if (!row.layoutSha256) continue;
  let original = await layout(source, row.destination);
  for (const adaptation of row.layoutAdaptations ?? []) {
    if (!original.includes(adaptation.before))
      throw new Error(
        `Missing source adaptation in ${row.destination}: ${adaptation.before}`,
      );
    original = original.replaceAll(adaptation.before, adaptation.after);
  }
  original = await layout(
    row.destination.endsWith(".svelte")
      ? `<script lang="ts"></script>\n${original}`
      : original,
    row.destination,
  );
  // Both sides pass through formatting again after stripping scripts/comments;
  // otherwise comment-only blank lines can create a false layout difference.
  const extractedLayout = await layout(destination, row.destination);
  const extracted = await layout(
    row.destination.endsWith(".svelte")
      ? `<script lang="ts"></script>\n${extractedLayout}`
      : extractedLayout,
    row.destination,
  );
  if (original !== extracted || sha256(extracted) !== row.layoutSha256)
    throw new Error(`Original layout differs: ${row.destination}`);
  compared++;
}
console.log(
  `Source ledger: ${ledger.copies.length} extracted fingerprints verified${sourceRoot ? `; ${compared} original layouts matched with documented host bindings` : ""}.`,
);
