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

Baran, Blackbox, and Liskov are public plugins:

```fish
proof plugins install @proof-computer/proof-cli-baran
proof baran --help
proof plugins install @proof-computer/proof-cli-blackbox
proof blackbox --help
proof plugins install @proof-computer/proof-cli-liskov
proof liskov --help
```

The Lockbox plugin remains private until that product surface is
intentionally exposed.

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

- Product plugins own one top-level topic such as `baran`, `blackbox`,
  `lockbox`, or `liskov`.
- The public root package must not depend on private product plugins.
- Compatibility bins such as `baran` and `blackbox` stay in their
  product repos during migration and should delegate to shared command
  implementations rather than fork behavior.
