#!/usr/bin/env bash
# Check if excluded broken upstream links still appear in the built dist/ output.
# If any are no longer found, they've been fixed upstream and the exclusion in lychee.toml should be removed.

set -euo pipefail

DIST_DIR="${1:-dist}"

LINKS=(
  "https://valkey.io/docs/commands/randomkey/"
  "https://valkey.io/docs/latest/commands/sinter/"
  "https://valkey.io/docs/latest/commands/function-dump/"
  "https://valkey.io/docs/latest/commands/function-restore/"
)

removed=()

for link in "${LINKS[@]}"; do
  if ! grep -rqF "$link" "$DIST_DIR"; then
    removed+=("$link")
    echo "NOT FOUND: $link"
  else
    echo "Still present: $link"
  fi
done

if [ ${#removed[@]} -gt 0 ]; then
  echo ""
  echo "ERROR: ${#removed[@]} link(s) no longer appear in $DIST_DIR."
  echo "Please remove them from the exclude list in lychee.toml."
  exit 1
fi

echo ""
echo "All excluded links are still present. No changes needed."
