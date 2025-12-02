# Valkey GLIDE Documentation

The home of documentation for Valkey GLIDE.

## Technology

The site is built with [Starlight](https://starlight.astro.build/), an Astro framework for building static documentation sites.

The framework provides out-of-the-box features for building documentations like components, site search, navigations, and integrations with MDX files. It also leverages Astro's features like island architecture to build dynamic components.

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
brew install lychee
```

For development, run `pnpm dev`. It will spin up a hot-loading development server to serve the documentation pages.

### Link Checker
We use [lychee](https://github.com/lycheeverse/lychee) to check for broken links. Configuration rules (exclusions) are defined in our `lychee.toml`.

`pnpm build` is configured to run `lychee` afterwards. If not installed, you will see this after building.
```bash

...

15:52:11 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
15:52:11 [build] 173 page(s) built in 16.07s
15:52:11 [build] Complete!

> lychee "$PWD/dist" --root-dir "$PWD/dist"
sh: lychee: command not found
```

To build without link checking, use:
```bash
pnpm astro build
```

Or to check links only:
```bash
pnpm check-links
```

## Making Content Changes

In general, page contents are located under `src/content/docs`.

- For simple content changes, update the appropriate `.mdx` files in the folder structure.
- To create a new page, add a new `.mdx` file under `src/content/docs`.
- To change the navigation bar, udpate `astro.config.mjs`.

Note that all `.mdx` files requires a header.

```
---
title: Your page title.
---
```

## Link Checking
We use [lychee](https://github.com/lycheeverse/lychee) to check for broken links. Configuration rules (exclusions) are defined in our `lychee.toml`.

If you haven't already, install the tool via Homebrew (macOS) or Cargo.

```bash
brew install lychee
# OR
cargo install lychee
```
The link checker scans the generated HTML files, so you must build the site output first.
Then run the following command to check the ./dist folder. 
We pass the root directory dynamically using $PWD to ensure absolute paths resolve correctly in any environment.

```bash
# Make sure to build before running the check.
pnpm build

lychee ./dist --root-dir "$PWD/dist"
```
