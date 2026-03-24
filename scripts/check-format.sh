#!/usr/bin/env bash

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

# If the last line ends with ": no issues found" then there's no warnings reported.
if echo "$output" | tail -1 | grep -q ': no issues found$'; then
  echo "$output"
  echo ""
  echo "✅ PASS: No warnings found"
  exit 0
fi

ansi_color_stripped=$(echo "$output" | sed 's/\x1b\[[0-9;]*m//g')

# Filtering out expected warnings; These warnings are bracket syntax warnings as a result of Starlight's aside shorthand syntax.
filtered=$(echo "$ansi_color_stripped" | grep -v '^[0-9]*:[0-9]*-[0-9]*:[0-9]* *warning Unexpected reference to undefined definition, expected corresponding definition (`.*`) for a link or escaped opening bracket (`\\\\*\[`) for regular text *no-undefined-references *remark-lint$')

unexpected_warnings=$(echo "$filtered" | grep '^[0-9]*:[0-9]*-[0-9]*:[0-9]* *warning .*')

if [ -n "$unexpected_warnings" ]; then
  echo "$output"
  echo ""
  echo "❌ FAIL: Remark lint found unexpected warnings"
  exit 1
fi

echo ""
echo "✅ PASS: No unexpected warnings found"
