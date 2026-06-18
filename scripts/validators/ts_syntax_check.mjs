// Syntax-only validator for Node (TypeScript / JavaScript) doc examples.
//
// Reads a JSON object { "<file>:<line>": "<code>" } from stdin and writes a
// JSON object { "<file>:<line>": ["<error>", ...] } to stdout. Uses the
// TypeScript compiler's transpileModule, which reports *syntactic* diagnostics
// only — it does not type-check, so undefined identifiers like `client` and
// unresolved imports are intentionally not flagged.
//
// Requires the `typescript` package to be resolvable (the workflow installs it
// with `npm install typescript`). Exits non-zero only on an internal error;
// per-snippet syntax errors are reported in the output object.

import fs from "fs";
import { createRequire } from "module";

// Resolve `typescript` via CommonJS resolution (honors NODE_PATH and the
// node_modules walk-up), so the workflow can install it anywhere.
const require = createRequire(import.meta.url);
let ts;
try {
  ts = require("typescript");
} catch (err) {
  process.stderr.write(
    "Error: cannot load the 'typescript' package. Run `npm install typescript`.\n",
  );
  process.exit(2);
}

function readStdin() {
  return fs.readFileSync(0, "utf8");
}

const examples = JSON.parse(readStdin());
const compilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ESNext,
  // Keep it permissive: we only care about syntax, not module resolution.
  isolatedModules: false,
};

const result = {};
for (const [source, code] of Object.entries(examples)) {
  const out = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions,
  });
  const messages = (out.diagnostics || [])
    .filter((d) => d.category === ts.DiagnosticCategory.Error)
    .map((d) => {
      const text = ts.flattenDiagnosticMessageText(d.messageText, "\n");
      if (typeof d.start === "number" && d.file) {
        const { line } = d.file.getLineAndCharacterOfPosition(d.start);
        return `${text} (around line ${line + 1})`;
      }
      return text;
    });
  result[source] = messages;
}

process.stdout.write(JSON.stringify(result));
