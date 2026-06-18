# Documentation example validation

These scripts check that the code examples embedded in the docs
(`src/content/docs/**/*.mdx`) are valid, so a broken snippet is caught in CI
instead of by a reader. There is one check per client language, run by its own
GitHub workflow (`.github/workflows/check-<language>-examples.yml`).

## How it works

````
extract_examples.py   pull ```<lang> blocks from the MDX -> { "<file>:<line>": code }
        |
        v
check_examples.py     orchestrator: extract for one language, write a temp JSON,
        |             run that language's validator, propagate its exit code
        v
validators/<lang>.py  validate each snippet (and report failures by "<file>:<line>")
````

| Script                     | Role                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `extract_examples.py`      | Shared extractor (library + CLI).                                                        |
| `check_examples.py`        | Generic orchestrator. `--validator` defaults to `scripts/validators/<language>.py`.      |
| `validators/<lang>.py`     | Bundled per-language validators + `_common.py` harness and `ts_syntax_check.mjs` helper. |
| `check_csharp_examples.py` | Thin wrapper kept so the existing C# workflow is unchanged (see [C#](#c) below).         |

## What is validated: syntax

Most snippets in the docs are **fragments** — they reference an undefined
`client`, omit imports, and are not standalone programs. So the bundled
validators check **syntax / parse validity**, not full compilation against the
client library. This catches the breakage that actually happens when examples
are edited (typos, unbalanced braces, bad indentation, missing semicolons)
without false-failing on undefined symbols or unresolved imports.

| Language | Validator                                    | Tool needed          | Check                                                          |
| -------- | -------------------------------------------- | -------------------- | -------------------------------------------------------------- |
| Python   | `validators/python.py`                       | `python`             | `compile()` (snippet wrapped in an `async def`)                |
| Node     | `validators/node.py` + `ts_syntax_check.mjs` | `node`, `typescript` | TypeScript `transpileModule` (syntactic diagnostics only)      |
| Go       | `validators/go.py`                           | `gofmt`              | `gofmt -e` parse (snippet wrapped into a complete file)        |
| Java     | `validators/java.py`                         | `javac`              | `javac`, treating only syntax-category diagnostics as failures |
| PHP      | `validators/php.py`                          | `php`                | `php -l` lint                                                  |

### C\#

C# is the exception. Its docs snippets are written self-contained, and a
**full-compilation** validator already exists upstream in
[`valkey-glide-csharp`](https://github.com/valkey-io/valkey-glide-csharp)
(`dev/scripts/validate_examples.py`), which compiles each snippet against the
real `Valkey.Glide.dll`. The C# workflow keeps using that upstream validator
via `check_csharp_examples.py`, so C# gets a stronger guarantee than the
syntax-only checks above.

## Opting a block out of validation

Only blocks fenced with the **bare language token** (e.g. ` ```python `) are
extracted and validated. A snippet that is intentionally not runnable — an
API-signature illustration, for example — opts out simply by **not** using a
language fence. The convention in these docs is to fence such blocks as
` ```text ` (this is how the C# signature examples already do it):

````markdown
```text
// Standalone Mode
public async exec(batch: Batch, raiseOnError: boolean)
```
````

> A block whose info string carries any meta (e.g. ` ```python title="..." `)
> is likewise not matched, so be aware that adding a title to a **runnable**
> example silently excludes it from validation.

For an example that is real code but shows omitted sections, write the
omission as a comment (`// ...` / `# ...`) instead of a bare `...`, so the
snippet stays valid and keeps getting checked.

## Local usage

```bash
# List the languages and the Markdown fences each one matches.
python scripts/extract_examples.py --list-languages

# Dump the extracted examples for a language (debugging).
python scripts/extract_examples.py --language go --out /tmp/go.json

# Run a language's check (needs that language's toolchain on PATH).
python scripts/check_examples.py --language python
python scripts/check_examples.py --language node     # needs `typescript` resolvable
python scripts/check_examples.py --language go       # needs gofmt
python scripts/check_examples.py --language java     # needs a JDK (javac)
python scripts/check_examples.py --language php      # needs php

# C# (needs a checkout + build of the client repo):
python scripts/check_examples.py \
    --language csharp \
    --validator ../valkey-glide-csharp/dev/scripts/validate_examples.py \
    -- --glide-dll ../valkey-glide-csharp/sources/Valkey.Glide/bin/Release/net8.0/Valkey.Glide.dll
```

## The validator contract

`check_examples.py` invokes any validator the same way (the convention comes
from the upstream C# validator):

```bash
python <validator> --examples <examples.json> [extra args...]
```

- `<examples.json>` maps `"<repo-relative path>:<line of the opening fence>"`
  to the snippet's raw text.
- Anything after `--` on the `check_examples.py` command line is forwarded
  verbatim (e.g. `--glide-dll` for C#).
- Exit `0` when every example is valid, non-zero when any fails or a required
  tool is missing.

The bundled validators dedent each snippet and ignore unknown forwarded
arguments, so they share this signature.

## Adding / changing a language

1. Make sure the language's fences are listed in `LANGUAGE_FENCES` in
   `extract_examples.py` (add aliases if the docs start using new ones).
2. Add `scripts/validators/<language>.py` using the `_common.run(...)` harness,
   or point the workflow at an external validator with `--validator`.
3. Add `.github/workflows/check-<language>-examples.yml` that sets up the
   toolchain and runs `python scripts/check_examples.py --language <language>`.
