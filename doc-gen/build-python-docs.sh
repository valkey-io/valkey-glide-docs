# #!/bin/bash

#!/bin/bash

# Valkey Glide Docgen
# This script installs dependencies, builds the project, and generates documentation

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_LOCATION=$SCRIPT_DIR/docs/python/

if [ -n "$1" ]; then
    PYTHON_CLIENT_DIR="$1"
else
    PYTHON_CLIENT_DIR="$SCRIPT_DIR/valkey-glide/python"
fi

if [ ! -d "$PYTHON_CLIENT_DIR" ]; then
    echo "Error: Directory $PYTHON_CLIENT_DIR does not exist"
    exit 1
fi

python3 -m venv .venv
source .venv/bin/activate
pip3 install --upgrade pip
pip3 install -r $SCRIPT_DIR/requirements.txt
python3 -m mkdocs build --config-file "$SCRIPT_DIR/mkdocs.yml" --site-dir $OUT_LOCATION

echo "Python client documentation generated successfully!"
echo "Output location: $OUT_LOCATION"

#cleanup
deactivate
rm -rf .venv
