# SIT University Development Environment Launcher (PowerShell)
# Starts: SeaweedFS (Docker), NestJS Backend, and Next.js Frontend

Write-Host "====================================================" -ForegroundColor Blue
Write-Host "  Starting SIT University Development Stack         " -ForegroundColor Blue
Write-Host "====================================================" -ForegroundColor Blue

$rootDir = $PSScriptRoot
if (-not $rootDir) {
    $rootDir = (Get-Location).Path
}

# 1. Start SeaweedFS Docker Stack
Write-Host "`n[1/3] Checking SeaweedFS Docker containers..." -ForegroundColor Cyan
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
$dockerDesktopPaths = @(
    "$env:LOCALAPPDATA\Programs\DockerDesktop\Docker Desktop.exe",
    "C:\Program Files\Docker\Docker\Docker Desktop.exe"
)

$dockerDesktopExe = $dockerDesktopPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($dockerCmd) {
    # Check if Docker daemon is running
    & docker info *>$null
    if ($LASTEXITCODE -ne 0 -and $dockerDesktopExe) {
        Write-Host "  -> Docker daemon is not active. Starting Docker Desktop..." -ForegroundColor Yellow
        Start-Process $dockerDesktopExe
        Write-Host "  -> Waiting up to 15s for Docker engine to become ready..." -ForegroundColor Yellow
        $retries = 15
        while ($retries -gt 0) {
            Start-Sleep -Seconds 1
            & docker info *>$null
            if ($LASTEXITCODE -eq 0) { break }
            $retries--
        }
    }

    # Attempt to start SeaweedFS container
    docker compose -f "$rootDir\seaweedfs-compose.yml" up -d 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] SeaweedFS S3 cluster started successfully." -ForegroundColor Green
    } else {
        Write-Host "[INFO] SeaweedFS not started. (Backend will use instant local storage fallback)." -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] Docker not found. Backend will use local uploads storage." -ForegroundColor Yellow
}

# 2. Start Backend & Frontend in separate windows
Write-Host "`n[2/3] Starting NestJS Backend (port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location `"$rootDir\university_backend`"; npm run start:dev"

Write-Host "[3/3] Starting Next.js Frontend (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location `"$rootDir\university_frontend`"; npm run dev"

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host "  All Services Started!                             " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  * Frontend:      http://localhost:3000" -ForegroundColor Blue
Write-Host "  * Backend API:   http://localhost:5000/api" -ForegroundColor Blue
Write-Host "  * SeaweedFS S3:  http://localhost:8333" -ForegroundColor Blue
Write-Host "  * Seaweed Filer: http://localhost:8888" -ForegroundColor Blue
Write-Host "  * Prometheus:    http://localhost:9000" -ForegroundColor Blue
Write-Host "====================================================" -ForegroundColor Green
