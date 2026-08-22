# SIT University Development Environment Teardown (PowerShell)
# Stops: SeaweedFS (Docker), NestJS Backend (port 5000), Next.js Frontend (port 3000)

Write-Host "====================================================" -ForegroundColor Blue
Write-Host "  Stopping SIT University Development Stack         " -ForegroundColor Blue
Write-Host "====================================================" -ForegroundColor Blue

$rootDir = $PSScriptRoot
if (-not $rootDir) {
    $rootDir = (Get-Location).Path
}

# 1. Stop SeaweedFS Docker Stack
Write-Host "`n[1/3] Stopping SeaweedFS Docker containers..." -ForegroundColor Cyan
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCmd) {
    & docker info *>$null
    if ($LASTEXITCODE -eq 0) {
        docker compose -f "$rootDir\seaweedfs-compose.yml" down 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] SeaweedFS containers stopped." -ForegroundColor Green
        } else {
            Write-Host "[INFO] SeaweedFS containers were not running." -ForegroundColor Yellow
        }
    } else {
        Write-Host "[INFO] Docker engine not running (SeaweedFS already stopped)." -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] Docker not installed." -ForegroundColor Yellow
}

# 2. Stop Backend (Port 5000) & Frontend (Port 3000) processes
function Stop-PortProcess {
    param ([int]$Port, [string]$ServiceName)
    Write-Host "`nStopping $ServiceName on port $Port..." -ForegroundColor Cyan
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connections) {
            $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($p in $pids) {
                if ($p -and $p -ne 0) {
                    Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                    Write-Host "[OK] Stopped process ID $p for $ServiceName" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "[OK] No process listening on port $Port." -ForegroundColor Green
        }
    } catch {
        Write-Host "[WARN] Could not inspect port $Port." -ForegroundColor Yellow
    }
}

Stop-PortProcess -Port 5000 -ServiceName "NestJS Backend"
Stop-PortProcess -Port 3000 -ServiceName "Next.js Frontend"

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host "  All Development Services Stopped!                 " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
