#!/usr/bin/env python3
"""Full-compilation validator for Node (TypeScript) documentation examples.

Extracts TypeScript/JavaScript code blocks from the MDX docs and compiles
each snippet against the real ``@valkey/valkey-glide`` type definitions
using ``tsc --noEmit``.

Self-contained: no external Python dependencies beyond the standard library.

Usage:
    python scripts/validators/node.py --glide-path ../valkey-glide/node

Requires a pre-built Node client (run ``npm ci && npm run build:release``
in the valkey-glide/node directory first).
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

# ---------------------------------------------------------------------------
# Extraction
# ---------------------------------------------------------------------------

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_DOCS_DIR = os.path.join(_REPO_ROOT, "src", "content", "docs")

_TS_BLOCK_RE = re.compile(
    r"^\s*```(?:typescript|ts|javascript|js)\s*\n(.*?)^\s*```\s*$",
    re.MULTILINE | re.DOTALL,
)


def _extract_examples() -> dict[str, str]:
    """Extract TypeScript/JS code blocks from all MDX files."""
    examples: dict[str, str] = {}
    for root, _dirs, files in os.walk(_DOCS_DIR):
        # Skip migration guides — they contain comparison snippets from other clients
        rel_root = os.path.relpath(root, _DOCS_DIR)
        if rel_root.startswith("migration"):
            continue
        for fname in sorted(files):
            if not fname.endswith(".mdx"):
                continue
            # Skip IAM integration guides — they import AWS SDK packages
            if fname.startswith("iam-"):
                continue
            filepath = os.path.join(root, fname)
            with open(filepath, encoding="utf-8") as fh:
                content = fh.read()
            for match in _TS_BLOCK_RE.finditer(content):
                key_path = os.path.relpath(filepath, _REPO_ROOT)
                line_number = content[: match.start()].count("\n") + 1
                examples[f"{key_path}:{line_number}"] = match.group(1)
    return examples


# ---------------------------------------------------------------------------
# Wrapping
# ---------------------------------------------------------------------------

_IMPORT_LINE = re.compile(r"^\s*import\s+")

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
    """Separate import statements (including multi-line) from the rest."""
    imports: list[str] = []
    body: list[str] = []
    lines = code.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if _IMPORT_LINE.match(line):
            import_lines = [line]
            while not re.search(r"""from\s+["'][^"']+["']\s*;?\s*$""", line) and i + 1 < len(lines):
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
        m = re.search(r"\{([^}]+)\}", imp)
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


_TSC_ERROR = re.compile(r"^(example_\d+\.ts)\((\d+),(\d+)\):\s+error\s+TS\d+:\s+(.+)$")


def _parse_tsc_errors(output: str) -> dict[str, list[str]]:
    """Parse tsc output into {filename: [messages]}."""
    errors: dict[str, list[str]] = {}
    for line in output.splitlines():
        m = _TSC_ERROR.match(line)
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
    """Compile all snippets and return {source: [errors]}."""
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
        help="Keep the temp project directory for inspection.",
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

    if not os.path.isdir(_DOCS_DIR):
        print(f"Error: docs directory not found: {_DOCS_DIR}", file=sys.stderr)
        sys.exit(1)

    print("Extracting TypeScript examples from MDX docs...", flush=True)
    examples = _extract_examples()
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
