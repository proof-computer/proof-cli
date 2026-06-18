import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));

const requiredArtifacts = [
  "bin/run.js",
  "dist/commands/about.js",
  "oclif.manifest.json",
  "README.md"
];
const requiredFilesEntries = [
  "bin",
  "dist",
  "oclif.manifest.json",
  "README.md"
];
const forbiddenRootDependencies = [
  "@proof-computer/proof-cli-blackbox",
  "@proof-computer/proof-cli-lockbox",
  "@proof-computer/proof-cli-liskov",
  "@proof/blackbox-cli"
];

const errors = [];

for (const artifact of requiredArtifacts) {
  try {
    await access(path.join(repoRoot, artifact));
  } catch {
    errors.push(`Missing package artifact: ${artifact}`);
  }
}

for (const entry of requiredFilesEntries) {
  if (!packageJson.files?.includes(entry)) {
    errors.push(`package.json files must include ${entry}`);
  }
}

if (packageJson.bin?.proof !== "bin/run.js") {
  errors.push("package.json bin.proof must point to bin/run.js");
}

const dependencyBlocks = [
  packageJson.dependencies ?? {},
  packageJson.devDependencies ?? {},
  packageJson.optionalDependencies ?? {},
  packageJson.peerDependencies ?? {}
];
for (const forbidden of forbiddenRootDependencies) {
  if (dependencyBlocks.some((block) => Object.hasOwn(block, forbidden))) {
    errors.push(`Root proof CLI must not depend on private product plugin ${forbidden}`);
  }
}

if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

console.log("Package artifacts verified.");
