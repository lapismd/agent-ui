import { spawnSync } from "node:child_process";
for (const mode of ["light", "dark"])
  for (const viewport of ["desktop", "narrow"]) {
    console.log(`Storybook: ${mode}, ${viewport}`);
    const result = spawnSync(
      "pnpm",
      [
        "exec",
        "vitest",
        "run",
        "--project",
        "storybook",
        ...process.argv.slice(2),
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
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
