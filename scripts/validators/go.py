#!/usr/bin/env python3
"""Syntax-validate Go documentation examples via ``gofmt -e``.

``gofmt`` parses a complete Go source file and reports syntax errors, but does
not resolve imports or symbols, so undefined identifiers like ``client`` and
unused imports are intentionally not flagged. Because most snippets are
fragments, each is wrapped into a complete file before parsing. Imports are
hoisted to the top, and the remaining code is tried both as ``func main``
statements and as package-level declarations; the snippet passes if *any*
wrapping is syntactically valid.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
import textwrap

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common  # noqa: E402

_PACKAGE = re.compile(r"^\s*package\s")
_IMPORT_BLOCK_START = re.compile(r"^\s*import\s*\(")
_IMPORT_SINGLE = re.compile(r"^\s*import\s+(?:\w+\s+|\.\s+)?[\"`]")


def _preflight() -> None:
    _common.require_tool("gofmt")


def _split_imports(code: str) -> "tuple[str, str]":
    """Separate import declarations (single and block form) from the rest."""
    imports, body, lines = [], [], code.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if _IMPORT_BLOCK_START.match(line):
            imports.append(line)
            i += 1
            while i < len(lines):
                imports.append(lines[i])
                if re.match(r"^\s*\)", lines[i]):
                    break
                i += 1
        elif _IMPORT_SINGLE.match(line):
            imports.append(line)
        else:
            body.append(line)
        i += 1
    return "\n".join(imports), "\n".join(body).strip("\n")


def _candidates(code: str) -> "list[str]":
    """Return source-file wrappings to try, most likely first."""
    snippet = code.strip("\n")
    if _PACKAGE.match(snippet):
        return [snippet + "\n"]

    imports, body = _split_imports(snippet)
    header = f"package main\n\n{imports}\n" if imports else "package main\n"
    statements = f"{header}\nfunc main() {{\n{textwrap.indent(body, chr(9))}\n}}\n"
    declarations = f"{header}\n{body}\n"
    return [statements, declarations]


def check_one(source: str, code: str) -> "list[str]":
    first: "list[str]" = []
    for candidate in _candidates(code):
        proc = subprocess.run(
            ["gofmt", "-e"], input=candidate, capture_output=True, text=True
        )
        if proc.returncode == 0:
            return []
        messages = [
            line.replace("<standard input>:", "line ").strip()
            for line in proc.stderr.splitlines()
            if line.strip()
        ]
        if not first:
            first = messages or [f"gofmt failed (exit {proc.returncode})"]
    return first


if __name__ == "__main__":
    _common.run("go", check_one=check_one, preflight=_preflight)
