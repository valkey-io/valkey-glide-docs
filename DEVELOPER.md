# Developer

This guide covers the developer workflow for the Valkey GLIDE documentation site. It explains how to set up your environment, build and preview the site locally, check links, and keep your changes formatted and lint-clean before opening a pull request.

The site is built with [Starlight](https://starlight.astro.build/), an [Astro](https://astro.build/) framework for static documentation sites. Pages are authored in Markdown/MDX under `src/content/docs/`.

## Requirements

You will need the following installed locally:

- [Node.js](https://nodejs.org/) **v20 or newer**
- [pnpm](https://pnpm.io/) **v10 or newer** — install via `brew install pnpm` or `npm install -g pnpm`
- [Git](https://git-scm.com/) — for cloning the repository and committing changes
- [lychee](https://github.com/lycheeverse/lychee) — only required if you want to run the link checker locally (`brew install lychee`)

### Clone and install

```bash
git clone git@github.com:valkey-io/valkey-glide-docs.git
cd valkey-glide-docs
pnpm install
```

`pnpm install` reads `package.json` / `pnpm-lock.yaml` and installs all dependencies into `node_modules/`.

## Build

The project uses `pnpm` scripts defined in `package.json`. The commands you will use most often are listed below.

### Development server

Start a local hot-reloading dev server:

```bash
pnpm dev
```

By default Astro serves the site at [http://localhost:4321](http://localhost:4321). Edits to `.mdx` files and components are reflected automatically.

### Production build

Build the static site into the `dist/` directory:

```bash
pnpm build

# Preview the production build
pnpm preview 
```

This is the same build that runs in CI. You should run it locally before opening a PR to make sure your changes compile cleanly. See [Pre-PR Checks](#pre-pr-checks) below.

## Link Checker

We use [lychee](https://github.com/lycheeverse/lychee) to check for broken links. Configuration rules (exclusions) are defined in our `lychee.toml`.

To start, install `lychee`.

```bash
brew install lychee
```

Then to run the build and check links:

```bash
pnpm build:check-links
```

This runs `pnpm build` followed by `lychee` against the generated `dist/` directory. The same check runs in CI, so fixing link issues locally will save a round-trip on your PR.

## Code Style & Formatting

The project uses [Prettier](https://prettier.io/) for general formatting and [remark](https://github.com/remarkjs/remark) for MDX/Markdown linting. Configuration is in `.prettierrc.json` and `.remarkrc.json`.

Run formatting before submitting a PR:

```bash
pnpm format
```

This runs two steps:

- `format:non-mdx` — runs Prettier across the repo (`.astro`, `.ts`, `.json`, etc.).
- `format:mdx` — runs `remark` over `src/content/docs/**/*.{md,mdx}` and applies a small post-processing fix (`scripts/fix-remark-escapes.sh`) to work around over-aggressive escaping in MDX files.

To check formatting without modifying files:

```bash
pnpm format:check
```

This runs `prettier --check` and then `scripts/check-format.sh`, which wraps `remark` and filters out known false-positive warnings from Starlight's shorthand aside syntax (for example, `[!NOTE]`). CI uses the same script, so if it passes locally it should pass in CI as well.

## Pre-PR Checks

Before opening a pull request, always run:

```bash
pnpm build
pnpm format
```

Then commit any changes that `pnpm format` makes. This order matters — build first to catch compile errors, then format to keep the tree consistent.

### Commit signoff

All commits must include a Developer Certificate of Origin (DCO) signoff:

```bash
git commit --signoff -m "Your commit message"

# Auto sign all commits. Requires git 2.36+
git config --global format.signOff true
```

Make sure `user.name` and `user.email` are configured (`git config user.name` / `git config user.email`) so the signoff line reflects the correct identity.

> **Note:** The DCO check is **case-sensitive** for both the name and email address. Make sure it matches the trailer produced by your signoff.
