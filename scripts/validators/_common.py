#!/usr/bin/env python3
"""Shared harness for the bundled documentation example validators.

Each bundled validator (``python.py``, ``node.py``, ``go.py``, ``java.py``,
``php.py``) performs *syntax* validation for one language and plugs into this
harness. The harness implements the same ``--examples`` JSON contract used by
the upstream C# ``validate_examples.py`` so that ``scripts/check_examples.py``
can drive every validator identically:

    python scripts/validators/<lang>.py --examples <examples.json>

It reads the examples, dedents each snippet, runs the language's check, prints
a per-source failure report, and exits 0 (all valid) or 1 (one or more
failed / a required tool is missing).
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import textwrap
from typing import Callable, Optional

# A validator either checks one snippet at a time (check_one) or the whole
# batch at once (check_all, e.g. to amortize an expensive interpreter startup).
CheckOne = Callable[[str, str], "list[str]"]
CheckAll = Callable[["dict[str, str]"], "dict[str, list[str]]"]


def require_tool(name: str, version_args: "list[str] | None" = None) -> None:
    """Exit(1) with a clear message if an external tool is unavailable.

    Mirrors how the C# validator bails out when ``dotnet`` is missing. If
    ``version_args`` is given, the tool is also invoked to confirm it actually
    runs (e.g. the macOS ``javac`` shim exists on PATH but fails without a JDK).
    """
    if shutil.which(name) is None:
        print(
            f"Error: required tool '{name}' is not installed or not on PATH.",
            file=sys.stderr,
        )
        sys.exit(1)
    if version_args is not None:
        try:
            result = subprocess.run(
                [name, *version_args], capture_output=True, text=True
            )
        except OSError as exc:
            print(f"Error: failed to run '{name}': {exc}", file=sys.stderr)
            sys.exit(1)
        if result.returncode != 0:
            detail = (result.stderr or result.stdout).strip()
            print(
                f"Error: '{name}' is present but not working: {detail}",
                file=sys.stderr,
            )
            sys.exit(1)


def run(
    language: str,
    *,
    check_one: Optional[CheckOne] = None,
    check_all: Optional[CheckAll] = None,
    preflight: Optional[Callable[[], None]] = None,
) -> None:
    """Drive validation for ``language`` and exit with the appropriate code.

    Provide exactly one of ``check_one`` (per-snippet) or ``check_all``
    (whole-batch). Both receive already-dedented code and return error message
    lists; an empty list means the snippet is valid.
    """
    if (check_one is None) == (check_all is None):
        raise ValueError("Provide exactly one of check_one or check_all.")

    parser = argparse.ArgumentParser(
        description=f"Syntax-validate {language} documentation examples."
    )
    parser.add_argument(
        "--examples",
        required=True,
        help="Path to a JSON file mapping '<file>:<line>' to code.",
    )
    # Tolerate (and ignore) any artifact flags forwarded by the orchestrator,
    # so the bundled validators share the upstream validator's call signature.
    args, _ignored = parser.parse_known_args()

    if not os.path.isfile(args.examples):
        print(f"Error: '{args.examples}' not found", file=sys.stderr)
        sys.exit(1)

    with open(args.examples, encoding="utf-8") as fh:
        examples = json.load(fh)

    if not examples:
        print("No examples found in the provided file.")
        sys.exit(0)

    if preflight is not None:
        preflight()

    print(f"Validating {len(examples)} {language} example(s)...", flush=True)

    dedented = {source: textwrap.dedent(code) for source, code in examples.items()}

    if check_all is not None:
        errors = {s: msgs for s, msgs in check_all(dedented).items() if msgs}
    else:
        errors = {}
        for source, code in dedented.items():
            msgs = check_one(source, code)
            if msgs:
                errors[source] = msgs

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

    print(f"\nAll {len(examples)} {language} examples are syntactically valid.")
    sys.exit(0)
