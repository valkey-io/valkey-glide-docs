#!/usr/bin/env python3
"""Syntax-validate Python documentation examples.

Each snippet is wrapped in an ``async def`` (so the top-level ``await`` calls
common in the docs are legal) and handed to the built-in :func:`compile`. This
catches syntax and indentation errors without needing the ``valkey-glide``
package installed; undefined names like ``client`` are runtime concerns and are
intentionally not flagged.
"""

from __future__ import annotations

import os
import sys
import textwrap

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common  # noqa: E402


def check_one(source: str, code: str) -> "list[str]":
    code = code.strip("\n")
    body = textwrap.indent(code, "    ") if code.strip() else "    pass"
    # The trailing 'pass' guarantees a statement even if the body is all comments.
    wrapped = f"async def __example__():\n{body}\n    pass\n"
    try:
        compile(wrapped, source, "exec")
    except SyntaxError as exc:
        # exc.lineno is in wrapped coordinates; the wrapper adds one line on top.
        line = max((exc.lineno or 1) - 1, 1)
        return [f"{type(exc).__name__}: {exc.msg} (around line {line})"]
    return []


if __name__ == "__main__":
    _common.run("python", check_one=check_one)
