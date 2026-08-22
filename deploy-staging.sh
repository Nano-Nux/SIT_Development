#!/bin/sh

# ==============================================================================
# SIT University - Alpine NAT VPS Staging Deployment Script (No Nginx)
# Target: Alpine Linux 3.23.4 (NAT VPS)
# IP: 85.155.184.191
# ==============================================================================

set -e

# Port & IP Configuration (Accepts CLI arguments or defaults)
NAT_PUBLIC_IP="${1:-149.56.240.225}"
FRONTEND_PORT="${2:-3965}"
BACKEND_PORT="${3:-4118}"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/university_backend"
FRONTEND_DIR="$ROOT_DIR/university_frontend"
PID_FILE="$ROOT_DIR/.staging_pids"

# Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  🚀 Deploying SIT University Staging (Direct Ports) ${NC}"
echo -e "${BLUE}====================================================${NC}"
echo -e "Public IP:     ${GREEN}${NAT_PUBLIC_IP}${NC}"
echo -e "Frontend Port: ${GREEN}${FRONTEND_PORT}${NC}"
echo -e "Backend Port:  ${GREEN}${BACKEND_PORT}${NC}"
echo -e "Directory:     ${CYAN}${ROOT_DIR}${NC}\n"

# ------------------------------------------------------------------------------
# 1. System Packages (Node.js, npm, git, docker)
# ------------------------------------------------------------------------------
echo -e "${CYAN}📦 [1/5] Checking Alpine packages (nodejs, npm, docker)...${NC}"
MISSING_PKGS=""
for pkg in nodejs npm git curl; do
  if ! command -v "$pkg" >/dev/null 2>&1; then
    MISSING_PKGS="$MISSING_PKGS $pkg"
  fi
done

if [ -n "$MISSING_PKGS" ]; then
  echo -e "${YELLOW}Installing missing packages:${MISSING_PKGS}...${NC}"
  apk update
  apk add $MISSING_PKGS
fi

# Start Docker daemon if available
if command -v rc-service >/dev/null 2>&1 && [ -f /etc/init.d/docker ]; then
  rc-service docker start 2>/dev/null || true
fi

# ------------------------------------------------------------------------------
# 2. SeaweedFS Storage Cluster (Docker)
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}🗄️  [2/5] Starting SeaweedFS Docker cluster...${NC}"
COMPOSE_FILE="$ROOT_DIR/seaweedfs-staging.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
  COMPOSE_FILE="$ROOT_DIR/seaweedfs-compose.yml"
fi

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  docker compose -f "$COMPOSE_FILE" up -d
  echo -e "${GREEN}✓ SeaweedFS S3 storage containers running.${NC}"
else
  echo -e "${YELLOW}ℹ️  Docker not active. Backend will use local disk uploads folder.${NC}"
fi

# ------------------------------------------------------------------------------
# 3. Backend Build & Preparation (Port 4118)
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}⚙️  [3/5] Building NestJS Backend (Port ${BACKEND_PORT})...${NC}"
cd "$BACKEND_DIR"

if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating backend .env from .env.example...${NC}"
  cp .env.example .env
fi

# Set backend PORT and S3 public URL
sed -i '/^PORT=/d' .env 2>/dev/null || true
echo "PORT=${BACKEND_PORT}" >> .env

sed -i '/^S3_PUBLIC_URL=/d' .env 2>/dev/null || true
echo "S3_PUBLIC_URL=http://${NAT_PUBLIC_IP}:${BACKEND_PORT}/uploads" >> .env

npm install --production=false
npx prisma generate
npm run build
echo -e "${GREEN}✓ Backend build complete.${NC}"

# ------------------------------------------------------------------------------
# 4. Frontend Build (Port 3965, Standalone Mode)
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}🌐 [4/5] Building Next.js Frontend (Port ${FRONTEND_PORT})...${NC}"
cd "$FRONTEND_DIR"

# Point frontend API client to public backend URL
cat <<EOF > .env.production
NEXT_PUBLIC_API_URL=http://${NAT_PUBLIC_IP}:${BACKEND_PORT}/api
EOF

npm install
NODE_OPTIONS="--max-old-space-size=512" npm run build

# Copy static assets for standalone server
mkdir -p .next/standalone/public .next/standalone/.next .next/standalone/university_frontend/public .next/standalone/university_frontend/.next
cp -r public/* .next/standalone/public/ 2>/dev/null || true
cp -r public/* .next/standalone/university_frontend/public/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
cp -r .next/static .next/standalone/university_frontend/.next/ 2>/dev/null || true
echo -e "${GREEN}✓ Frontend standalone build complete.${NC}"

# ------------------------------------------------------------------------------
# 5. Start Backend & Frontend Services
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}🚀 [5/5] Launching Node.js processes directly on NAT ports...${NC}"

# Stop existing processes if any
if [ -f "$PID_FILE" ]; then
  "$ROOT_DIR/stop-staging.sh" 2>/dev/null || true
fi

# Clean lingering processes on target ports
fuser -k ${BACKEND_PORT}/tcp 2>/dev/null || true
fuser -k ${FRONTEND_PORT}/tcp 2>/dev/null || true

# Start Backend on Port 4118
cd "$BACKEND_DIR"
BACKEND_ENTRY="dist/main.js"
if [ ! -f "$BACKEND_ENTRY" ]; then
  BACKEND_ENTRY="dist/src/main.js"
fi

PORT=${BACKEND_PORT} NODE_OPTIONS="--max-old-space-size=128" nohup node "$BACKEND_ENTRY" > "$ROOT_DIR/backend_staging.log" 2>&1 &
BACKEND_PID=$!

# Start Frontend on Port 3965
cd "$FRONTEND_DIR"
FRONTEND_ENTRY=".next/standalone/server.js"
if [ ! -f "$FRONTEND_ENTRY" ]; then
  FRONTEND_ENTRY=".next/standalone/university_frontend/server.js"
fi

if [ -f "$FRONTEND_ENTRY" ]; then
  PORT=${FRONTEND_PORT} NODE_OPTIONS="--max-old-space-size=128" nohup node "$FRONTEND_ENTRY" > "$ROOT_DIR/frontend_staging.log" 2>&1 &
else
  PORT=${FRONTEND_PORT} NODE_OPTIONS="--max-old-space-size=128" nohup npx next start -p ${FRONTEND_PORT} > "$ROOT_DIR/frontend_staging.log" 2>&1 &
fi
FRONTEND_PID=$!

# Save PIDs
echo "BACKEND_PID=$BACKEND_PID" > "$PID_FILE"
echo "FRONTEND_PID=$FRONTEND_PID" >> "$PID_FILE"

sleep 3

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  🎉 SIT University Staging Deployment Succeeded!   ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "  • Frontend URL:     ${BLUE}http://${NAT_PUBLIC_IP}:${FRONTEND_PORT}${NC}"
echo -e "  • Backend API URL:  ${BLUE}http://${NAT_PUBLIC_IP}:${BACKEND_PORT}/api${NC}"
echo -e "  • Backend Log:      ${CYAN}${ROOT_DIR}/backend_staging.log${NC}"
echo -e "  • Frontend Log:     ${CYAN}${ROOT_DIR}/frontend_staging.log${NC}"
echo -e "  • Stop Service:     ${YELLOW}./stop-staging.sh${NC}"
echo -e "${GREEN}====================================================${NC}\n"
