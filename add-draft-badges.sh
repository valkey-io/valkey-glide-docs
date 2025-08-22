#!/bin/bash

# Script to add draft badges to all MDX files in the project
# This adds a "Draft" badge to the sidebar without setting the page as draft

set -e

echo "Adding draft badges to all MDX files..."

# Count files processed
processed_count=0
skipped_count=0

# Find all MDX files in the src/content/docs directory
find src/content/docs -name "*.mdx" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Check if the file already has a sidebar section with badge
    if grep -q "sidebar:" "$file" && grep -q "badge:" "$file"; then
        echo "  ⚠️  Skipping - already has sidebar badge: $file"
        skipped_count=$((skipped_count + 1))
        continue
    fi
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Process the file with a simpler approach
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
        
        # Add sidebar with badge before closing frontmatter
        print "sidebar:"
        print "  badge:"
        print "    text: Draft"
        print "    variant: caution"
        print $0
        next
    }
    
    # Print all other lines as-is
    {
        print $0
    }
    ' "$file" > "$temp_file"
    
    # Replace the original file with the processed version
    mv "$temp_file" "$file"
    
    echo "  ✅ Added draft badge to: $file"
    processed_count=$((processed_count + 1))
done

echo ""
echo "🎉 Finished adding draft badges to all MDX files!"
echo "📊 Processed: $processed_count files"
echo "⏭️  Skipped: $skipped_count files (already had badges)"
echo ""
echo "Badge format added:"
echo "sidebar:"
echo "  badge:"
echo "    text: Draft"
echo "    variant: caution"