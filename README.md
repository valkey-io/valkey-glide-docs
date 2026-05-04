# Valkey GLIDE Documentation

Welcome to the Valkey GLIDE documentation repository. The site is available at https://glide.valkey.io.

> **Note:** This repository contains only the documentation of Valkey GLIDE.
> To contribute to the Valkey GLIDE client library itself, visit [valkey-glide](https://github.com/valkey-io/valkey-glide/).

## Overview

The site is built with [Starlight](https://starlight.astro.build/), an Astro framework for building static documentation sites.

The framework provides out-of-the-box features for building documentations like UI components, site search, navigation, all using a Markdown like syntax. It also leverages Astro's features to build custom dynamic components.
This aims to allow contributors to quickly add or edit existing pages using familiar Markdown syntax, while having the options to extend the site with modern Javascript components.

## Getting Started

Clone the repo and install dependencies with npm:

```bash
git clone git@github.com:valkey-io/valkey-glide-docs.git
cd ./valkey-glide-docs
pnpm install

# Start a hot-loading dev server.
pnpm dev
```

See [DEVELOPER](DEVELOPER.md) for the full developer instructions.

## Making Changes

For more on making your first contribution, see our [CONTRIBUTING](CONTRIBUTING.md) page.
