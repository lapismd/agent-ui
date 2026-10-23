import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true }))
        .filter(
          (d) => !["node_modules", "dist", ".cache", ".local"].includes(d.name),
        )
        .map((d) =>
          d.isDirectory()
            ? files(path.join(dir, d.name))
            : path.join(dir, d.name),
        ),
    )
  ).flat();
}
const findings = [];
for (const file of [
  ...(await files("packages")),
  ...(await files("catalog")),
  ...(await files("scripts")),
  ...(await files("tests")),
]) {
  if (!/\.(?:ts|mjs|svelte)$/.test(file)) continue;
  const text = await readFile(file, "utf8");
  if (
    /packages\/agent-ui\/src\/chat\/(transcript-footer|transcript-send-hint)\/[^/]+\.svelte$/.test(
      file,
    ) &&
    !file.includes(".stories.")
  ) {
    if (/ComposerStatusBanner|role=["']alert["']/.test(text))
      findings.push(
        `${file}: live feedback belongs to ChatMessageComposer.status`,
      );
    if (
      file.endsWith("/AiTranscriptFooter.svelte") &&
      (!text.includes("showStatus={false}") || /\sstatus=/.test(text))
    )
      findings.push(`${file}: fixed actions must disable their status banner`);
  }
  const count = text
    .split("\n")
    .filter((line) => line.trim() && !/^\s*(?:\/\/|\*|\/\*)/.test(line)).length;
  const limit = /\.(?:test|pw)\.ts$/.test(file)
    ? 500
    : file.includes(".stories.")
      ? 400
      : 300;
  if (count > limit)
    findings.push(`${file}: ${count} counted lines exceeds ${limit}`);
  if (file.includes("/src/") && !/\.stories\.|\.example-sources\./.test(file)) {
    const imports = [
      ...text.matchAll(/(?:from|import\s*\()\s*["']([^"']+)/g),
    ].map((m) => m[1]);
    for (const specifier of imports)
      if (
        /(?:fixtures|\.stories\.|\.example-sources\.|\.test\.|@tauri|@lapis-notes|lapis-desktop|jj-store\/web|\/native\/)/.test(
          specifier,
        ) ||
        /@lapismd\/(agent-ui|repository-ui)/.test(specifier) ||
        path
          .resolve(path.dirname(file), specifier)
          .startsWith(path.resolve("catalog") + path.sep)
      )
        findings.push(`${file}: forbidden source import ${specifier}`);
    if (/globalThis\.app/.test(text))
      findings.push(`${file}: ambient App ownership`);
  }
}
if (findings.length) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else
  console.log("Architecture: file budgets and production ownership passed");
