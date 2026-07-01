#!/usr/bin/env python3
"""Full-compilation validator for Node (TypeScript) documentation examples.

Follows the same overall pattern as ``check-csharp-examples.py``:

1. Extracts TypeScript/JavaScript code blocks from the MDX docs.
2. Wraps each snippet into a compilable ``.ts`` file (injecting default
   imports and ambient client declarations).
3. Compiles everything in one pass with ``tsc --noEmit`` against the real
   ``@valkey/valkey-glide`` package built from source.
4. Parses the compiler output and reports failures per source location.

Self-contained: no external Python dependencies beyond the standard library.

Usage:
    python scripts/validators/check-node-examples.py --glide-path ../valkey-glide/node

Requires a pre-built Node client (run ``npm ci && npm run build:release``
in the valkey-glide/node directory first).

Options:
    --glide-path      Path to the built valkey-glide/node directory. We point
                       at the directory (rather than directly at
                       build-ts/index.d.ts) so npm can resolve the package via
                       its package.json "exports"/"types"/"main" fields —
                       this also correctly follows any relative imports
                       across the package's other .d.ts files.
    --keep-project    Preserve the temporary TypeScript project directory
                       instead of deleting it, for local debugging.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap

from _common import extract_all as _extract_all

# ---------------------------------------------------------------------------
# Extraction
# ---------------------------------------------------------------------------

# Fence language tags this validator extracts.
_LANGUAGES = ["typescript", "ts", "javascript", "js"]

# Files/directories skipped during extraction:
#   - migration guides contain comparison snippets from other clients
#   - IAM integration guides import AWS SDK packages we don't install
_SKIP_PATTERNS = [r"^migration", r"iam-"]


# ---------------------------------------------------------------------------
# Wrapping
# ---------------------------------------------------------------------------

# Matches the start of an import statement.
_IMPORT_LINE_RE = re.compile(r"^\s*import\s+")

# Matches the closing `from "..."` of an import statement, to detect where
# a (possibly multi-line) import statement ends.
_IMPORT_END_RE = re.compile(r"""from\s+["'][^"']+["']\s*;?\s*$""")

# Matches the `{ Named, Imports }` portion of an import statement, so we can
# tell which names a snippet already imports for itself.
_NAMED_IMPORTS_RE = re.compile(r"\{([^}]+)\}")

_DEFAULT_IMPORTS = (
    "GlideClient, GlideClusterClient, GlideClientConfiguration, "
    "GlideClusterClientConfiguration, Batch, ClusterBatch, BatchOptions, "
    "ClusterBatchOptions, ClusterBatchRetryStrategy, Script, Transaction, "
    "Routes, Logger, RequestError, ServerCredentials, GlideFt, "
    "GlideJson, OpenTelemetry, ClientSideCache, EvictionPolicy, TimeUnit, "
    "Field, FtSearchOptions, FtSearchReturnType, Decoder, "
    "AdvancedGlideClusterClientConfiguration, CompressionBackend, "
    "OpenTelemetryConfig, OpenTelemetryMetricsConfig, OpenTelemetryTracesConfig, "
    "ClusterScanCursor, ReadFrom, GlideString, PubSubMsg, ALL_CHANNELS, ALL_PATTERNS"
)

_CLIENT_DECLARATIONS = (
    "declare const client: GlideClient;\n"
    "declare const clusterClient: GlideClusterClient;\n"
)


def _split_imports(code: str) -> tuple[list[str], list[str]]:
    """Separate import statements (including multi-line) from the rest.

    Import statements can span multiple lines, e.g.:

        import {
            GlideClient,
            GlideClusterClient,
        } from "@valkey/valkey-glide";

    We scan line by line: once a line starts an import, we keep consuming
    lines until we see the closing `from "...";` (via ``_IMPORT_END_RE``),
    which marks the end of that statement. Every other line is treated as
    part of the snippet's body.
    """
    imports: list[str] = []
    body: list[str] = []
    lines = code.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if _IMPORT_LINE_RE.match(line):
            import_lines = [line]
            # Keep consuming lines until this import statement closes.
            while not _IMPORT_END_RE.search(line) and i + 1 < len(lines):
                i += 1
                line = lines[i]
                import_lines.append(line)
            imports.append("\n".join(import_lines))
        else:
            body.append(line)
        i += 1
    return imports, body


def _wrap_snippet(code: str) -> str:
    """Wrap a snippet into a compilable .ts file."""
    imports, body_lines = _split_imports(code)

    parts: list[str] = []

    # Inject default imports, deduped against snippet's own
    existing_names: set[str] = set()
    for imp in imports:
        m = _NAMED_IMPORTS_RE.search(imp)
        if m:
            for name in m.group(1).split(","):
                existing_names.add(name.strip())
    defaults = [
        n.strip() for n in _DEFAULT_IMPORTS.split(",")
        if n.strip() not in existing_names
    ]
    if defaults:
        parts.append(f"import {{ {', '.join(defaults)} }} from \"@valkey/valkey-glide\";\n")

    # Hoisted imports from snippet
    if imports:
        parts.append("\n".join(imports) + "\n")

    # Client declarations
    parts.append("\n" + _CLIENT_DECLARATIONS)

    # Async wrapper for the body
    body = "\n".join(body_lines).strip()
    if body:
        parts.append(f"\nasync function __run() {{\n{textwrap.indent(body, '    ')}\n}}\n")

    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Compilation
# ---------------------------------------------------------------------------


def _require_tool(name: str) -> None:
    if shutil.which(name) is None:
        print(f"Error: '{name}' is not installed or not on PATH.", file=sys.stderr)
        sys.exit(1)


def _setup_project(tmp_dir: str, glide_path: str) -> None:
    """Create a temp TypeScript project referencing the local GLIDE build."""
    glide_abs = os.path.abspath(glide_path)

    package_json = json.dumps(
        {
            "name": "glide-doc-validator",
            "private": True,
            "type": "module",
            "dependencies": {
                "@valkey/valkey-glide": f"file:{glide_abs}",
            },
        },
        indent=2,
    )
    tsconfig = json.dumps(
        {
            "compilerOptions": {
                "module": "ESNext",
                "moduleResolution": "bundler",
                "target": "ESNext",
                "noEmit": True,
                "strict": False,
                "skipLibCheck": True,
                "esModuleInterop": True,
                "types": ["node"],
            },
            "include": ["*.ts"],
        },
        indent=2,
    )

    with open(os.path.join(tmp_dir, "package.json"), "w") as f:
        f.write(package_json)
    with open(os.path.join(tmp_dir, "tsconfig.json"), "w") as f:
        f.write(tsconfig)

    proc = subprocess.run(
        ["npm", "install", "typescript", "@types/node", "--save"],
        cwd=tmp_dir,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout).strip()
        print(f"Error: npm install failed:\n{detail}", file=sys.stderr)
        sys.exit(1)


def _run_tsc(tmp_dir: str) -> str:
    """Run tsc --noEmit and return combined output."""
    tsc_path = os.path.join(tmp_dir, "node_modules", ".bin", "tsc")
    proc = subprocess.run(
        [tsc_path, "--noEmit", "--pretty", "false"],
        cwd=tmp_dir,
        capture_output=True,
        text=True,
    )
    return proc.stdout + proc.stderr


# Matches a single tsc error line, e.g.:
#   example_0001.ts(12,5): error TS2304: Cannot find name 'foo'.
_TSC_ERROR_RE = re.compile(r"^(example_\d+\.ts)\((\d+),(\d+)\):\s+error\s+TS\d+:\s+(.+)$")


def _parse_tsc_errors(output: str) -> dict[str, list[str]]:
    """Parse tsc output into per-file error messages.

    Returns:
        A dict mapping each generated example filename (e.g.
        ``"example_0001.ts"``) to a list of human-readable error strings,
        one per compiler diagnostic raised against that file.
    """
    errors: dict[str, list[str]] = {}
    for line in output.splitlines():
        m = _TSC_ERROR_RE.match(line)
        if m:
            filename, line_no, _col, message = m.groups()
            errors.setdefault(filename, []).append(f"line {line_no}: {message}")
    return errors


def validate(
    examples: dict[str, str],
    *,
    glide_path: str,
    keep_project: bool = False,
) -> dict[str, list[str]]:
    """Compile all snippets and collect any errors.

    Args:
        examples: Mapping of ``"<source>:<line>"`` to snippet code, as
            produced by ``_common.extract_all``.
        glide_path: Path to the built valkey-glide/node directory.
        keep_project: If True, don't delete the temp project afterwards.

    Returns:
        A dict mapping each ``source`` key from ``examples`` to the list of
        compiler error messages raised against that snippet. Sources that
        compiled cleanly are omitted entirely (never mapped to an empty
        list), since only failing example filenames appear in the tsc
        output that ``_parse_tsc_errors`` parses.
    """
    tmp_dir = tempfile.mkdtemp(prefix="glide_node_validate_")
    try:
        print("Setting up TypeScript project...", flush=True)
        _setup_project(tmp_dir, glide_path)

        file_to_source: dict[str, str] = {}
        for idx, (source, code) in enumerate(examples.items()):
            filename = f"example_{idx:04d}.ts"
            file_to_source[filename] = source
            wrapped = _wrap_snippet(code)
            with open(os.path.join(tmp_dir, filename), "w", encoding="utf-8") as f:
                f.write(wrapped)

        print(f"Running tsc --noEmit on {len(examples)} file(s)...", flush=True)
        output = _run_tsc(tmp_dir)

        file_errors = _parse_tsc_errors(output)
        result: dict[str, list[str]] = {}
        for filename, msgs in file_errors.items():
            source = file_to_source.get(filename)
            if source:
                result[source] = msgs
    finally:
        if keep_project:
            print(f"\nProject kept at: {tmp_dir}", flush=True)
        else:
            shutil.rmtree(tmp_dir, ignore_errors=True)

    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Full-compilation validator for Node.js (TypeScript) doc examples."
    )
    parser.add_argument(
        "--glide-path", required=True,
        help="Path to the built valkey-glide/node directory.",
    )
    parser.add_argument(
        "--keep-project", action="store_true",
        help="Keep the temp project directory for inspection (useful when "
             "debugging a failing snippet locally).",
    )
    args = parser.parse_args()

    glide_path = os.path.abspath(args.glide_path)

    # Validate the glide path
    if not os.path.isdir(glide_path):
        print(f"Error: --glide-path not found: {glide_path}", file=sys.stderr)
        sys.exit(1)
    if not os.path.isfile(os.path.join(glide_path, "build-ts", "index.d.ts")):
        print(
            f"Error: No build-ts/index.d.ts in {glide_path}. "
            f"Build the client first: cd {glide_path} && npm ci && npm run build:release",
            file=sys.stderr,
        )
        sys.exit(1)

    _require_tool("node")
    _require_tool("npm")

    print("Extracting TypeScript examples from MDX docs...", flush=True)
    examples = _extract_all(_LANGUAGES, skip_patterns=_SKIP_PATTERNS)
    print(f"Extracted {len(examples)} example(s).", flush=True)

    if not examples:
        sys.exit(0)

    dedented = {source: textwrap.dedent(code) for source, code in examples.items()}

    errors = validate(
        dedented,
        glide_path=glide_path,
        keep_project=args.keep_project,
    )
    errors = {s: msgs for s, msgs in errors.items() if msgs}

    if errors:
        bar = "=" * 60
        print(f"\n{bar}\nFAILURES ({len(errors)} of {len(examples)} examples)\n{bar}\n")
        for source, messages in errors.items():
            print(f"  FAIL: {source}")
            for message in messages:
                print(f"        {message}")
            print()
        print(f"{len(examples) - len(errors)} passed, {len(errors)} failed")
        sys.exit(1)

    print(f"\nAll {len(examples)} node examples compiled successfully.")
    sys.exit(0)


if __name__ == "__main__":
    main()
