#!/usr/bin/env python3
"""Extract C# examples from the MDX docs and validate them.

This is a thin, backwards-compatible wrapper around the generic
:mod:`check_examples` orchestrator (``--language csharp``). It is kept so the
existing ``Check C# Examples`` workflow keeps working unchanged; new
languages should call ``check_examples.py`` directly.

The shared extraction logic now lives in :mod:`extract_examples`, and the
orchestration (write temp JSON, run the upstream validator, propagate the
exit code) lives in :mod:`check_examples`.

Usage:
    python scripts/check_csharp_examples.py
        --validator <path_to_validate_examples.py>
        --glide-dll <path_to_Valkey.Glide.dll>

Options:
    --validator      Path to the validate_examples.py script from the
                     'valkey-glide-csharp' repository.
    --glide-dll      Path to the built Valkey.Glide.dll to reference during
                     compilation.
"""

from __future__ import annotations

import argparse
import os
import sys

import check_examples


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract C# examples from MDX docs and validate them."
    )
    parser.add_argument(
        "--validator",
        required=True,
        help="Path to the validate_examples.py script.",
    )
    parser.add_argument(
        "--glide-dll",
        required=True,
        help="Path to the built Valkey.Glide.dll.",
    )
    args = parser.parse_args()

    dll_path = os.path.abspath(args.glide_dll)
    if not os.path.isfile(dll_path):
        print(f"Error: DLL not found: {dll_path}", file=sys.stderr)
        sys.exit(1)

    sys.exit(
        check_examples.main(
            [
                "--language",
                "csharp",
                "--validator",
                args.validator,
                "--",
                "--glide-dll",
                dll_path,
            ]
        )
    )


if __name__ == "__main__":
    main()
