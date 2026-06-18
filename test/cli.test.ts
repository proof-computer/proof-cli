import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const devBin = path.join(repoRoot, "bin", "dev.js");

test("prints help with no arguments", () => {
  const result = runProof([]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /PROOF command line interface/u);
  assert.match(result.stdout, /about/u);
});

test("prints about information", () => {
  const result = runProof(["about"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /proof 0\.2\.0/u);
  assert.match(result.stdout, /@proof-computer\/proof-cli-baran/u);
  assert.match(result.stdout, /@proof-computer\/proof-cli-blackbox/u);
  assert.match(result.stdout, /Private plugins: Lockbox, Liskov/u);
});

test("loads oclif plugin management help", () => {
  const result = runProof(["plugins", "--help"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /List installed plugins/u);
});

function runProof(args: readonly string[]) {
  return spawnSync(process.execPath, ["--import", "tsx", devBin, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "test"
    }
  });
}
