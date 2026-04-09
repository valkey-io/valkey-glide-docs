# Valkey GLIDE Documentation

This repository host the source for the Valkey GLIDE documentation [site](https://glide.valkey.io).

## Technology

The site is built with [Starlight](https://starlight.astro.build/), an Astro framework for building static documentation sites.

The framework provides out-of-the-box features for building documentations like components, site search, navigation, and integrations with MDX files. It also leverages Astro's features like island architecture to build dynamic components.

## Getting Started

First clone the repo and install the required tools.

```bash
git clone git@github.com:valkey-io/valkey-glide-docs.git

# npm is fine too.
brew install pnpm
```

Then install the dependencies

```bash
cd ./valkey-glide-docs
pnpm install
```

For development, run `pnpm dev`. It will spin up a hot-loading development server to serve the documentation pages.

### Link Checker

We use [lychee](https://github.com/lycheeverse/lychee) to check for broken links. Configuration rules (exclusions) are defined in our `lychee.toml`.

To start, install `lychee`.

```bash
brew install lychee
```

Then to run the build and check links:

```bash
pnpm build:check-links
```

## Making Content Changes

In general, page contents are located under `src/content/docs`.

- For simple content update, change the appropriate `.mdx` files in the folder structure.
- To create a new page, add a new `.mdx` file under `src/content/docs`.
- To change the navigation sidebar, update `astro.config.mjs`.

Note that all `.mdx` files requires a frontmatter.

```
---
title: Your page title.
---

Your contents follows ...
```
