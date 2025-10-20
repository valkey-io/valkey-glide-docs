#!/bin/bash

# Script to generate Valkey Glide client API documentations

set -e  # Exit on any error

CURR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="git@github.com:valkey-io/valkey-glide.git"

# Cleanup
rm -rf "$CURR_DIR/valkey-glide"

# Shallow clone for efficiency
git clone --depth 1 --branch main "$SOURCE"

echo "Generating client api docs..."
"$CURR_DIR/build-node-docs.sh"
"$CURR_DIR/build-java-docs.sh"
"$CURR_DIR/build-python-docs.sh"

echo "Waiting parallel doc generation to complete..."
wait

echo "=== All done! ==="
