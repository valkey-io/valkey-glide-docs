"""Shared helpers for the per-language example validators.

Every validator (C#, Node, and any future language) extracts fenced code
blocks from the MDX docs the same way — only the language tag(s) and the
files to skip differ. Centralizing that logic keeps future validators
consistent and makes it easy to fix bugs (e.g. in the extraction regex)
in one place.
"""

from __future__ import annotations

import os
import re

# Repository root is two levels up from this script's directory
# (scripts/validators/).
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOCS_DIR = os.path.join(REPO_ROOT, "src", "content", "docs")


def extract_all(
    languages: list[str],
    *,
    skip_patterns: list[str] | None = None,
) -> dict[str, str]:
    """Recursively walk the docs directory and extract fenced code blocks.

    Args:
        languages: Fence language tags to match, e.g. ``["csharp"]`` or
            ``["typescript", "ts", "javascript", "js"]``.
        skip_patterns: Regexes matched against the path of each MDX file
            (relative to the docs directory). Any file matching one of
            these patterns is skipped entirely. For example, Node skips
            migration guides (``r"^migration"``) and IAM guides
            (``r"iam-"``) because they reference APIs outside GLIDE.

    Returns:
        A dict mapping ``"<repo_relative_path>:<line_number>"`` to the
        extracted code string.
    """
    fence_re = re.compile(
        r"^\s*```(?:" + "|".join(languages) + r")\s*\n(.*?)^\s*```\s*$",
        re.MULTILINE | re.DOTALL,
    )
    compiled_skips = [re.compile(p) for p in (skip_patterns or [])]

    examples: dict[str, str] = {}
    for root, _dirs, files in os.walk(DOCS_DIR):
        for fname in sorted(files):
            if not fname.endswith(".mdx"):
                continue

            filepath = os.path.join(root, fname)
            rel_path = os.path.relpath(filepath, DOCS_DIR)
            if any(skip.search(rel_path) for skip in compiled_skips):
                continue

            with open(filepath, encoding="utf-8") as fh:
                content = fh.read()

            for match in fence_re.finditer(content):
                key_path = os.path.relpath(filepath, REPO_ROOT)
                line_number = content[: match.start()].count("\n") + 1
                examples[f"{key_path}:{line_number}"] = match.group(1)

    return examples
