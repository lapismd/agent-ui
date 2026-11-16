import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import YAML from "yaml";

const workflow = YAML.parse(
  readFileSync(
    new URL("../.github/workflows/changesets.yml", import.meta.url),
    "utf8",
  ),
);
const version = workflow.jobs.changesets;
const writer = version.steps.find((step) =>
  step.uses?.startsWith("changesets/action@"),
);

test("version PRs require canonical main and a repository-scoped App without fallback", () => {
  assert.equal(
    version.if,
    "github.repository == 'lapismd/agent-ui' && github.ref == 'refs/heads/main'",
  );
  assert.equal(version.permissions.contents, "read");
  assert.notEqual(version.permissions["pull-requests"], "write");
  const app = version.steps.find((step) =>
    step.uses?.startsWith("actions/create-github-app-token@"),
  );
  assert.ok(app, "version PR writes require an App token");
  assert.equal(app.id, "app");
  assert.equal(app.if, undefined);
  assert.equal(app["continue-on-error"], undefined);
  assert.deepEqual(app.with, {
    "client-id": "${{ vars.LAPIS_DEPENDENCY_APP_CLIENT_ID }}",
    "private-key": "${{ secrets.LAPIS_DEPENDENCY_APP_PRIVATE_KEY }}",
    owner: "${{ github.repository_owner }}",
    repositories: "${{ github.event.repository.name }}",
    "permission-contents": "write",
    "permission-pull-requests": "write",
  });
  assert.ok(version.steps.indexOf(app) < version.steps.indexOf(writer));
  assert.equal(
    writer.env?.GITHUB_TOKEN ?? writer.with?.["github-token"],
    "${{ steps.app.outputs.token }}",
  );
});

test("version preparation keeps API commits and ephemeral checkout credentials", () => {
  const checkout = version.steps.find((step) =>
    step.uses?.startsWith("actions/checkout@"),
  );
  assert.equal(checkout.with["persist-credentials"], false);
  assert.equal(writer.with.version, "pnpm exec changeset version");
  assert.equal(writer.with.commitMode, "github-api");
  assert.equal(writer.with.createGithubReleases, false);
  for (const step of version.steps.filter(
    (step) => step.uses && !step.uses.startsWith("./"),
  ))
    assert.match(step.uses, /@[a-f0-9]{40}$/);
});

test("publisher and dispatch authority remain separate from the PR App", () => {
  assert.equal(writer.with.publish, undefined);
  const publisher = readFileSync(
    new URL("../.github/workflows/npm-publish.yml", import.meta.url),
    "utf8",
  );
  assert.ok(!publisher.includes("steps.app.outputs.token"));
});

test("the qualified direct-command runtime guard runs after install and before App minting", () => {
  const steps = version.steps;
  const guard = steps.find((step) =>
    step.uses?.startsWith("lapismd/lapis-ci/actions/guard-version-runtime@"),
  );
  assert.ok(
    guard,
    "version writer authority requires the qualified runtime guard",
  );
  assert.equal(
    guard.uses,
    "lapismd/lapis-ci/actions/guard-version-runtime@f73b6b98a4e1dc2e2c43ad92194f09ddb8c221f5",
  );
  assert.deepEqual(guard.with, {
    "qualification-file": ".github/versioning-runtime.json",
  });
  assert.equal(guard.if, undefined);
  assert.equal(guard["continue-on-error"], undefined);
  assert.ok(
    steps.findIndex((step) => step.run === "pnpm install --frozen-lockfile") <
      steps.indexOf(guard),
  );
  assert.ok(
    steps.indexOf(guard) < steps.findIndex((step) => step.id === "app"),
  );
  assert.ok(steps.indexOf(guard) < steps.indexOf(writer));
  assert.equal(writer.with.version, "pnpm exec changeset version");
});

test("qualification binds the unchanged CLI2 direct command and approved local inputs", () => {
  const read = (file) => readFileSync(new URL("../" + file, import.meta.url));
  const qualification = JSON.parse(read(".github/versioning-runtime.json"));
  const pkg = JSON.parse(read("package.json"));
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  assert.equal(qualification.schemaVersion, 1);
  assert.equal(qualification.cliVersion, "2.31.1");
  assert.equal(qualification.packageManager, pkg.packageManager);
  assert.equal(qualification.nodeMajor, 24);
  assert.equal(qualification.mode, "direct");
  assert.deepEqual(qualification.argv, ["exec", "changeset", "version"]);
  assert.deepEqual(qualification.scripts, {});
  for (const name of ["prechangeset", "postchangeset", "release:version"])
    assert.equal(pkg.scripts[name], undefined);
  assert.equal(
    qualification.configSha256,
    hash(read(".changeset/config.json")),
  );
  assert.deepEqual(Object.keys(qualification.files).sort(), [
    ".prettierignore",
    ".prettierrc.json",
    "patches/bits-ui@2.20.2.patch",
    "pnpm-workspace.yaml",
  ]);
  for (const [file, expected] of Object.entries(qualification.files))
    assert.equal(hash(read(file)), expected, file);
});
