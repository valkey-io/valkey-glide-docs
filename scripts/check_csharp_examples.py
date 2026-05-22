#!/usr/bin/env python3
"""Extract C# examples from MDX docs and validate them.

1. Extracts C# code blocks from MDX files.
2. Writes them to a temporary JSON file.
3. Runs the validator script from 'valkey-glide-csharp'.
4. Cleans up and propagates the exit code.

Usage:
    python scripts/check_csharp_examples.py
        --validator <path_to_validate_examples.py>
        --glide-dll <path_to_Valkey.Glide.dll>

Options:
    --validator      Path to the validate_examples.py script from the 'valkey-glide-csharp' repository.
    --glide-dll      Path to the built Valkey.Glide.dll to reference during compilation.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

# Repository root is one level up from this script's directory (scripts/).
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_DOCS_DIR = os.path.join(_REPO_ROOT, "src", "content", "docs")

# Matches a ```csharp ... ``` fenced code block, capturing the content.
# Allows leading whitespace before fences (common in MDX tab components).
_CSHARP_BLOCK_RE = re.compile(
    r"^\s*```csharp\s*\n(.*?)^\s*```\s*$",
    re.MULTILINE | re.DOTALL,
)


def extract_all(docs_dir: str) -> dict[str, str]:
    """Recursively walk docs_dir for .mdx files and extract C# blocks.

    Returns a dict mapping "<repo_relative_path>:<line_number>" to the
    code string.
    """
    examples: dict[str, str] = {}

    for root, _dirs, files in os.walk(docs_dir):
        for fname in sorted(files):
            if not fname.endswith(".mdx"):
                continue
            
            filepath = os.path.join(root, fname)
            with open(filepath, encoding="utf-8") as fh:
                content = fh.read()

            for match in _CSHARP_BLOCK_RE.finditer(content):
                key_path = os.path.relpath(filepath, _REPO_ROOT)
                line_number = content[: match.start()].count("\n") + 1
                examples[f"{key_path}:{line_number}"] = match.group(1)

    return examples


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

    validator_path = os.path.abspath(args.validator)
    dll_path = os.path.abspath(args.glide_dll)

    # Validate inputs
    if not os.path.isfile(validator_path):
        print(f"Error: validator script not found: {validator_path}", file=sys.stderr)
        sys.exit(1)

    if not os.path.isfile(dll_path):
        print(f"Error: DLL not found: {dll_path}", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(_DOCS_DIR):
        print(f"Error: docs directory not found: {_DOCS_DIR}", file=sys.stderr)
        sys.exit(1)

    # Verify we can run the validator with Python
    result = subprocess.run(
        [sys.executable, validator_path, "--help"],
        capture_output=True,
    )
    if result.returncode != 0:
        print(f"Error: cannot run validator script: {validator_path}", file=sys.stderr)
        sys.exit(1)

    # Step 1: Extract examples from MDX files
    examples = extract_all(_DOCS_DIR)
    print(f"Extracted {len(examples)} C# code example(s).")

    if not examples:
        sys.exit(0)

    # Step 2: Write to temp file and validate.
    tmp_file = tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        prefix="csharp_examples_",
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
                "--examples", tmp_path,
                "--glide-dll", dll_path,
            ],
            check=False,
        )
        sys.exit(result.returncode)
    
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


if __name__ == "__main__":
    main()
