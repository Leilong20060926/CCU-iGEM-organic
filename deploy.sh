#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "[1/3] Pulling latest code..."
git pull --ff-only

echo "[2/3] Rebuilding frontend container..."
docker compose build client

echo "[3/3] Restarting site..."
docker compose up -d --force-recreate client

echo "Deployment complete."
