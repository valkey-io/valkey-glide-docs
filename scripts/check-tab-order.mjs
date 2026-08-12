#!/usr/bin/env node
// Validates that language <TabItem> groups in the docs follow the canonical
// ordering defined in AGENTS.md. Language tabs that are absent from a group are
// simply skipped; a group is a violation only when the RELATIVE order of the
// languages it does contain differs from the canonical order.
//
// Run: node scripts/check-tab-order.mjs   (also exposed as `pnpm check:tab-order`)
// Exits non-zero and prints file:line for every offending <Tabs> group.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DOCS_DIR = join(ROOT, "src/content/docs");

// Canonical order — keep in sync with the "Language Tabs" section of AGENTS.md.
const CANONICAL = ["Python", "Java", "Node", "Go", "PHP", "C#", "Ruby"];
const RANK = new Map(CANONICAL.map((lang, i) => [lang, i]));

// Normalize label variants to their canonical key.
function normalize(label) {
  if (label === "Node.js") return "Node";
  return label;
}

function isLanguage(label) {
  return RANK.has(normalize(label));
}

function mdxFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...mdxFiles(full));
    else if (entry.endsWith(".mdx") || entry.endsWith(".md")) out.push(full);
  }
  return out;
}

const ITEM_RE = /<TabItem\b[^>]*\blabel=(?:"([^"]*)"|'([^']*)')/g;

// Parse a file into a list of tab groups. Uses a stack so that a <TabItem>
// is attributed to its immediately enclosing <Tabs>, and nested tab groups
// (e.g. build-tool tabs inside a language tab) are handled independently.
function parseGroups(text) {
  const lines = text.split("\n");
  const stack = [];
  const groups = [];
  lines.forEach((line, idx) => {
    // A single line can, in principle, contain multiple tokens; scan in order.
    // We process opens/items/closes by their column position on the line.
    const tokens = [];
    let m;
    const openRe = /<(?:Tabs|ParamTabs)\b/g;
    while ((m = openRe.exec(line))) tokens.push({ col: m.index, type: "open" });
    const closeRe = /<\/(?:Tabs|ParamTabs)>/g;
    while ((m = closeRe.exec(line)))
      tokens.push({ col: m.index, type: "close" });
    ITEM_RE.lastIndex = 0;
    while ((m = ITEM_RE.exec(line))) {
      tokens.push({ col: m.index, type: "item", label: m[1] ?? m[2] });
    }
    tokens.sort((a, b) => a.col - b.col);
    for (const t of tokens) {
      if (t.type === "open") {
        const g = { line: idx + 1, labels: [] };
        stack.push(g);
        groups.push(g);
      } else if (t.type === "close") {
        stack.pop();
      } else if (t.type === "item") {
        if (stack.length) stack[stack.length - 1].labels.push(t.label);
      }
    }
  });
  return groups;
}

function checkGroup(labels) {
  const langs = labels.filter(isLanguage).map(normalize);
  for (let i = 1; i < langs.length; i++) {
    if (RANK.get(langs[i]) < RANK.get(langs[i - 1])) {
      return langs; // out of order
    }
  }
  return null;
}

let violations = 0;
let filesWithViolations = 0;

for (const file of mdxFiles(DOCS_DIR)) {
  const text = readFileSync(file, "utf8");
  const groups = parseGroups(text);
  let fileHadViolation = false;
  for (const g of groups) {
    const bad = checkGroup(g.labels);
    if (bad) {
      if (!fileHadViolation) {
        console.error(`\n${relative(ROOT, file)}`);
        fileHadViolation = true;
        filesWithViolations++;
      }
      const expected = [...bad].sort((a, b) => RANK.get(a) - RANK.get(b));
      console.error(
        `  line ${g.line}: [${bad.join(", ")}]  →  expected [${expected.join(", ")}]`,
      );
      violations++;
    }
  }
}

const canonicalStr = CANONICAL.join(" → ");
if (violations > 0) {
  console.error(
    `\n✖ ${violations} tab group(s) in ${filesWithViolations} file(s) violate the canonical language order (${canonicalStr}).`,
  );
  process.exit(1);
} else {
  console.log(
    `✓ All language tab groups follow the canonical order (${canonicalStr}).`,
  );
}
