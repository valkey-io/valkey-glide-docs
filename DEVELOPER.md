# Developer Guide

This guide covers the developer workflow for the Valkey GLIDE documentation site.

The site is built with [Starlight](https://starlight.astro.build/), an [Astro](https://astro.build/) framework for static documentation sites. 

## Requirements

You will need the following installed locally:

- [Node.js](https://nodejs.org/) **v20 or newer**
- [pnpm](https://pnpm.io/) **v10 or newer**. [Npm](https://www.npmjs.com/) is fine as well.
- [Git](https://git-scm.com/) — for cloning the repository and committing changes
- [lychee](https://github.com/lycheeverse/lychee) — only required if you want to run the link checker locally (`brew install lychee`)

### Clone and install

```bash
git clone git@github.com:valkey-io/valkey-glide-docs.git
cd valkey-glide-docs
pnpm install
```

## Build

Various build commands are available.

### Development server

To start a local hot-reloading dev server:

```bash
pnpm dev
```

### Production build

Build the static site into the `dist/` directory:

```bash
pnpm build

# Preview the production build including the search bar.
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
# Build then check links
pnpm build:check-links
```

This runs `pnpm build` followed by `lychee` against the generated `dist/` directory.

## Code Style & Formatting

The project uses [Prettier](https://prettier.io/) for general formatting and [remark](https://github.com/remarkjs/remark) for MDX/Markdown linting. Configuration is in `.prettierrc.json` and `.remarkrc.json`.

Run formatting before submitting a PR:

```bash
# Apply formatting
pnpm format

# Check format only
pnpm format:check
```

### Commit signoff

All commits must include a Developer Certificate of Origin (DCO) signoff:

```bash
git commit --signoff -m "Your commit message"

# Auto sign all commits. Requires git 2.36+
git config --global format.signOff true
```

Make sure `user.name` and `user.email` are configured correctly to reflect your credentials.

> **Note:** The DCO check is **case-sensitive** for both the name and email address. Make sure it matches the trailer produced by your signoff.
