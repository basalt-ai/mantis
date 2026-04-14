/**
 * Light cache clear before `npm run dev` — only bundler tool caches.
 * Does NOT delete `.next` (wiping `.next` while a dev server is still running
 * causes Turbopack ENOENT on app-build-manifest.json and HTTP 500).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.SKIP_PREDEV === "1") {
  process.exit(0);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "node_modules", ".cache");
try {
  fs.rmSync(target, { recursive: true, force: true });
} catch {
  // ignore
}
