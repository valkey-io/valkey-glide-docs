# Valkey GLIDE — Shared Agent Context

## What is Valkey GLIDE?

Valkey GLIDE (General Language Independent Driver for the Enterprise) is the official open-source client library for Valkey. It supports all Valkey commands across multiple languages through a shared Rust core.

**Source repo**: https://github.com/valkey-io/valkey-glide

### Supported Languages

- Node.js (TypeScript/CJS/MJS)
- Java
- Python (asyncio/anyio/trio)
- Go
- C#: valkey-io/valkey-glide-csharp
- Php: valkey-io/valkey-glide-php

### Key Facts

- Shared Rust core delivers consistent behavior across all language clients
- API-compatible with Redis OSS 6.2, 7.0, 7.1, 7.2
- Valkey is a fork of Redis; most Redis commands apply to Valkey
- Pre-configured with best practices from operating Redis-compatible services at scale

### Client Features

- AZ Affinity (route reads to same-zone replicas)
- PubSub with auto-reconnection and sharded PubSub
- Cluster-aware multi-key commands (MGET/MSET/DEL)
- Cluster Scan (unified key iteration across shards)
- Batching (pipeline and transaction)
- OpenTelemetry tracing
- Client-side caching
- Compression
- Modules API (JSON, Search)
- Lua scripting and server-side functions

---

## Architecture

### Rust Core

GLIDE uses a unified Rust core that handles all low-level client-server communication. Language clients are thin wrappers around this core via FFI (Foreign Function Interface).

```
Application Code → Language Binding → FFI Boundary → Rust Core → Valkey Server
```

The Rust core handles:
- Command routing (which node receives each command)
- Connection management
- RESP protocol handling
- Cluster topology tracking
- Retry logic and error handling

### Connection Multiplexing

GLIDE uses **connection multiplexing** — all requests go through a single connection per node (not a connection pool). Combined with Valkey's pipelining, the core sends requests without waiting for responses, achieving high throughput with minimal connections.

A single client instance (single connection) is the recommended pattern for best performance.

### Async Patterns by Language

- **Python**: async/await (also has a separate sync client via `valkey-glide-sync`)
- **Node.js**: Promises
- **Java**: CompletableFuture
- **Go**: blocking but goroutine-safe
- **C#**: async/await (Task-based)
- **PHP**: synchronous blocking (Rust core still multiplexes underneath)

---

## Docs Site

**Live site**: https://glide.valkey.io
**Docs repo**: https://github.com/valkey-io/valkey-glide-docs
**Framework**: Astro Starlight (static docs site)
**Package manager**: pnpm

### Content Structure

```
src/content/docs/
├── index.mdx                        # Landing page
├── overview.mdx                     # Product overview
├── releases.mdx                     # Release notes
├── troubleshooting.mdx              # Troubleshooting guide
├── feedback-and-support.mdx         # Support info
├── getting-started/                 # Quickstart, basic operations
├── commands/                        # Command reference pages
├── concepts/
│   ├── architecture/                # Rust core, async execution, memory model
│   └── client-features/             # Caching, compression, pub/sub, scripting, batch, modules, scan
├── how-to/
│   ├── connections/                 # Read strategy, timeouts, lazy connection, inflight limits
│   ├── security/                    # TLS, auth, IAM, dynamic auth
│   ├── monitoring/                  # Logging, OpenTelemetry, resource tracking
│   └── modules-api/                 # JSON module, search module
├── tutorials/                       # Lua scripting, pub/sub tutorials
├── migration/                       # Per-language guides (from Jedis, Lettuce, ioredis, go-redis, phpredis)
├── reference/                       # Connection options, command progress, known issues, scripting ref
└── commons/                         # Shared content snippets (reusable across pages)
```

### Page Format

All pages are `.mdx` files with required frontmatter:

```mdx
---
title: Page Title
---

Content here...
```

- Use absolute paths for internal links (relative links cause build errors)
- Sidebar navigation is configured in `astro.config.mjs`
- Code examples use language-tagged fenced blocks (```python, ```java, ```typescript, ```go)

### Build & Format

```bash
pnpm build          # Compile site (also validates internal links)
pnpm format         # Apply formatting (Prettier + Remark)
pnpm check:links    # Validate external links with lychee
```

### CI Checks

- `pnpm format:check` — formatting validation
- `pnpm build` — compilation + internal link validation (starlight-links-validator)
- lychee — external link validation

---

## Valkey vs Redis — What Agents Should Know

- Valkey is a community-driven fork of Redis (post-license change)
- Valkey commands are largely identical to Redis commands
- GLIDE supports both Valkey and Redis OSS servers
- When documenting commands, reference Valkey semantics but note Redis compatibility
- Valkey 8.0+ introduces features not in Redis (e.g., AZ affinity)
