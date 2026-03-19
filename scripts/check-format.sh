#!/bin/bash

# Run remark check and filter out known false positives (MDX bracket syntax warnings).
# Fails if any real warnings remain.
#
# remark-mdx does not fully understand Starlight's custom directives (e.g. Aside, Tabs),
# causing false "no-undefined-references" warnings for bracket syntax like [!NOTE].
# This script will run remark and filter out those specific warnings, while still catching any other real warnings.

cd "$(dirname "$0")/.." || exit 1

output=$(npx remark --no-stdout "src/content/docs/**/*.{md,mdx}" 2>&1)
remark_exit=$?

if [ $remark_exit -ne 0 ]; then
  echo "$output"
  echo ""
  echo "❌ FAIL: Remark exited with error code $remark_exit"
  exit 1
fi

filtered=$(echo "$output" | grep -v 'for a link or escaped opening bracket' | sed '$d')

echo "$filtered"

warnings=$(echo "$filtered" | grep 'warning')

if [ -n "$warnings" ]; then
  echo ""
  echo "❌ FAIL: Remark lint found warnings"
  exit 1
fi

echo ""
echo "✅ PASS: No remark lint warnings found"
