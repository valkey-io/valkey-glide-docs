# Contributing to Valkey GLIDE Documentation

Thank you for your interest in contributing to the Valkey GLIDE documentation!

## Branches Overview

| Branch   | Purpose                                                                          |
| -------- | -------------------------------------------------------------------------------- |
| `main`   | Integration branch — all PRs target here                                         |
| `public` | Production — deploys the live site at [glide.valkey.io](https://glide.valkey.io) |

In general:

- Open all PRs against `main`.
- On release day, `main` is merged onto `public` triggering a deployment.
- Only urgent fixes are accepted directly into `public`.

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
