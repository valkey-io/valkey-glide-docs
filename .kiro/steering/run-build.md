# Build

Run the build command to compile the project.

## Command

```bash
pnpm build
```

## What It Does

Runs `astro build`, which compiles the entire Astro site into the `dist/` directory.

## Optional: Build + Link Check

To also check for broken internal links after building:

```bash
pnpm run build:check-links
```
