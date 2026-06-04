# Valkey GLIDE Documentation

This is the documentation site for [Valkey GLIDE](https://github.com/valkey-io/valkey-glide), an open-source multi-language client library for [Valkey](https://valkey.io/) (a Redis-compatible in-memory data store). The site is live at https://glide.valkey.io.

## Supported Languages

GLIDE provides client implementations in multiple languages, all sharing a common Rust core:

| Language | Source Repository                                          |
| -------- | ---------------------------------------------------------- |
| Java     | https://github.com/valkey-io/valkey-glide/tree/main/java   |
| Python   | https://github.com/valkey-io/valkey-glide/tree/main/python |
| Node.js  | https://github.com/valkey-io/valkey-glide/tree/main/node   |
| Go       | https://github.com/valkey-io/valkey-glide/tree/main/go     |
| C#       | https://github.com/valkey-io/valkey-glide-csharp           |
| PHP      | https://github.com/valkey-io/valkey-glide-php              |

The core Rust engine lives at https://github.com/valkey-io/valkey-glide/tree/main/glide-core and provides the shared connection management, routing, and protocol logic that all language clients wrap.

## Project Overview

- **Framework**: Astro 5 + Starlight (documentation theme)
- **Package manager**: pnpm
- **Content**: MDX files in `src/content/docs/`
- **Build output**: `dist/`
- **Sidebar/navigation**: Defined in `astro.config.mjs`

## Documentation Framework (Diátaxis)

This documentation follows the [Diátaxis framework](https://diataxis.fr/), which organizes content into four distinct types based on user needs:

| Type              | Purpose                                                            | Writing style                                          | Maps to      |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------ | ------------ |
| **Tutorials**     | Learning-oriented — guide a beginner through a complete experience | Step-by-step, hand-holding, focused on doing           | `tutorials/` |
| **How-To Guides** | Task-oriented — help a practitioner accomplish a specific goal     | Practical steps, assumes knowledge, focused on results | `how-to/`    |
| **Concepts**      | Understanding-oriented — explain how and why things work           | Discursive, clarifying, focused on thinking            | `concepts/`  |
| **Reference**     | Information-oriented — describe the machinery precisely            | Austere, accurate, focused on completeness             | `reference/` |

When writing or editing content, place it in the correct category:

- **Don't** mix explanation into a how-to guide — link to a concept page instead
- **Don't** turn a tutorial into a reference by listing all options — keep it focused on one learning path
- **Don't** put procedural steps in a concept page — move them to a how-to guide
- A tutorial says "do this, then this" and the reader learns by completing it
- A how-to guide says "to achieve X, do Y" and the reader already knows what they want
- A concept page says "X works this way because..." and the reader gains understanding
- A reference page says "X accepts these parameters..." and the reader looks up specifics

## Content Structure

- `src/content/docs/` — all documentation pages (MDX)
  - `getting-started/` — quickstart and basic operations (tutorials)
  - `concepts/` — architecture (Rust core, async, memory model) and client features (explanation)
  - `how-to/` — guides for installation, connections, security, monitoring, modules (how-to)
  - `migration/` — migration guides from other clients (how-to)
  - `tutorials/` — TLS, Lua scripting, Pub/Sub (tutorials)
  - `reference/` — access control, scripting, client comparisons, connection options, known issues (reference)
- `public/` — static assets (favicons, CNAME)
- `src/assets/` — logos and images
- `src/components/` — custom Astro components
- `src/styles/` — custom CSS
- `doc-gen/` — scripts to generate API docs from the main valkey-glide repo
- `plugins/` — custom Astro/Starlight plugins

## Content Guidelines

- Each MDX page should have frontmatter with `title` and `description` fields
- The `description` field is used for SEO and should be a concise summary of the page content
- Internal links are validated at build time by `starlight-links-validator`
- Use relative links for internal pages, not absolute URLs

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
