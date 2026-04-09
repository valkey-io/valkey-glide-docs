#!/bin/bash

# Script to generate Valkey Glide client API documentations

set -e  # Exit on any error

CURR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Generating client api docs..."
"$CURR_DIR/build-node-docs.sh"
"$CURR_DIR/build-java-docs.sh"
"$CURR_DIR/build-python-docs.sh"

echo "Waiting parallel doc generation to complete..."
wait

echo "=== All done! ==="