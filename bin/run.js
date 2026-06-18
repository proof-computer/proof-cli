#!/usr/bin/env node
import { execute } from "@oclif/core";

if (process.argv.length <= 2) {
  process.argv.push("--help");
} else {
  preserveCompatibilityHelpFlags(process.argv);
}

await execute({ dir: import.meta.url });

function preserveCompatibilityHelpFlags(argv) {
  const args = argv.slice(2);
  if (args[0] !== "baran" || args.includes("--")) {
    return;
  }
  const helpIndex = args.indexOf("--help");
  if (helpIndex >= 0) {
    argv.splice(2 + helpIndex, 0, "--");
  }
}
