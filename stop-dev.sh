#!/usr/bin/env bash

# ==============================================================================
# SIT University Development Environment Teardown (Bash)
# Stops: SeaweedFS (Docker), NestJS Backend (port 5000), Next.js Frontend (port 3000)
# ==============================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  🛑 Stopping SIT University Development Stack     ${NC}"
echo -e "${BLUE}====================================================${NC}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Stop SeaweedFS Docker Containers
echo -e "\n${CYAN}[1/3] Stopping SeaweedFS Docker containers...${NC}"
if command -v docker &> /dev/null; then
  if docker info &> /dev/null; then
    docker compose -f "$ROOT_DIR/seaweedfs-compose.yml" down 2>/dev/null || true
    echo -e "${GREEN}[OK] SeaweedFS containers stopped.${NC}"
  else
    echo -e "${YELLOW}[INFO] Docker engine not running (SeaweedFS already stopped).${NC}"
  fi
else
  echo -e "${YELLOW}[INFO] Docker not installed.${NC}"
fi

# 2. Stop Backend on port 5000
echo -e "\n${CYAN}[2/3] Stopping Backend on port 5000...${NC}"
if command -v lsof &> /dev/null; then
  BACKEND_PIDS=$(lsof -ti:5000 2>/dev/null || true)
  if [ -n "$BACKEND_PIDS" ]; then
    kill -9 $BACKEND_PIDS 2>/dev/null || true
    echo -e "${GREEN}[OK] Backend process killed.${NC}"
  else
    echo -e "${GREEN}[OK] No process running on port 5000.${NC}"
  fi
fi

# 3. Stop Frontend on port 3000
echo -e "\n${CYAN}[3/3] Stopping Frontend on port 3000...${NC}"
if command -v lsof &> /dev/null; then
  FRONTEND_PIDS=$(lsof -ti:3000 2>/dev/null || true)
  if [ -n "$FRONTEND_PIDS" ]; then
    kill -9 $FRONTEND_PIDS 2>/dev/null || true
    echo -e "${GREEN}[OK] Frontend process killed.${NC}"
  else
    echo -e "${GREEN}[OK] No process running on port 3000.${NC}"
  fi
fi

# Additional cleanup for Windows Git Bash / WSL port killing via taskkill if available
if command -v netstat &> /dev/null; then
  for port in 5000 3000; do
    win_pids=$(netstat -ano | grep ":$port " | awk '{print $5}' | sort -u || true)
    for pid in $win_pids; do
      if [ "$pid" != "0" ] && [ -n "$pid" ]; then
        taskkill //F //PID $pid 2>/dev/null || true
      fi
    done
  done
fi

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ✓ All Development Services Stopped!               ${NC}"
echo -e "${GREEN}====================================================${NC}\n"
