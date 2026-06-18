#!/usr/bin/env python3
"""Syntax-validate Java documentation examples via ``javac``.

Java has no pure-syntax compile mode, so each snippet is compiled with no
classpath and only *syntactic* diagnostics are treated as failures —
"cannot find symbol", "package ... does not exist", type-mismatch errors, etc.
are ignored, so undefined identifiers like ``client`` and the missing client
jar do not cause failures.

Because snippets may be bare statements, class members, or whole type
declarations, a few wrappings are tried and the snippet passes if *any* of them
is syntactically valid.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
import tempfile
import textwrap

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common  # noqa: E402

_IMPORT_LINE = re.compile(r"^\s*import\s+(?:static\s+)?[\w.*]+\s*;")
_TYPE_DECL = re.compile(r"(?m)^\s*(?:public\s+|final\s+|abstract\s+|sealed\s+)*(?:class|interface|enum|record)\s+\w+")
_PUBLIC_TYPE = re.compile(
    r"(?m)^\s*public\s+(?:final\s+|abstract\s+|sealed\s+|non-sealed\s+)*"
    r"(?:class|interface|enum|record)\s+(\w+)"
)

# Substrings that identify a *syntactic* javac error (as opposed to a semantic
# one such as "cannot find symbol"). Matched case-insensitively.
_SYNTAX_HINTS = (
    "expected",
    "illegal start of",
    "reached end of file while parsing",
    "not a statement",
    "unclosed",
    "illegal character",
    "malformed",
    "premature end of file",
    "empty character literal",
    "unexpected type",
    "> expected",
)


def _preflight() -> None:
    _common.require_tool("javac", ["-version"])


def _split_imports(code: str) -> "tuple[list[str], str]":
    imports, body = [], []
    for line in code.splitlines():
        (imports if _IMPORT_LINE.match(line) else body).append(line)
    return imports, "\n".join(body).strip("\n")


_PACKAGE_DECL = re.compile(r"(?m)^\s*package\s+[\w.]+\s*;")


def _candidates(code: str) -> "list[tuple[str, str]]":
    """Return (filename, source) wrappings to try, most likely first."""
    snippet = code.strip("\n")

    # A complete (or near-complete) compilation unit — has its own package
    # and/or top-level type declaration — is compiled as-is so the required
    # package-before-imports ordering is preserved.
    if _PACKAGE_DECL.search(snippet) or _TYPE_DECL.search(snippet):
        m = _PUBLIC_TYPE.search(snippet)
        filename = f"{m.group(1)}.java" if m else "GlideDocExample.java"
        return [(filename, snippet + "\n")]

    # Otherwise it is a fragment: hoist imports and try wrapping the rest as
    # method-body statements, then as class members.
    imports, body = _split_imports(snippet)
    header = "\n".join(imports)
    header = header + "\n\n" if header else ""
    method = f"{header}class GlideDocExample {{\n  void __run() throws Throwable {{\n{textwrap.indent(body, '    ')}\n  }}\n}}\n"
    members = f"{header}class GlideDocExample {{\n{textwrap.indent(body, '  ')}\n}}\n"
    return [("GlideDocExample.java", method), ("GlideDocExample.java", members)]


def _syntax_errors(filename: str, source: str) -> "list[str]":
    """Compile one candidate; return its syntax-category error messages."""
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, filename)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(source)
        proc = subprocess.run(
            ["javac", "-proc:none", "-implicit:none", "-nowarn", "-d", tmp, path],
            capture_output=True,
            text=True,
        )
    if proc.returncode == 0:
        return []
    messages = []
    for line in proc.stderr.splitlines():
        low = line.lower()
        if ": error:" in low and any(h in low for h in _SYNTAX_HINTS):
            # Keep just the "error: ..." part, dropping the temp path prefix.
            messages.append(line.split(": error:", 1)[1].strip())
    return messages


def check_one(source: str, code: str) -> "list[str]":
    first: "list[str]" = []
    for filename, candidate in _candidates(code):
        errors = _syntax_errors(filename, candidate)
        if not errors:
            return []  # syntactically valid under this wrapping
        if not first:
            first = errors
    return first


if __name__ == "__main__":
    _common.run("java", check_one=check_one, preflight=_preflight)
