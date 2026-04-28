# Valkey GLIDE Documentation

Welcome to the Valkey GLIDE documentation repository. The site is available at https://glide.valkey.io.

> **Note:** This repository contains only the documentation of Valkey GLIDE.
> To contribute to the Valkey GLIDE client library itself, visit [valkey-glide](https://github.com/valkey-io/valkey-glide/).

## Overview

The site is built with [Starlight](https://starlight.astro.build/), an Astro framework for building static documentation sites.

The framework provides out-of-the-box features for building documentations like UI components, site search, navigation, all using a Markdown like syntax. It also leverages Astro's features to build custom dynamic components.
This aims to allow contributors to quickly add or edit existing pages using familiar Markdown syntax, while having the options to extend the site with modern Javascript components.

## Getting Started

You'll need the following installed:

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+ (`brew install pnpm` or `npm install -g pnpm`)

Then clone the repo and install dependencies:

```bash
git clone git@github.com:valkey-io/valkey-glide-docs.git
cd ./valkey-glide-docs
pnpm install
```

For development, run `pnpm dev`. It will spin up a hot-loading development server to serve the documentation pages.

### Making Changes

Page content lives under `src/content/docs/` as `.mdx` files.

- **Edit a page:** Modify the corresponding `.mdx` file.
- **Add a new page:** Create a new `.mdx` file under `src/content/docs/`. Every file requires frontmatter:

  ```mdx
  ---
  title: Your page title
  ---

  Your content follows...
  ```

- **Update the sidebar navigation:** Add your new page to `astro.config.mjs`.

For a guidelines on how to write new articles, take a look at our [Contributing](/CONTRIBUTING.md) page.

## Commit Requirements

All commits must include the `--signoff` flag to certify the [Developer Certificate of Origin (DCO)](https://developercertificate.org/).

## Link Checker

We use [lychee](https://github.com/lycheeverse/lychee) to check for broken links. Configuration rules (exclusions) are defined in our `lychee.toml`.

To start, install `lychee`.

```bash
# macOS
brew install lychee

# Ubuntu
sudo snap install lychee
```

Then to run the build and check links:

```bash
pnpm build:check-links
```

## Code Style & Formatting

The project uses [Prettier](https://prettier.io/) for general formatting and [remark](https://github.com/remarkjs/remark) for MDX/Markdown linting. Configuration is in `.prettierrc.json` and `.remarkrc.json`.

Run formatting before submitting a PR:

```bash
pnpm format
```

To check formatting without modifying files:

```bash
pnpm format:check
```
