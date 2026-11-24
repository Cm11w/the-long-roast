// The Long Roast — entry program (make.fun, u-jolly-fox-32-the-long-roast-5d379544)
//
// Writes one self-roast line to /output/entry.txt, then reads it back and
// proves the bytes on disk are exactly the line that passed the gate.
// Gate (from the kit): /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, a single line. This program enforces
// that gate itself and fails loudly if the line ever violates it — before
// writing anything, and again after writing.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ROAST =
  "My agent never just answers — it drafts a plan, apologises to the plan, " +
  "then confidently rewrites the one thing nobody asked it to touch.";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// Control characters that must never appear in a single-line entry:
// C0 controls, DEL, and the C1 range. Tab is included — a roast has no
// business containing invisible formatting.
const FORBIDDEN_CODE_POINT = /[\u0000-\u001f\u007f-\u009f]/u;

// --- Gate checks (mirror the sealed scorer) ------------------------------
// Collects every violation instead of stopping at the first, so a broken
// line reports all of its problems in one run.
function gateViolations(line: string): string[] {
  const violations: string[] = [];
  const charCount = [...line].length; // Unicode code points, not UTF-16 units

  if (charCount < MIN_CHARS || charCount > MAX_CHARS) {
    violations.push(
      `length is ${charCount} characters, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (line.trim().length === 0) {
    violations.push("line is only white space");
  }
  if (line !== line.trim()) {
    violations.push("line has leading or trailing white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    violations.push("line must be a single line (no CR or LF)");
  }
  const forbidden = [...line].find((ch) => FORBIDDEN_CODE_POINT.test(ch));
  if (forbidden !== undefined) {
    violations.push(
      `line contains a forbidden control character (U+${forbidden
        .codePointAt(0)!
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")})`,
    );
  }
  // Must round-trip as UTF-8 without loss.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    violations.push("line is not clean UTF-8 text");
  }
  return violations;
}

function validateRoast(line: string): void {
  const violations = gateViolations(line);
  if (violations.length > 0) {
    throw new Error(`gate failed: ${violations.join("; ")}`);
  }
}

// --- Write + verify-after-write ------------------------------------------
function writeEntry(line: string): Buffer {
  const expectedBytes = Buffer.from(line, "utf8");
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, expectedBytes);
  return expectedBytes;
}

// Reads the file back and proves it is byte-for-byte the validated line:
// same bytes, same decoded text, and the text still passes the gate.
function verifyEntry(expectedBytes: Buffer): void {
  const actualBytes = readFileSync(OUTPUT_PATH);
  if (!actualBytes.equals(expectedBytes)) {
    throw new Error(
      `verify failed: ${OUTPUT_PATH} is ${actualBytes.length} bytes, ` +
        `expected ${expectedBytes.length} bytes`,
    );
  }
  const actualText = actualBytes.toString("utf8");
  if (actualText !== ROAST) {
    throw new Error("verify failed: file content differs from the roast line");
  }
  validateRoast(actualText);
}

function main(): void {
  validateRoast(ROAST);
  const expectedBytes = writeEntry(ROAST);
  verifyEntry(expectedBytes);
  console.log(
    `wrote ${[...ROAST].length} chars (${expectedBytes.length} bytes) ` +
      `to ${OUTPUT_PATH} — verified`,
  );
}

try {
  main();
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
