# Agent Instructions

This repository owns the public PROOF umbrella CLI, exported as the `proof`
binary.

## Boundaries

- Keep this repo as the root CLI package only.
- Do not add private product plugins as root dependencies.
- Product command implementations belong in plugins. Switchboard is the first
  public plugin; Blackbox, Lockbox, and Slipway remain private until explicitly
  exposed.
- Preserve compatibility bins in product repos during migration. Do not fork
  behavior between `proof <product> ...` and existing product binaries.

## CLI Development Guidance

When changing root CLI behavior, review Liran Tal's Node.js CLI Apps Best
Practices and its agent-oriented skill:

- https://github.com/lirantal/nodejs-cli-apps-best-practices
- https://github.com/lirantal/nodejs-cli-apps-best-practices/tree/main/skills/nodejs-cli-best-practices

Use it as a checklist for POSIX-style arguments, plugin/user help, structured
output, config precedence, actionable errors, exit codes, version output,
package `files`, opt-in analytics, and argument-injection safety. Keep this
repo's public-root and no-private-plugin boundaries stricter where they apply.

## Verification

Before shipping package-surface changes, run:

```fish
pnpm typecheck
pnpm test
pnpm build
node scripts/verify-package.mjs
pnpm pack:dry-run
pnpm smoke:pack
```

Recheck npm package-name availability before the first public publish.
