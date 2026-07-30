# Contributing to Valkey GLIDE Documentation

Thank you for your interest in contributing to the Valkey GLIDE documentation!

## Deployment Model

We use two branches:

| Branch   | Purpose                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------- |
| `main`   | Integration branch. Source of truth. All PRs target here. Content on `main` is awaiting release.      |
| `public` | Production branch. deploys the live site at [glide.valkey.io](https://glide.valkey.io) on every push. |

All documentation changes flow through `main` first, then are promoted to `public` on release.

### Contribution Flow

1. Open your PR against `main`.
2. Once approved and CI passes, merge to `main`. Merge early and often to avoid big-bang release-day merges.
3. Content sits on `main` until the next release.

### Release Process

`main` is the source of truth. On release day, a maintainer resets `public` to `main`'s HEAD and force-pushes:

```bash
git fetch origin
git push origin +origin/main:public
```

Any contents on `main` that isn't ready to go live should be disabled (see [Unreleased Content](#unreleased-content)).

### Applying a Hotfix

For urgent fixes to the live site that can't wait for the next release:

1. Open a PR targeting `public`.
2. Once merged, deployment will start automatically.
3. **Backport the same change to `main` immediately**. Because releases reset `public` to `main` HEAD, any hotfix that isn't on `main` before the next release will be erased.

### Unreleased Content

Content that has landed on `main` but isn't ready for release yet must be marked as draft so it doesn't appear on the live site when `public` is next updated.

**Draft Page** — set `draft: true` in frontmatter. The page is excluded from production builds but visible in `pnpm dev`. Always include a `draft-reason` so releases can locate what to unflip.

```
---
title: My New Feature
description: ...
draft: true
draft-reason: For release 2.5
---
```

Remove the page from sidebar entry in `astro.config.mjs` as it will fail the build if linked explicitly.

**Draft Section** (e.g., one language's example tab) — wrap the section in the `<Draft>` component. Always include a `draft-reason`.

```mdx
import Draft from "@components/Draft.astro";

<Tabs syncKey="progLangInExamples">
  <TabItem label="Python">...</TabItem>
  <Draft draft-reason="For release 2.5">
    <TabItem label="Ruby">...</TabItem>
  </Draft>
</Tabs>
```

## Getting Started

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone git@github.com:<your-username>/valkey-glide-docs.git
   cd valkey-glide-docs
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the dev server:

   ```bash
   pnpm dev
   ```

## Making Changes

1. Create a branch from `main`:

   ```bash
   git checkout -b your-username/short-description
   ```

2. Make your changes in `src/content/docs/`
3. Verify your changes build correctly:

   ```bash
   pnpm build
   ```

4. Format your code:

   ```bash
   pnpm format
   ```

## Commit Guidelines

All commits must be signed off to certify the [Developer Certificate of Origin (DCO)](https://developercertificate.org/):

```bash
git commit --signoff -m "Your commit message"
```

## Submitting a Pull Request

1. Push your branch to your fork
2. Open a PR targeting `main`
3. Ensure CI checks pass (build, formatting, link validation)
4. Feel free a ping a maintainer for review.

## Code Standards

- Run `pnpm format` before committing
- Run `pnpm build` to catch broken internal links
- Use relative links for internal pages
- Every `.mdx` file must include `title` and `description` in frontmatter

## Reporting Issues

For any bugs, issues, or suggestions feel free to create an issue on our Github.

## AI Agent Support

This project includes an [AGENTS.md](./AGENTS.md) file that provides AI coding agents with project context, architecture details, build commands, and content guidelines.
