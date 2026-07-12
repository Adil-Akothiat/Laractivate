#!/bin/sh
set -e

# 1. Check if node_modules exists
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    echo "node_modules is empty. Installing dependencies..."
    npm install
fi

# 2. Execute the CMD from docker-compose (usually 'npm run dev')
exec "$@"