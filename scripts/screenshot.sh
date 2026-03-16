#!/bin/bash
# Screenshot a kaiw.io dashboard page
# Usage: screenshot.sh <route> <output_path>
# Example: screenshot.sh /freq screenshots/freq-before.png

ROUTE="${1:-/}"
OUTPUT="${2:-screenshot.png}"
BASE_URL="http://localhost:5173"

cd /home/scribble0563/projects/kaiw-hub

npx playwright screenshot --viewport-size="1440,900" "${BASE_URL}${ROUTE}" "$OUTPUT" 2>/dev/null

if [ -f "$OUTPUT" ]; then
  echo "✅ Screenshot saved: $OUTPUT"
else
  echo "❌ Failed to capture: $ROUTE"
fi
