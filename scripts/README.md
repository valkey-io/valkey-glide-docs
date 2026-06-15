# Documentation example validation

These scripts check that the code examples embedded in the docs
(`src/content/docs/**/*.mdx`) actually compile, so a broken snippet is
caught in CI instead of by a reader.

The work is split in two, exactly as it was first built for C#:

| Half                      | Lives in               | Responsibility                                                               |
| ------------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| **Extraction + plumbing** | this repo (`scripts/`) | Pull the fenced code blocks for a language out of the MDX and hand them off. |
| **Wrapping + compiling**  | each client's own repo | Wrap each snippet, compile it against the real client build, report errors.  |

This repo owns only the first half. Each language is validated by a
`validate_examples.py` script that lives in that language's client
repository, because that repo is the one that knows how to wrap a snippet
and build the client. The C# validator already exists in
[`valkey-glide-csharp`](https://github.com/valkey-io/valkey-glide-csharp);
the other languages activate automatically once their upstream validator
lands (see [Status](#per-language-status)).

## Scripts

| Script                     | What it does                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `extract_examples.py`      | Shared extractor. Walks the docs and returns `{ "<file>:<line>": "<code>" }` for one language. Library **and** CLI.            |
| `check_examples.py`        | Generic orchestrator. Extracts a language's examples, writes them to a temp JSON file, and runs the upstream validator.        |
| `check_csharp_examples.py` | Thin backwards-compatible wrapper around `check_examples.py --language csharp`, kept so the existing C# workflow is unchanged. |

### Local usage

```bash
# List the languages and the Markdown fences each one matches.
python scripts/extract_examples.py --list-languages

# Dump the extracted examples for a language (debugging).
python scripts/extract_examples.py --language go --out /tmp/go.json

# Run a language's validator (requires a checkout of that client repo
# and a build of its artifact):
python scripts/check_examples.py \
    --language csharp \
    --validator ../valkey-glide-csharp/dev/scripts/validate_examples.py \
    -- --glide-dll ../valkey-glide-csharp/sources/Valkey.Glide/bin/Release/net8.0/Valkey.Glide.dll
```

Everything after `--` is forwarded verbatim to the validator, so each
language passes whatever artifact reference it needs.

## The validator contract

To enable validation for a language, add a `validate_examples.py` to that
language's client repository that honors this contract. The docs-side
orchestrator (`check_examples.py`) invokes it as:

```bash
python <validator> --examples <examples.json> [language-specific args...]
```

**Input** — `--examples` points at a JSON object mapping a source location
to a code snippet:

```json
{
  "src/content/docs/getting-started/quickstart.mdx:342": "using Valkey.Glide;\n// ...\n",
  "src/content/docs/how-to/security/tls.mdx:445": "// ...\n"
}
```

The key is `"<repo-relative path>:<line of the opening fence>"`; the value
is the snippet's raw text.

**Responsibilities of the validator:**

1. **Normalize indentation.** Snippets nested inside MDX `<TabItem>`
   components carry leading indentation. Dedent before compiling
   (whitespace-insensitive languages like C# can ignore this; Python, Go,
   etc. must dedent).
2. **Wrap each snippet** into a compilable unit — e.g. hoist `import`/`using`
   directives, then place the remaining statements inside a function/method
   body. The C# validator wraps each snippet in a `Run()` method on a
   uniquely-named class and injects common client imports.
3. **Compile** against the real client build (the artifact passed via the
   language-specific argument), not just a syntax check.
4. **Report failures** mapped back to the original `"<file>:<line>"` key so a
   reader can find the broken snippet.

**Exit code:** `0` when every example compiles, non-zero when any example
fails or a required input is missing.

**Recommended artifact arguments** (the orchestrator forwards these
verbatim; the exact flag is up to each validator):

| Language | Artifact passed to the validator                                            |
| -------- | --------------------------------------------------------------------------- |
| C#       | `--glide-dll <Valkey.Glide.dll>` (already implemented)                      |
| Java     | `--glide-jar <glide.jar>`                                                   |
| Go       | resolved via the module (`go.mod`); no artifact path needed                 |
| Node     | resolved from `node_modules` after `npm install`; no artifact path needed   |
| Python   | resolved from the installed `valkey-glide` package; no artifact path needed |
| PHP      | the loaded `valkey_glide` extension; lint-level only (`php -l`)             |

## Per-language status

| Language | Fences matched                         | Upstream validator                                             | Status                 |
| -------- | -------------------------------------- | -------------------------------------------------------------- | ---------------------- |
| C#       | `csharp`                               | `valkey-glide-csharp/dev/scripts/validate_examples.py`         | **Live**               |
| Java     | `java`                                 | `valkey-glide/java/dev/scripts/validate_examples.py` _(TBD)_   | Skipped until upstream |
| Python   | `python`, `py`                         | `valkey-glide/python/dev/scripts/validate_examples.py` _(TBD)_ | Skipped until upstream |
| Go       | `go`                                   | `valkey-glide/go/dev/scripts/validate_examples.py` _(TBD)_     | Skipped until upstream |
| Node     | `typescript`, `javascript`, `ts`, `js` | `valkey-glide/node/dev/scripts/validate_examples.py` _(TBD)_   | Skipped until upstream |
| PHP      | `php`                                  | `valkey-glide-php/dev/scripts/validate_examples.py` _(TBD)_    | Skipped until upstream |

The upstream paths above are the **expected convention** (mirroring C#'s
`dev/scripts/` location); confirm and adjust the path in the matching
workflow when the validator lands. The CI workflows for not-yet-supported
languages probe for the validator and skip cleanly (a green check with a
notice) until it exists, then start enforcing automatically.

## Adding / enabling a language

1. Confirm the language's fences are listed in `LANGUAGE_FENCES` in
   `extract_examples.py` (add aliases if the docs use new ones).
2. Implement `validate_examples.py` in that language's client repo per the
   [contract](#the-validator-contract) above.
3. Nothing else is required to activate it. Each
   `.github/workflows/check-<language>-examples.yml` probes the upstream repo
   for the validator on every run: once it exists, the probe passes and the
   gated build + validation steps run automatically. Just confirm the
   workflow's `VALIDATOR_REPO_PATH`, build steps, and artifact argument match
   what the validator actually expects.

> The orchestrator also accepts a `--skip-if-no-validator` flag (used for
> local runs) that turns a missing validator into a notice + exit 0 instead
> of an error. The CI workflows rely on the probe step instead, so they don't
> spin up a build runner until the validator exists.
