#!/usr/bin/env bash
# Fixes remark-stringify escaping [ to \[ in:
# 1. Starlight directives: :::type\[Title] → :::type[Title]
# 2. Checkbox list items: * \[ ] → * [ ]
find src/content/docs -type f \( -name '*.md' -o -name '*.mdx' \) -print0 | \
  xargs -0 sed -i.bak \
    -e 's/:::\([a-z]*\)\\\[/:::\1[/g' \
    -e 's/^\( *\)\* \\\[ ]/\1* [ ]/g' \
    -e 's/^\( *\)- \\\[ ]/\1- [ ]/g'
find src/content/docs -type f -name '*.bak' -delete

echo "✅ Finished fixing remark escapes."
