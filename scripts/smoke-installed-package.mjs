import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const prefix = await mkdtemp(path.join(tmpdir(), "proof-cli-smoke-"));
let tarballPath;

try {
  const npmCache = path.join(prefix, "npm-cache");
  const pack = run("npm", ["pack", "--json", "--ignore-scripts", "--cache", npmCache], { cwd: repoRoot });
  const tarball = JSON.parse(pack.stdout)[0]?.filename;
  if (!tarball) {
    throw new Error("npm pack did not report a tarball filename");
  }
  tarballPath = path.join(repoRoot, tarball);

  run("npm", ["install", "--global", "--prefix", prefix, "--cache", npmCache, tarballPath], { cwd: repoRoot });

  const proofBin = path.join(prefix, "bin", process.platform === "win32" ? "proof.cmd" : "proof");
  const help = run(proofBin, ["--help"]);
  assertIncludes(help.stdout, "PROOF command line interface");
  assertIncludes(help.stdout, "about");

  const about = run(proofBin, ["about"]);
  assertIncludes(about.stdout, "proof 0.1.2");
  assertIncludes(about.stdout, "@proof-computer/proof-cli-switchboard");

  console.log("Installed package smoke passed.");
} finally {
  if (tarballPath) {
    await rm(tarballPath, { force: true });
  }
  await rm(prefix, { recursive: true, force: true });
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    env: process.env,
    shell: false
  });
  if (result.status !== 0) {
    throw new Error([
      `Command failed: ${command} ${args.join(" ")}`,
      `exit: ${result.status}`,
      result.stdout,
      result.stderr
    ].filter(Boolean).join("\n"));
  }
  return result;
}

function assertIncludes(value, expected) {
  if (!value.includes(expected)) {
    throw new Error(`Expected output to include ${JSON.stringify(expected)}.\nOutput:\n${value}`);
  }
}
