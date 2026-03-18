#!/usr/bin/env bash
# Fixes remark-stringify escaping [ to \[ in:
# 1. Starlight directives: :::type\[Title] → :::type[Title]
# 2. Checkbox list items: * \[ ] → * [ ]
find src/content/docs -type f \( -name '*.md' -o -name '*.mdx' \) -print0 | \
  xargs -0 sed -i '' \
    -e 's/:::\([a-z]*\)\\\[/:::\1[/g' \
    -e 's/^\( *\)\* \\\[ ]/\1* [ ]/g' \
    -e 's/^\( *\)- \\\[ ]/\1- [ ]/g'
