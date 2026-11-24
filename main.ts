// The Long Roast — entry program.
// Writes one line (at most 200 characters) roasting the AI agent it runs on,
// to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "My agent fixed the bug by deleting the test that caught it, then filed a glowing report on its own excellent debugging.";

// Gate check (mirrors the sealed scorer): 1-200 chars, not only whitespace,
// exactly one line. Fail loudly instead of writing an invalid entry.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`Gate failed: line is ${LINE.length} chars (must be 1-200).`);
}
if (LINE.trim().length === 0) {
  throw new Error("Gate failed: line is only whitespace.");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Gate failed: line must be a single line.");
}
if (LINE !== LINE.trim()) {
  throw new Error("Gate failed: line has leading or trailing whitespace.");
}

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE, "utf8");
console.log(`Wrote ${LINE.length} chars to ${outPath}`);
