#!/bin/bash
# Simple HTTP server for previewing the built site locally.
# Requires Python 3.
# Usage: ./serve.sh [port]
#   port - Optional port number (default: 8080)

PORT=${1:-8080}
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting server at http://localhost:$PORT"
echo "Press Ctrl+C to stop"

cd "$DIR"
if command -v python3 &> /dev/null; then
  python3 -m http.server "$PORT"
elif command -v python &> /dev/null; then
  python -m http.server "$PORT"
else
  echo "Error: Python is required to run this server"
  exit 1
fi
