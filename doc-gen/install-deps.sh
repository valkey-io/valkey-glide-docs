#!/bin/bash

# Install common dependencies required for building Valkey Glide docs
# Usage: ./doc-gen/install-deps.sh

set -e

echo "Installing system dependencies..."
sudo apt-get update -y
sudo apt-get install -y git gcc pkg-config openssl libssl-dev unzip cmake python3 python3-pip

echo "Installing Rust..."
# -y flag added for non-interactive installation
curl --proto '=https' --tlsv1.2 -sSf --retry 3 --retry-delay 2 https://sh.rustup.rs | sh -s -- -y

# Source cargo env for the current script execution
source "$HOME/.cargo/env"

echo "Installing Zig and Cargo Zigbuild..."
pip3 install ziglang
cargo install --locked cargo-zigbuild

echo "Installing Protoc 29.1..."
PB_REL="https://github.com/protocolbuffers/protobuf/releases"
curl -LO --retry 3 --retry-delay 2 $PB_REL/download/v29.1/protoc-29.1-linux-x86_64.zip
# -o to overwrite without prompting if file exists
unzip -o protoc-29.1-linux-x86_64.zip -d $HOME/.local

# Cleanup zip
rm protoc-29.1-linux-x86_64.zip

echo "Configuring Paths..."
# Add paths to GITHUB_PATH so they persist to subsequent workflow steps
if [ -n "$GITHUB_PATH" ]; then
    echo "$HOME/.cargo/bin" >> $GITHUB_PATH
    echo "$HOME/.local/bin" >> $GITHUB_PATH
fi

echo "Dependencies installed successfully. "
