#!/usr/bin/env python3
"""Validate documentation code examples for a given client language.

This generalises the original C#-only checker so the same flow works for
every Valkey GLIDE client language. It:

1. Extracts the code blocks for the requested language from the MDX docs
   (via :mod:`extract_examples`).
2. Writes them to a temporary JSON file keyed by ``"<file>:<line>"``.
3. Hands that file to the language's upstream ``validate_examples.py``
   script (which wraps + compiles each snippet against the real client
   build), forwarding any extra arguments such as the path to the built
   artifact.
4. Cleans up the temporary file and propagates the validator's exit code.

The contract with the upstream validator (established by
``valkey-glide-csharp``) is::

    python <validator> --examples <examples.json> [language-specific args...]

where ``<examples.json>`` maps ``"<docs_path>:<line>" -> code`` and the
validator exits ``0`` when every example compiles or non-zero when any
example fails. See ``scripts/README.md`` for the full contract.

Usage::

    python scripts/check_examples.py \\
        --language csharp \\
        --validator valkey-glide-csharp/dev/scripts/validate_examples.py \\
        -- --glide-dll path/to/Valkey.Glide.dll

Everything after ``--`` is forwarded verbatim to the validator, so each
language can pass whatever artifact reference it needs (``--glide-dll``,
``--glide-jar``, ``--glide-package``, ...).

When a language's upstream validator has not been implemented yet, pass
``--skip-if-no-validator`` so the check reports a notice and exits ``0``
instead of failing. CI workflows for not-yet-supported languages use this
so they stay green until the upstream validator lands, then begin enforcing
automatically.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile

from extract_examples import DOCS_DIR, LANGUAGE_FENCES, extract_examples


def _parse_args(argv: list[str]) -> tuple[argparse.Namespace, list[str]]:
    parser = argparse.ArgumentParser(
        description=(
            "Extract code examples for a language from the MDX docs and "
            "validate them with the language's upstream validate_examples.py."
        )
    )
    parser.add_argument(
        "--language",
        required=True,
        choices=sorted(LANGUAGE_FENCES),
        help="Client language whose code examples to validate.",
    )
    parser.add_argument(
        "--validator",
        required=True,
        help="Path to the upstream validate_examples.py script.",
    )
    parser.add_argument(
        "--skip-if-no-validator",
        action="store_true",
        help=(
            "Exit 0 with a notice (instead of failing) when the validator "
            "script does not exist. Use for languages whose upstream "
            "validator has not landed yet."
        ),
    )
    # Anything after "--" is forwarded to the validator unchanged.
    return parser.parse_known_args(argv)


def main(argv: list[str] | None = None) -> int:
    args, validator_args = _parse_args(
        argv if argv is not None else sys.argv[1:]
    )

    # argparse keeps the leading "--" separator in the remainder; drop it.
    if validator_args and validator_args[0] == "--":
        validator_args = validator_args[1:]

    validator_path = os.path.abspath(args.validator)

    # The validator may not exist yet for this language.
    if not os.path.isfile(validator_path):
        message = (
            f"Validator script not found for '{args.language}': "
            f"{validator_path}"
        )
        if args.skip_if_no_validator:
            # GitHub Actions surfaces ::notice:: annotations in the UI.
            print(
                f"::notice::{message}. Skipping {args.language} example "
                f"validation until the upstream validator lands "
                f"(see scripts/README.md)."
            )
            return 0
        print(f"Error: {message}", file=sys.stderr)
        return 1

    if not os.path.isdir(DOCS_DIR):
        print(f"Error: docs directory not found: {DOCS_DIR}", file=sys.stderr)
        return 1

    # Soft preflight: confirm the validator is runnable. A failure here is a
    # warning rather than fatal so validators that do not implement --help
    # still work; real problems surface during the actual run below.
    preflight = subprocess.run(
        [sys.executable, validator_path, "--help"],
        capture_output=True,
    )
    if preflight.returncode != 0:
        print(
            f"Warning: '{validator_path} --help' exited "
            f"{preflight.returncode}; continuing anyway.",
            file=sys.stderr,
        )

    # Step 1: extract examples for this language.
    examples = extract_examples(args.language)
    # Flush so this line precedes the validator subprocess output in CI logs.
    print(f"Extracted {len(examples)} {args.language} code example(s).", flush=True)

    if not examples:
        return 0

    # Step 2: write to a temp file and hand it to the validator.
    tmp_file = tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        prefix=f"{args.language}_examples_",
        suffix=".json",
        delete=False,
    )
    tmp_path = tmp_file.name

    try:
        with tmp_file as fh:
            json.dump(examples, fh, indent=2, sort_keys=True)

        result = subprocess.run(
            [
                sys.executable,
                validator_path,
                "--examples",
                tmp_path,
                *validator_args,
            ],
            check=False,
        )
        return result.returncode
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


if __name__ == "__main__":
    sys.exit(main())
