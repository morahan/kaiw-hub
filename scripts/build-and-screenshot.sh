#!/bin/bash
# Build the project and take screenshots in one process
set -e

REPO=/home/scribble0563/projects/kaiw-hub
LABEL="${1:-snapshot}"
AGENTS="${2:-hub,freq,badger,aria,greta,marty,renzo,kaia,thea,reno,quanta,maverick}"

cd "$REPO"

echo "🔨 Building..."
VITE_SKIP_AUTH=true VITE_CLERK_PUBLISHABLE_KEY=pk_test_placeholder npm run build 2>&1 | tail -3

echo "🌐 Starting server..."
node scripts/serve.js &
SERVER_PID=$!

# Wait for server to be ready
for i in {1..20}; do
  if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5173/ 2>/dev/null | grep -q "200"; then
    echo "  Server ready ✅"
    break
  fi
  sleep 0.5
done

echo "📸 Taking screenshots ($LABEL)..."
node scripts/screenshot.js "$AGENTS" --label "$LABEL" 2>&1

echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null || true

echo "✨ Done. Label: $LABEL"
