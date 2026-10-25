import { test } from "node:test";
import assert from "node:assert/strict";
import { validateArchives } from "./validation/archives.mjs";
const valid = {
  name: "@lapismd/design-core",
  version: "0.6.0",
  path: "design-core.tgz",
  sha256: "a".repeat(64),
};
test("archive identity is explicit, unique and checksum bounded", () => {
  assert.deepEqual(validateArchives([valid]), [valid]);
  for (const entries of [
    null,
    {},
    [valid, valid],
    [{ ...valid, name: "../secret" }],
    [{ ...valid, version: "latest" }],
    [{ ...valid, sha256: "short" }],
    [{ ...valid, path: "model.gguf" }],
  ])
    assert.throws(() => validateArchives(entries));
});
