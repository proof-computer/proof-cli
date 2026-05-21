# PROOF CLI

`proof` is the public umbrella command line interface for PROOF products.

The root package owns the binary, plugin loading, help, versioning, and package
verification. Product commands are provided by oclif plugins.

## Install

```fish
npm install --global @proof-computer/proof-cli
proof --help
```

## Product Plugins

Switchboard will be the first public plugin:

```fish
proof plugins install @proof-computer/proof-cli-switchboard
proof switchboard --help
```

Blackbox, Lockbox, and Slipway plugins remain private until those product
surfaces are intentionally exposed.

## Development

```fish
pnpm install
pnpm test
pnpm build
./bin/dev.js about
```

Package-surface checks:

```fish
pnpm typecheck
pnpm test
pnpm build
node scripts/verify-package.mjs
pnpm pack:dry-run
pnpm smoke:pack
```

## Plugin Contract

- Product plugins own one top-level topic such as `switchboard`, `blackbox`,
  `lockbox`, or `slipway`.
- The public root package must not depend on private product plugins.
- Compatibility bins such as `switchboard` and `blackbox` stay in their
  product repos during migration and should delegate to shared command
  implementations rather than fork behavior.
