#!/usr/bin/env python3
"""Syntax-validate PHP documentation examples via ``php -l``.

``php -l`` is a pure lint: it reports parse errors but does not resolve
classes/functions, so undefined symbols like ``$client`` and the missing
``valkey_glide`` extension are intentionally not flagged. A leading ``<?php``
tag is added when the snippet does not already open one.
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common  # noqa: E402


def _preflight() -> None:
    _common.require_tool("php", ["--version"])


def check_one(source: str, code: str) -> "list[str]":
    php = code if code.lstrip().startswith("<?php") else "<?php\n" + code
    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", suffix=".php", delete=False
    ) as fh:
        fh.write(php)
        path = fh.name
    try:
        proc = subprocess.run(
            ["php", "-l", "-d", "display_errors=stderr", path],
            capture_output=True,
            text=True,
        )
    finally:
        os.unlink(path)

    if proc.returncode == 0:
        return []

    # php -l prints e.g. "PHP Parse error: ... in <file> on line N".
    messages = [
        line.strip()
        for line in (proc.stderr + proc.stdout).splitlines()
        if "error" in line.lower()
    ]
    # Strip the temp-file path so the message is about the snippet, not the file.
    messages = [m.replace(path, "<example>") for m in messages]
    return messages or [f"php -l failed (exit {proc.returncode})"]


if __name__ == "__main__":
    _common.run("php", check_one=check_one, preflight=_preflight)
