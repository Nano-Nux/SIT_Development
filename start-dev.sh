#!/usr/bin/env bash

# ==============================================================================
# SIT University Development Environment Launcher
# Starts: SeaweedFS (Docker), NestJS Backend, and Next.js Frontend
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  🚀 Starting SIT University Development Stack     ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to clean up child processes on exit (Ctrl+C)
cleanup() {
  echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  echo -e "${GREEN}✓ Backend and Frontend stopped.${NC}"
  echo -e "${CYAN}Note: SeaweedFS containers are still running in Docker.${NC}"
  echo -e "${CYAN}To stop SeaweedFS, run: docker compose -f seaweedfs-compose.yml down${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start SeaweedFS Docker Stack
echo -e "\n${CYAN}📦 [1/3] Checking SeaweedFS Docker containers...${NC}"
if command -v docker &> /dev/null; then
  if docker info &> /dev/null; then
    docker compose -f "$ROOT_DIR/seaweedfs-compose.yml" up -d 2>/dev/null || true
    echo -e "${GREEN}✓ SeaweedFS S3 cluster started successfully.${NC}"
  else
    echo -e "${YELLOW}ℹ️  Docker engine is not running. Backend will use local uploads storage.${NC}"
  fi
else
  echo -e "${YELLOW}ℹ️  Docker not found. Backend will use local uploads storage.${NC}"
fi

# 2. Start Backend
echo -e "\n${CYAN}⚙️  [2/3] Starting NestJS Backend (port 5000)...${NC}"
cd "$ROOT_DIR/university_backend"
npm run start:dev &
BACKEND_PID=$!

# 3. Start Frontend
echo -e "\n${CYAN}🌐 [3/3] Starting Next.js Frontend (port 3000)...${NC}"
cd "$ROOT_DIR/university_frontend"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ✨ All Services Started!                          ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "  • Frontend:      ${BLUE}http://localhost:3000${NC}"
echo -e "  • Backend API:   ${BLUE}http://localhost:5000/api${NC}"
echo -e "  • SeaweedFS S3:  ${BLUE}http://localhost:8333${NC}"
echo -e "  • Seaweed Filer: ${BLUE}http://localhost:8888${NC}"
echo -e "  • Prometheus:    ${BLUE}http://localhost:9000${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "${YELLOW}Press [Ctrl+C] to stop frontend and backend.${NC}\n"

# Keep the script running and wait for child processes
wait
