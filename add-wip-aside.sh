#!/bin/bash

# Script to add Work In Progress aside element to all MDX files
# Adds the import statement and the aside right after frontmatter

set -e

echo "Adding Work In Progress aside to all MDX files..."

# The content to add
IMPORT_STATEMENT="import { Aside } from '@astrojs/starlight/components';"
ASIDE_CONTENT='<Aside type="caution" title="Work In Progress!">
This documentation site under construction and is not yet complete!

For official Valkey GLIDE documentation, please refer to the official [Valkey GLIDE](https://github.com/valkey-io/valkey-glide) Github.
</Aside>'

# Count files processed
processed_count=0

# Find all MDX files in the src/content/docs directory
find src/content/docs -name "*.mdx" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Check if the file already has the aside
    if grep -q "Work In Progress!" "$file"; then
        echo "  ⚠️  Skipping - already has WIP aside: $file"
        continue
    fi
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process the file
    # The '\'' is a way to embed a single quote inside a single-quoted awk script
    awk '
    BEGIN {
        in_frontmatter = 0
        frontmatter_ended = 0
    }
    
    # Detect start of frontmatter
    /^---$/ && NR == 1 {
        in_frontmatter = 1
        print $0
        next
    }
    
    # Detect end of frontmatter
    /^---$/ && in_frontmatter && !frontmatter_ended {
        frontmatter_ended = 1
        in_frontmatter = 0
        print $0
        print ""
        print "import { Aside } from '\''@astrojs/starlight/components'\'';"
        print ""
        print "<Aside type=\"caution\" title=\"Work In Progress!\">"
        print "This documentation site under construction and is not yet complete!"
        print ""
        print "For official Valkey GLIDE documentation, please refer to the official [Valkey GLIDE](https://github.com/valkey-io/valkey-glide) Github."
        print "</Aside>"
        print ""
        next
    }
    
    # Print all other lines as-is
    {
        print $0
    }
    ' "$file" > "$temp_file"
    
    # Replace the original file with the processed version
    mv "$temp_file" "$file"
    
    echo "  ✅ Added WIP aside to: $file"
    processed_count=$((processed_count + 1))
done

echo ""
echo "🎉 Finished adding Work In Progress aside to all MDX files!"
echo "📊 Processed files with WIP aside added: $processed_count"
echo ""
echo "Content added:"
echo "$IMPORT_STATEMENT"
echo ""
echo "$ASIDE_CONTENT"