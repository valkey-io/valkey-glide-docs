#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$SCRIPT_DIR/test/valkey-glide-docs"
DIST_DIR="$SCRIPT_DIR/../dist"

NODE_API_TARGET_PATH="${TEST_DIR}/languages/nodejs/api"
JAVA_API_TARGET_PATH="${TEST_DIR}/languages/java/api"
PYTHON_API_TARGET_PATH="${TEST_DIR}/languages/python/api"

API_DOCS_DIR="$SCRIPT_DIR/docs"
NODE_API_DOCS="${API_DOCS_DIR}/node"
JAVA_API_DOCS="${API_DOCS_DIR}/java"
PYTHON_API_DOCS="${API_DOCS_DIR}/python"

SERVER_PORT=8000

# Cleanup
rm -rf "${TEST_DIR}"/* "${API_DOCS_DIR}"/*

build_valkey_glide_docs() {
    cd $SCRIPT_DIR/..
    pnpm run build

    # build valkey-glide-docs
    cd $SCRIPT_DIR/..
    pnpm run build
}

build_valkey_glide_docs

cd "$SCRIPT_DIR"
./build-docs.sh


# Copy valkey-glide-docs to TEST_DIR
if [ -d "${DIST_DIR}" ]; then
    mkdir -p "${TEST_DIR}"
    cp -r "${DIST_DIR}"/* "${TEST_DIR}/"
    echo "Copied valkey-glide-docs to test directory."
else
    echo "Warning: ${DIST_DIR} does not exist"
fi

# Check API docs were generated
if [ ! -d "$NODE_API_DOCS"  ]; then
    echo "Error: $NODE_API_DOCS does not exist"
    exit 1
fi
if [ ! -d "$JAVA_API_DOCS"  ]; then
    echo "Error: $JAVA_API_DOCS does not exist"
    exit 1
fi
if [ ! -d "$PYTHON_API_DOCS"  ]; then
    echo "Error: $PYTHON_API_DOCS does not exist"
    exit 1
fi

mkdir -p "${NODE_API_TARGET_PATH}"
mkdir -p "${JAVA_API_TARGET_PATH}"
mkdir -p "${PYTHON_API_TARGET_PATH}"
cp -r "$NODE_API_DOCS"/* "$NODE_API_TARGET_PATH/"
cp -r "$JAVA_API_DOCS"/* "$JAVA_API_TARGET_PATH/"
cp -r "$PYTHON_API_DOCS"/* "$PYTHON_API_TARGET_PATH/"

echo "Copied API docs to test directory."

# Start simple HTTP server to test
cd "${TEST_DIR}"
echo "Starting host server."
python3 -m http.server ${SERVER_PORT}