#!/bin/bash

# Script to generate Valkey Glide client API documentations
# Usage: ./build-docs.sh [node|java|python|all]

set -e  # Exit on any error

CURR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="git@github.com:valkey-io/valkey-glide.git"
TARGET=${1:-all} # Default to 'all' if no argument provided

# Cleanup
rm -rf "$CURR_DIR/valkey-glide"

# Shallow clone for efficiency
git clone --depth 1 --branch main "$SOURCE" "$CURR_DIR/valkey-glide"

echo "Starting documentation generation for target: $TARGET"

case "$TARGET" in
  "node")
    echo "Building Node.js docs..."
    "$CURR_DIR/build-node-docs.sh"
    ;;
  "java")
    echo "Building Java docs..."
    "$CURR_DIR/build-java-docs.sh"
    ;;
  "python")
    echo "Building Python docs..."
    "$CURR_DIR/build-python-docs.sh"
    ;;
  "all")
    echo "Building all docs..."
    "$CURR_DIR/build-node-docs.sh"
    "$CURR_DIR/build-java-docs.sh"
    "$CURR_DIR/build-python-docs.sh"
    ;;
  *)
    echo "Invalid argument: $TARGET. Use [node|java|python|all]"
    exit 1
    ;;
esac

echo "=== Done generating $TARGET docs! ==="