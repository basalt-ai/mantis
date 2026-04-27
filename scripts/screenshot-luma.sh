#!/usr/bin/env bash
# Render public/luma-visual.html into public/luma-visual.png at 1080x1080 (3x DPI)
# Uses Chrome headless + Python PIL to crop precisely (the card occasionally extends
# slightly past a 1080px viewport, so we render with a 20px buffer and crop).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTML="$ROOT/public/luma-visual.html"
OUT="$ROOT/public/luma-visual.png"
TMP="$(mktemp -d)/luma-buffered.png"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=3 \
  --window-size=1100,1100 \
  --virtual-time-budget=5000 \
  --screenshot="$TMP" \
  "file://$HTML?export=1" >/dev/null 2>&1

python3 - <<EOF
from PIL import Image
img = Image.open("$TMP")
img.crop((0, 0, 3240, 3240)).save("$OUT")
EOF

rm -f "$TMP"
rmdir "$(dirname "$TMP")" 2>/dev/null || true
echo "wrote $OUT (3240x3240, 1080x1080 @ 3x DPI)"
