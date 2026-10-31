import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { test } from "node:test";

const workflow = readFileSync(
  new URL("../.github/workflows/npm-publish.yml", import.meta.url),
  "utf8",
);
const source = "a".repeat(40);

function workflowStep(name) {
  const lines = workflow.split("\n");
  const start = lines.findIndex((line) => line.trim() === `- name: ${name}`);
  assert.notEqual(start, -1, `Missing workflow step: ${name}`);
  let run = start + 1;
  while (run < lines.length && lines[run].trim() !== "run: |") {
    assert.ok(
      !lines[run].trim().startsWith("- "),
      `Missing run block: ${name}`,
    );
    run++;
  }
  assert.ok(run < lines.length, `Missing run block: ${name}`);
  const script = [];
  for (const line of lines.slice(run + 1)) {
    if (line.trim() && !line.startsWith("          ")) break;
    script.push(line.startsWith("          ") ? line.slice(10) : "");
  }
  return script.join("\n");
}

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "agent-ui-publisher-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, "bin"));
  const git = join(directory, "bin/git");
  writeFileSync(
    git,
    `#!/usr/bin/env node
const args = process.argv.slice(2);
if (args.join(' ') === 'merge-base --is-ancestor HEAD origin/main') {
  process.exit(process.env.FIXTURE_ANCESTOR === 'no' ? 1 : 0);
} else if (args.join(' ') === 'rev-parse HEAD') {
  console.log(process.env.FIXTURE_SOURCE);
} else if (args[0] === 'rev-parse' && args[1] === '--verify') {
  console.log(process.env.FIXTURE_TAGGED);
} else {
  throw Error('Unexpected Git fixture operation');
}
`,
  );
  chmodSync(git, 0o755);
  const packages = [
    { directory: "agent-ui", version: "0.2.0" },
    { directory: "repository-ui", version: "0.1.1" },
  ];
  for (const entry of packages) {
    mkdirSync(join(directory, "packages", entry.directory), {
      recursive: true,
    });
    writeFileSync(
      join(directory, "packages", entry.directory, "package.json"),
      JSON.stringify({
        name: `@lapismd/${entry.directory}`,
        version: entry.version,
        publishConfig: { access: "public" },
      }),
    );
  }
  const run = (name, overrides = {}) => {
    const result = spawnSync(
      "bash",
      ["-e", "-o", "pipefail", "-c", workflowStep(name)],
      {
        cwd: directory,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: join(directory, "bin") + delimiter + process.env.PATH,
          GITHUB_SHA: source,
          FIXTURE_SOURCE: source,
          FIXTURE_TAGGED: source,
          RELEASE_TAG: "v0.2.0",
          GITHUB_OUTPUT: join(directory, "output"),
          ...overrides,
        },
      },
    );
    assert.equal(result.error, undefined);
    assert.equal(result.signal, null);
    return result;
  };
  return { directory, packages, run };
}

test("publisher accepts unequal versions and emits their exact cohort", (t) => {
  const { directory, run } = fixture(t);
  const result = run("Validate release identity");
  assert.equal(result.status, 0, result.stderr);
  const outputs = Object.fromEntries(
    readFileSync(join(directory, "output"), "utf8")
      .trim()
      .split("\n")
      .map((line) => [
        line.slice(0, line.indexOf("=")),
        line.slice(line.indexOf("=") + 1),
      ]),
  );
  assert.equal(outputs.artifact_name, `agent-ui-release-${source}`);
  assert.deepEqual(JSON.parse(outputs.packages), [
    { package: "agent-ui", version: "0.2.0" },
    { package: "repository-ui", version: "0.1.1" },
  ]);
});

for (const [name, overrides] of [
  ["wrong cohort tag", { RELEASE_TAG: "v0.1.1" }],
  ["different workflow source", { GITHUB_SHA: "b".repeat(40) }],
  ["different immutable tag", { FIXTURE_TAGGED: "b".repeat(40) }],
  ["source outside main", { FIXTURE_ANCESTOR: "no" }],
]) {
  test(`publisher rejects ${name}`, (t) => {
    assert.equal(
      fixture(t).run("Validate release identity", overrides).status,
      1,
    );
  });
}

for (const [name, delta] of [
  ["private package", { private: true }],
  ["wrong package identity", { name: "@other/repository-ui" }],
  ["prerelease version", { version: "0.1.1-beta.1" }],
  ["restricted access", { publishConfig: { access: "restricted" } }],
]) {
  test(`publisher rejects ${name}`, (t) => {
    const { directory, run } = fixture(t);
    const path = join(directory, "packages/repository-ui/package.json");
    writeFileSync(
      path,
      JSON.stringify({ ...JSON.parse(readFileSync(path)), ...delta }),
    );
    assert.equal(run("Validate release identity").status, 1);
  });
}

function packedFixture(t) {
  const candidate = fixture(t);
  mkdirSync(join(candidate.directory, ".release"));
  for (const entry of candidate.packages) {
    writeFileSync(
      join(
        candidate.directory,
        `.release/lapismd-${entry.directory}-${entry.version}.tgz`,
      ),
      `${entry.directory} artifact bytes`,
    );
  }
  return candidate;
}

test("publisher binds each version to exact tarball integrity", (t) => {
  const { directory, packages, run } = packedFixture(t);
  const result = run("Bind exact package versions and artifact integrity");
  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(
    readFileSync(join(directory, ".release/manifest.json")),
  );
  assert.equal(manifest.source, source);
  assert.deepEqual(
    manifest.packages,
    packages.map((entry) => ({
      name: `@lapismd/${entry.directory}`,
      version: entry.version,
      tarball: `lapismd-${entry.directory}-${entry.version}.tgz`,
      integrity: `sha512-${createHash("sha512").update(`${entry.directory} artifact bytes`).digest("base64")}`,
    })),
  );
});

test("publisher rejects a tarball for the wrong package version", (t) => {
  const { directory, run } = packedFixture(t);
  rmSync(join(directory, ".release/lapismd-repository-ui-0.1.1.tgz"));
  writeFileSync(
    join(directory, ".release/lapismd-repository-ui-0.2.0.tgz"),
    "wrong version",
  );
  assert.equal(
    run("Bind exact package versions and artifact integrity").status,
    1,
  );
});
