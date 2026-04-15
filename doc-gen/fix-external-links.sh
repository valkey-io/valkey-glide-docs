#!/bin/bash

# Fixes TypeDoc-incompatible {@link URL|text} for external URLs in .ts source files.
# TypeDoc's {@link} only supports declaration references, not external URLs.
# This converts them to markdown links: [text](URL)
#
# Usage: ./fix-external-links.sh [path-to-node-src]
#   Defaults to: doc-gen/valkey-glide/node/src

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${1:-$SCRIPT_DIR/valkey-glide/node/src}"

if [ ! -d "$SRC_DIR" ]; then
    echo "Error: Directory $SRC_DIR does not exist"
    exit 1
fi

# Fix {@link URL|display text} -> [display text](URL)
# Handles optional spaces around pipe, optional backticks in display text,
# and a known stray " in one URL.
find "$SRC_DIR" -name '*.ts' -exec sed -i.bak -E \
    's/\{@link +((https?:\/\/[^|}"]+[^ |}"]))"? *\| *`?([^}`]+)`?\}/[\3](\1)/g' {} +

# Fix {@link URL} (no display text) -> [URL](URL)
find "$SRC_DIR" -name '*.ts' -exec sed -i.bak -E \
    's/\{@link +(https?:\/\/[^ }]+)\}/[\1](\1)/g' {} +

# Clean up backup files
find "$SRC_DIR" -name '*.ts.bak' -delete

# Report
REMAINING=$(grep -r '{@link https\?://' "$SRC_DIR" --include='*.ts' -c 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
echo "Done. Remaining {@link https://...} occurrences: $REMAINING"
