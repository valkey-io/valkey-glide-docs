#!/usr/bin/env python3
"""Extract fenced code examples for a given language from the MDX docs.

This is the shared extraction layer used by every per-language example
checker (see ``check_examples.py``). It walks ``src/content/docs`` for
``.mdx`` files, pulls out each fenced code block whose info string names the
requested language, and returns a mapping of
``"<repo_relative_path>:<line_number>" -> code``.

The mapping format matches the contract expected by the upstream
``validate_examples.py`` scripts that live in each client repository
(originating with ``valkey-glide-csharp``): the keys identify where each
snippet lives in the docs so that compiler errors can be reported against
the source.

Use it as a library::

    from extract_examples import extract_examples, LANGUAGE_FENCES
    blocks = extract_examples("python")

or as a CLI for debugging / local runs::

    python scripts/extract_examples.py --language go --out blocks.json
    python scripts/extract_examples.py --language python   # prints JSON
    python scripts/extract_examples.py --list-languages
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

# Repository root is one level up from this script's directory (scripts/).
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(_REPO_ROOT, "src", "content", "docs")

# Maps a canonical language key to the Markdown fence "info string" tokens
# used for that language across the docs. The first token is the canonical
# one; the rest are aliases that appear in practice.
#
# Keep these in sync with the fences actually used in src/content/docs.
# (Node groups the TypeScript and JavaScript fences because the docs use
# both for the Node.js client examples.)
LANGUAGE_FENCES: dict[str, list[str]] = {
    "csharp": ["csharp"],
    "java": ["java"],
    "python": ["python", "py"],
    "go": ["go"],
    "node": ["typescript", "javascript", "ts", "js"],
    "php": ["php"],
}


def _block_regex(fences: list[str]) -> "re.Pattern[str]":
    """Build a regex matching a fenced code block for the given fence tokens.

    Mirrors the behavior of the original C#-only extractor: leading
    horizontal whitespace before the fences is allowed (common inside MDX
    ``<Tabs>``/``<TabItem>`` components), and the info string must be exactly
    one of ``fences`` (optionally followed by trailing whitespace) so that,
    e.g., ``go`` does not match a ``goat`` fence.

    The opening fence is matched with ``[ \\t]*`` (horizontal whitespace
    only) rather than ``\\s*`` so the captured line number points at the
    fence itself instead of a preceding blank line.
    """
    # Longest token first so the alternation is unambiguous (e.g. ``python``
    # is tried before ``py``).
    alternation = "|".join(
        re.escape(tok) for tok in sorted(fences, key=len, reverse=True)
    )
    return re.compile(
        rf"^[ \t]*```(?:{alternation})[ \t]*\n(.*?)^[ \t]*```[ \t]*$",
        re.MULTILINE | re.DOTALL,
    )


def extract_examples(language: str, docs_dir: str = DOCS_DIR) -> dict[str, str]:
    """Extract every code block for ``language`` from ``docs_dir``.

    Returns a dict mapping ``"<repo_relative_path>:<line_number>"`` to the
    raw code string, where ``line_number`` is the 1-based line of the opening
    fence. Snippets are returned with whatever indentation they carry in the
    MDX source (e.g. when nested inside ``<TabItem>``); the language's
    validator is responsible for normalizing indentation (dedent) before
    wrapping and compiling, exactly as the C# validator does today.

    Only blocks fenced with the bare language token (e.g. ` ```python `) are
    extracted. A block fenced as ` ```text ` or with any info-string meta
    (e.g. a ``title="..."``) is not matched, which is how non-runnable
    snippets such as API-signature illustrations opt out of validation.
    """
    if language not in LANGUAGE_FENCES:
        known = ", ".join(sorted(LANGUAGE_FENCES))
        raise ValueError(f"Unknown language '{language}'. Known: {known}.")

    pattern = _block_regex(LANGUAGE_FENCES[language])
    examples: dict[str, str] = {}

    for root, _dirs, files in os.walk(docs_dir):
        for fname in sorted(files):
            if not fname.endswith(".mdx"):
                continue

            filepath = os.path.join(root, fname)
            with open(filepath, encoding="utf-8") as fh:
                content = fh.read()

            for match in pattern.finditer(content):
                key_path = os.path.relpath(filepath, _REPO_ROOT)
                line_number = content[: match.start()].count("\n") + 1
                examples[f"{key_path}:{line_number}"] = match.group(1)

    return examples


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract fenced code examples for a language from the docs."
    )
    parser.add_argument(
        "--language",
        choices=sorted(LANGUAGE_FENCES),
        help="Language whose code blocks to extract.",
    )
    parser.add_argument(
        "--out",
        help="Write the examples JSON to this path (default: stdout).",
    )
    parser.add_argument(
        "--list-languages",
        action="store_true",
        help="List the supported languages and their fence tokens, then exit.",
    )
    args = parser.parse_args()

    if args.list_languages:
        for lang in sorted(LANGUAGE_FENCES):
            fences = ", ".join(LANGUAGE_FENCES[lang])
            print(f"{lang}: {fences}")
        return

    if not args.language:
        parser.error("--language is required (unless --list-languages is given)")

    if not os.path.isdir(DOCS_DIR):
        print(f"Error: docs directory not found: {DOCS_DIR}", file=sys.stderr)
        sys.exit(1)

    examples = extract_examples(args.language)
    payload = json.dumps(examples, indent=2, sort_keys=True)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(payload)
        print(
            f"Extracted {len(examples)} {args.language} example(s) -> {args.out}",
            file=sys.stderr,
        )
    else:
        print(payload)


if __name__ == "__main__":
    main()
