import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const swcWasmDir = path.join(root, "node_modules", "@next", "swc-wasm-nodejs");
const args = process.argv.slice(2);

if (existsSync(swcWasmDir)) {
  process.env.NEXT_TEST_WASM_DIR = swcWasmDir;
}

process.env.NAPI_RS_FORCE_WASI = process.env.NAPI_RS_FORCE_WASI || "1";

const child = spawn(process.execPath, [nextBin, ...args], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 1);
});
