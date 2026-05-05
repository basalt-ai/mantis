/**
 * Download landing illustration assets from the Figma **Images** REST API
 * (server-side render of the nodes — not MCP canvas screenshots).
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=<personal access token> npm run figma:export-landing
 *
 * Token: Figma → Settings → Security → Personal access tokens.
 * File: Pancake-Design (same file key as AGENTS / MCP).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

const FILE_KEY = "fr8NgOCTUxsEbrMEJA3YKu";
const SCALE = 2;
const FORMAT = "png";

/** Figma node ids (use hyphen form in query). Org diagram `428:14926` is HTML (`HomeOrgDiagram`); not exported here. */
const ASSETS = [
  { id: "428-15020", out: "home-landing-integrations-art.png" },
  { id: "428-15124", out: "home-landing-slack-screenshot.png" },
  { id: "428-15129", out: "home-landing-control-ui.png" },
];

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token || token.length < 10) {
  console.warn(
    "[figma-export-landing] FIGMA_ACCESS_TOKEN is not set. Skipping download.\n" +
      "  Set it and run: npm run figma:export-landing\n" +
      "  Existing files in public/ are left unchanged.",
  );
  process.exit(0);
}

const ids = ASSETS.map((a) => a.id).join(",");
const metaUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${ids}&format=${FORMAT}&scale=${SCALE}`;

const metaRes = await fetch(metaUrl, { headers: { "X-Figma-Token": token } });
if (!metaRes.ok) {
  const text = await metaRes.text();
  console.error("[figma-export-landing] Images API error", metaRes.status, text.slice(0, 500));
  process.exit(1);
}

const meta = await metaRes.json();
if (meta.err) {
  console.error("[figma-export-landing] API returned err:", meta.err);
  process.exit(1);
}

const images = meta.images || {};
await fs.promises.mkdir(PUBLIC, { recursive: true });

for (const { id, out } of ASSETS) {
  const url = images[id.replace(/-/g, ":")] ?? images[id];
  if (!url) {
    console.error("[figma-export-landing] No URL for node", id, "keys:", Object.keys(images));
    process.exit(1);
  }
  const imgRes = await fetch(url);
  if (!imgRes.ok) {
    console.error("[figma-export-landing] Download failed", out, imgRes.status);
    process.exit(1);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const dest = path.join(PUBLIC, out);
  await fs.promises.writeFile(dest, buf);
  console.log("[figma-export-landing] Wrote", out, "(" + buf.length + " bytes)");
}

console.log("[figma-export-landing] Done.");
