import { expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import YAML from "yaml";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const lock = YAML.parse(readFileSync(new URL("pnpm-lock.yaml", root), "utf8"));
const require = createRequire(
  new URL("../node_modules/@changesets/cli/package.json", import.meta.url),
);
const semver = require("semver");

test("the supported Storybook10 and Vitest4 cohort excludes their fixed advisory ranges", () => {
  const storybook = pkg.devDependencies.storybook;
  expect(semver.satisfies(storybook, ">=10.6.2 <11")).toBe(true);
  for (const name of [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    "@storybook/svelte-vite",
  ])
    expect(pkg.devDependencies[name], name).toBe(storybook);
  for (const name of [
    "vitest",
    "@vitest/browser",
    "@vitest/browser-playwright",
  ])
    expect(
      semver.satisfies(pkg.devDependencies[name], ">=4.1.12 <5"),
      name,
    ).toBe(true);
  expect(pkg.devDependencies.vite).toBe("8.3.5");
  expect(pkg.devDependencies["@sveltejs/vite-plugin-svelte"]).toBe("7.3.1");
  expect(pkg.devDependencies["@changesets/cli"]).toBe("^2.31.1");
});

test("the actual locked Storybook and mocker graph excludes every repaired advisory version", () => {
  const ranges = {
    storybook: ">=10.0.0 <10.6.2",
    "@storybook/addon-vitest": ">=10.0.0 <10.6.2",
    "@vitest/mocker": ">=2.1.0-beta.7 <4.1.12",
  };
  for (const [name, vulnerable] of Object.entries(ranges)) {
    const versions = Object.keys(lock.packages).filter((key) =>
      key.startsWith(name + "@"),
    );
    expect(versions.length, name).toBeGreaterThan(0);
    for (const key of versions)
      expect(
        semver.satisfies(key.slice(name.length + 1), vulnerable),
        key,
      ).toBe(false);
  }
  expect(pkg.pnpm.auditConfig).toBeUndefined();
  expect(
    YAML.parse(readFileSync(new URL("pnpm-workspace.yaml", root), "utf8"))
      .auditConfig,
  ).toBeUndefined();
});
