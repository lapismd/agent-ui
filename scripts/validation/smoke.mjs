import {
  readFileSync,
  mkdtempSync,
  writeFileSync,
  chmodSync,
  appendFileSync,
  rmSync,
} from "node:fs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { validationConfig } from "./model.mjs";
if (
  process.env.AGENT_UI_VALIDATION_WORKER !== "1" ||
  validationConfig().runtime !== "native"
)
  throw Error("Docker smoke requires explicit isolated-worker dispatch");
assert.match(
  readFileSync("/proc/self/status", "utf8").match(/^CapEff:\s*(.+)$/m)?.[1] ??
    "",
  /^0+$/,
);
assert.match(readFileSync("/proc/1/cmdline", "utf8"), /docker-init|tini/);
const denied = mkdtempSync("/tmp/agent-ui-permission-"),
  probe = denied + "/probe";
writeFileSync(probe, "private");
chmodSync(denied, 0);
try {
  assert.throws(() => readFileSync(probe), { code: "EACCES" });
  assert.throws(() => appendFileSync(probe, "forbidden"), { code: "EACCES" });
} finally {
  chmodSync(denied, 0o700);
  rmSync(denied, { recursive: true });
}
execFileSync(
  "node",
  [
    "--test",
    "scripts/validation.test.mjs",
    "scripts/validation-archives.test.mjs",
  ],
  { stdio: "inherit" },
);
const { chromium } = await import("@playwright/test");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent("<h1>Worker browser ready</h1>");
  assert.equal(await page.locator("h1").textContent(), "Worker browser ready");
} finally {
  await browser.close();
}
console.log(
  "Docker smoke passed: exact source/ancestry, package install, no capabilities, actual permission denial and headless browser",
);
