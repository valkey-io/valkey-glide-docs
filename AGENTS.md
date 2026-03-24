# Commands

Useful commands for this project.

## Build

Run the build command to compile the project.

```bash
pnpm build
```

### What It Does {#what-build-does}

1. Runs `astro build`, which compiles the entire Astro site into the `dist/` directory.

## Check Links

Run the link check command to verify all links in the project are valid.

```bash
pnpm check:links
```

### What It Does {#what-check-links-does}

1. Runs [Lychee](https://lychee.cli.rs/) against the built `dist/` directory to validate all links.
2. Uses `lychee.toml` for configuration, which excludes certain paths (e.g., API docs, 404 page) and URL patterns (e.g., GitHub edit links, the live site URL) from checking.
3. Retries failed links up to 3 times with a 10-second wait between attempts.

## Format

Run the format command to apply consistent code style across the project.

```bash
pnpm format
```

### What It Does {#what-format-does}

1. Runs Prettier on all non-MDX files (JSON, JS, TS, Astro, etc.) - `pnpm format:non-mdx`.
2. Runs Remark on all `.md` and `.mdx` files under `src/content/docs/` - `pnpm format:mdx`.

### Related Commands

To format a subset of files:

```bash
pnpm run format:non-mdx   # Non-content files only
pnpm run format:mdx       # Markdown/MDX content only
```

To check formatting without applying changes:

```bash
pnpm run format:check
pnpm run format:check:non-mdx   # Non-content files only
pnpm run format:check:mdx       # Markdown/MDX content only
```
