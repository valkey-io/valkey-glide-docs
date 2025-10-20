#!/bin/bash

# Valkey Glide Java Docgen Script
# This script generate Javadoc for the Java client.

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_LOCATION=$SCRIPT_DIR/docs/java/

if [ -n "$1" ]; then
    JAVA_CLIENT_DIR="$1"
else
    JAVA_CLIENT_DIR="$SCRIPT_DIR/valkey-glide/java"
fi

if [ ! -d "$JAVA_CLIENT_DIR" ]; then
    echo "Error: Directory $JAVA_CLIENT_DIR does not exist"
    exit 1
fi

cd "$JAVA_CLIENT_DIR"

# We use a temporary init script to configure the javadoc task
# to avoid modifying the original build.gradle file.
INIT_SCRIPT=$(mktemp)
cat > "$INIT_SCRIPT" << EOF
    allprojects {
        tasks.withType(Javadoc) {
            exclude '**/module-info.java.disabled'
            exclude '**/module-info.java'
            destinationDir = file("$OUT_LOCATION")
        }
    }
EOF

./gradlew :client:javadoc --init-script "$INIT_SCRIPT"

echo "Java client documentation generated successfully!"
echo "Javadoc output location: $OUT_LOCATION"

# Clean up
rm -f "$INIT_SCRIPT"
