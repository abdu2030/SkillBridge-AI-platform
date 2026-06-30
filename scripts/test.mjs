import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
require("./register-ts.cjs");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testsDir = path.join(root, "tests");

function findTests(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return findTests(fullPath);
      return entry.isFile() && entry.name.endsWith(".test.ts") ? [fullPath] : [];
    })
    .sort();
}

const tests = findTests(testsDir);

if (tests.length === 0) {
  console.log("No tests found.");
  process.exit(0);
}

tests.forEach((testFile) => {
  require(testFile);
});
