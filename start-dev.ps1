[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $Root 'backend'
$FrontendDir = Join-Path $Root 'frontend'
$AiDir = Join-Path $Root 'ai-module'

function Write-Info($text) { Write-Host "[INFO]  $text" -ForegroundColor White }
function Write-Success($text) { Write-Host "[OK]    $text" -ForegroundColor Green }
function Write-WarningLine($text) { Write-Host "[WARN]  $text" -ForegroundColor Yellow }
function Write-ErrorLine($text) { Write-Host "[ERROR] $text" -ForegroundColor Red }

function Test-Command($command) {
    try {
        $null = Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Ensure-EnvFile($serviceName, $serviceDir) {
    $envExample = Join-Path $serviceDir '.env.example'
    $envFile = Join-Path $serviceDir '.env'
    if (-not (Test-Path $envFile)) {
        if (Test-Path $envExample) {
            Copy-Item $envExample $envFile
            Write-Success "$serviceName .env created from .env.example"
        } else {
            Write-WarningLine "$serviceName .env.example not found; create .env manually in $serviceDir"
        }
    } else {
        Write-Info "$serviceName .env already exists"
    }
}

function Ensure-NodeDependencies($serviceName, $serviceDir) {
    $nodeModules = Join-Path $serviceDir 'node_modules'
    if (-not (Test-Path $nodeModules)) {
        Write-Info "Installing npm dependencies for $serviceName..."
        Push-Location $serviceDir
        npm install
        Pop-Location
        Write-Success "npm install complete for $serviceName"
    } else {
        Write-Info "npm dependencies already installed for $serviceName"
    }
}

function Ensure-PythonDependencies($serviceDir) {
    $venvDir = Join-Path $serviceDir 'venv'
    $pythonExe = Join-Path $venvDir 'Scripts\python.exe'

    if (-not (Test-Path $pythonExe)) {
        Write-Info "Creating Python virtual environment for AI module..."
        Push-Location $serviceDir
        python -m venv venv
        Pop-Location
        Write-Success "Virtual environment created"
    } else {
        Write-Info "Python virtual environment already exists"
    }

    if (-not (Test-Path $pythonExe)) {
        Write-ErrorLine "Python executable not found in AI module virtual environment"
        throw "Virtual environment setup failed"
    }

    Push-Location $serviceDir
    & $pythonExe -m pip install --upgrade pip | Out-Null
    & $pythonExe -m pip install -r requirements.txt
    Pop-Location
    Write-Success "Python dependencies installed for AI module"
}

function Start-ServiceWindow($title, $command, $workingDir) {
    $escapedCommand = "`$host.UI.RawUI.WindowTitle = '$title'; Set-Location -LiteralPath '$workingDir'; $command"
    Start-Process powershell -ArgumentList @('-NoExit', '-Command', $escapedCommand)
    Write-Success "Started $title window"
}

function Wait-ForPort($port, $timeoutSeconds = 60) {
    $deadline = (Get-Date).AddSeconds($timeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $connection = Test-NetConnection -ComputerName '127.0.0.1' -Port $port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                Write-Success "Port $port is listening"
                return $true
            }
        } catch {
            # ignore
        }
        Start-Sleep -Seconds 2
    }
    Write-WarningLine "Timeout waiting for port $port"
    return $false
}

function Start-Browser($url) {
    try {
        Start-Process $url
        Write-Success "Opened browser at $url"
    } catch {
        Write-WarningLine "Failed to open browser automatically. Please open $url manually."
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "One-click Windows dev startup for AI Resume Screening System" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$missing = @()
if (-not (Test-Command 'node')) { $missing += 'Node.js'; Write-ErrorLine 'Node.js is not available.' }
if (-not (Test-Command 'npm')) { $missing += 'npm'; Write-ErrorLine 'npm is not available.' }
if (-not (Test-Command 'python')) { $missing += 'Python'; Write-ErrorLine 'Python is not available.' }
if ($missing.Count -gt 0) {
    Write-ErrorLine 'Required tools are missing. Install the missing tools and re-run this script.'
    Write-Host "Missing: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

Ensure-EnvFile 'Backend' $BackendDir
Ensure-EnvFile 'Frontend' $FrontendDir
Ensure-EnvFile 'AI Module' $AiDir

Ensure-NodeDependencies 'Backend' $BackendDir
Ensure-NodeDependencies 'Frontend' $FrontendDir
Ensure-PythonDependencies $AiDir

Write-Host "`nStarting services..." -ForegroundColor Cyan
Start-ServiceWindow 'AI Module' 'venv\Scripts\python.exe app.py' $AiDir
Start-ServiceWindow 'Backend' 'npm run dev' $BackendDir
Start-ServiceWindow 'Frontend' 'npm start' $FrontendDir

Write-Host "`nWaiting for services to become available..." -ForegroundColor Cyan
$backendReady = Wait-ForPort 5000 90
$aiReady = Wait-ForPort 5001 90
$frontendReady = Wait-ForPort 3000 90

if ($backendReady -and $aiReady -and $frontendReady) {
    Write-Success 'All services appear to be listening on expected ports.'
    Start-Browser 'http://localhost:3000'
} else {
    Write-WarningLine 'One or more services did not become available within the timeout period.'
    if (-not $backendReady) { Write-WarningLine 'Backend may not be running on port 5000.' }
    if (-not $aiReady) { Write-WarningLine 'AI module may not be running on port 5001.' }
    if (-not $frontendReady) { Write-WarningLine 'Frontend may not be running on port 3000.' }
}

Write-Host "`nStartup sequence complete. Check opened windows for service logs." -ForegroundColor Cyan
