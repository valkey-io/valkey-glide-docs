#!/bin/bash

# Valkey Glide Docgen
# This script installs dependencies, builds the project, and generates documentation

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_LOCATION=$SCRIPT_DIR/docs/node/

if [ -n "$1" ]; then
    NODE_CLIENT_DIR="$1"
else
    NODE_CLIENT_DIR="$SCRIPT_DIR/valkey-glide/node"
fi

if [ ! -d "$NODE_CLIENT_DIR" ]; then
    echo "Error: Directory $NODE_CLIENT_DIR does not exist"
    exit 1
fi

cd "$NODE_CLIENT_DIR"
npm install typedoc
npm run build
npx typedoc --options $SCRIPT_DIR/typedoc.json --out $OUT_LOCATION

echo "Node client documentation generated successfully!"
echo "Output location: $OUT_LOCATION"
