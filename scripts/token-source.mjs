import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/** Resolve authored provenance within the installed package's declared entry root. */
export function tokenSource(root, source) {
  const authored = path.join(root, "node_modules", source);
  if (existsSync(authored)) return authored;
  const match = source.match(/^(@[^/]+\/[^/]+)\/([^/]+)\/(.+)$/);
  if (!match) return authored;
  const [, name, sourceRoot, relative] = match;
  try {
    const directory = path.join(root, "node_modules", name);
    const manifest = JSON.parse(
      readFileSync(path.join(directory, "package.json"), "utf8"),
    );
    const targets = (value) =>
      typeof value === "string"
        ? [value]
        : value && typeof value === "object"
          ? Object.values(value).flatMap(targets)
          : [];
    const roots = new Set(
      targets(manifest.exports).flatMap((target) => {
        const match = target.match(/^\.\/([^/]+)\//);
        return match ? [match[1]] : [];
      }),
    );
    const outputRoot = roots.size === 1 ? [...roots][0] : undefined;
    if (!outputRoot || outputRoot === sourceRoot) return authored;
    return path.join(directory, outputRoot, relative);
  } catch {
    return authored;
  }
}
