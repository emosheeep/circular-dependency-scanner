# Contributing

Thanks for helping improve circular-dependency-scanner.

## Prerequisites

- Node.js 22.13 or newer
- Corepack, using the pnpm version declared in `package.json`
- The stable Rust toolchain
- The `wasm32-unknown-unknown` Rust target
- wasm-pack

Set up the toolchains and install dependencies:

```bash
corepack enable
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --locked
pnpm install --frozen-lockfile
```

## Development

```bash
pnpm build          # Build the Rust/WASM bridge and JavaScript package
pnpm watch          # Build WASM once, then watch the JavaScript package
pnpm test
pnpm lint:check
pnpm format:check
```

The `wasm/`, `dist/`, and `target/` directories are generated locally and must
not be committed. `npm pack` builds the package through the `prepack` lifecycle
and includes the final WASM binary from `dist/`.

Before opening a pull request, run:

```bash
cargo test --locked
cargo clippy --all-targets --all-features --locked -- -D warnings
pnpm lint:check
pnpm format:check
pnpm test
npm pack --dry-run
```

For a user-visible change, add a changeset with `pnpm changeset`. Commit messages
must follow the Conventional Commits format enforced by the repository hooks.
