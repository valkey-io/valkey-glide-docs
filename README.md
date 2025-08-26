# Valkey Glide Documentations

The home of great documentation for Valkey GLIDE.  

The public site can be found at:
https://valkey.io/valkey-glide-docs/

The documentation will
- have a developer's perspective
- take the best parts of the existing documentation, consolidated and upgraded to best-in-class content
- Deliver a superior onboarding experience
- deliver an effective sales pitch indicating why GLIDE is the best choice in its class

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
```

For development, run `pnpm dev`. It will spin up a hot-loading development server to serve  the documentation pages. 

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

For more informations Starlight and its feature, see the [documentations](https://starlight.astro.build/getting-started/).
