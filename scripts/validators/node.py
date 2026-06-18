#!/usr/bin/env python3
"""Syntax-validate Node (TypeScript / JavaScript) documentation examples.

Delegates to ``ts_syntax_check.mjs``, which uses the TypeScript compiler's
``transpileModule`` to report syntax-only diagnostics. The whole batch is sent
to a single Node process to amortize interpreter / compiler startup.

Requires Node.js and the ``typescript`` package (the workflow installs it with
``npm install typescript``).
"""

from __future__ import annotations

import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common  # noqa: E402

_HELPER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ts_syntax_check.mjs")


def _preflight() -> None:
    _common.require_tool("node", ["--version"])
    if not os.path.isfile(_HELPER):
        print(f"Error: helper not found: {_HELPER}", file=sys.stderr)
        sys.exit(1)


def check_all(examples: "dict[str, str]") -> "dict[str, list[str]]":
    proc = subprocess.run(
        ["node", _HELPER],
        input=json.dumps(examples),
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        # Internal failure (e.g. typescript not installed) — fail clearly.
        detail = (proc.stderr or proc.stdout).strip()
        print(f"Error running Node syntax checker: {detail}", file=sys.stderr)
        sys.exit(1)
    try:
        return json.loads(proc.stdout or "{}")
    except json.JSONDecodeError:
        print(
            f"Error: Node syntax checker produced unparseable output: "
            f"{proc.stdout[:200]!r}",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    _common.run("node", check_all=check_all, preflight=_preflight)
