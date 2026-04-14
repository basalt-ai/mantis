/**
 * Removes Next.js and bundler caches so dev/build never load stale chunk IDs
 * (fixes "Cannot find module './682.js'" and similar HTTP 500s in dev).
 * Cross-platform (Node fs), safe if dirs are missing.
 *
 * Skip when starting dev without a wipe: SKIP_PREDEV=1 npm run dev
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.SKIP_PREDEV === "1") {
  process.exit(0);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const rel of [".next", "node_modules/.cache"]) {
  const target = path.join(root, rel);
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch {
    // ignore permission / race
  }
}
