# Code Formatting

Run the format command to apply consistent code style across the project.

## Command

```bash
pnpm format
```

## What It Does

Runs two formatters in sequence:

1. `pnpm format:non-mdx` — runs Prettier on all non-MDX files (JSON, JS, TS, Astro, etc.)
2. `pnpm format:mdx` — runs Remark on all `.md` and `.mdx` files under `src/content/docs/`

## Targeted Formatting

If you only need to format a subset of files:

```bash
pnpm run format:non-mdx   # Non-content files only
pnpm run format:mdx       # Markdown/MDX content only
```

## Checking Without Modifying

To check formatting without applying changes:

```bash
pnpm run format:check
```
