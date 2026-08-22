#!/bin/sh

# ==============================================================================
# SIT University - Alpine NAT VPS Staging Stop Script
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT_DIR/.staging_pids"

# Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping SIT University Staging Services...${NC}"

if [ -f "$PID_FILE" ]; then
  . "$PID_FILE"
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null && echo -e "${GREEN}✓ Backend stopped (PID: $BACKEND_PID)${NC}" || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null && echo -e "${GREEN}✓ Frontend stopped (PID: $FRONTEND_PID)${NC}" || true
  fi
  rm -f "$PID_FILE"
fi

# Fallback: Kill processes on assigned NAT ports
fuser -k 4118/tcp 2>/dev/null || true
fuser -k 3965/tcp 2>/dev/null || true

echo -e "${GREEN}✓ All Node.js staging services stopped.${NC}"
echo -e "${BLUE}Note: SeaweedFS Docker container is still running. To stop it, run:${NC}"
echo -e "  docker compose -f seaweedfs-staging.yml down\n"
