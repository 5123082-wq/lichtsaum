#!/usr/bin/env bash
set -euo pipefail

PORT=3000
HOST=127.0.0.1
MAX_RETRIES=8
retries=0

while true; do
  retries=$((retries + 1))
  echo "[watchdog] starting dev server (attempt $retries)"

  if pnpm dev --hostname "$HOST" --port "$PORT"; then
    code=0
  else
    code=$?
  fi

  if [[ "$code" -eq 130 || "$code" -eq 143 ]]; then
    echo "[watchdog] manual stop detected, exit"
    exit "$code"
  fi

  if [[ "$retries" -ge "$MAX_RETRIES" ]]; then
    echo "[watchdog] too many restarts, stop to avoid loop"
    exit "$code"
  fi

  delay=$((1 << (retries - 1)))
  if [[ "$delay" -gt 8 ]]; then
    delay=8
  fi

  echo "[watchdog] restart in ${delay}s..."
  sleep "$delay"
 done
