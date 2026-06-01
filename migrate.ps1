#!/usr/bin/env powershell

# Script de Migração Automática com Docker
# Abre o banco, executa as migrações, verifica e fecha

param(
    [switch]$KeepRunning = $false
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "./logs/migration_$timestamp.log"
$errorFile = "./logs/migration_$timestamp.error.log"

# Criar pasta de logs se não existir
if (-not (Test-Path "./logs")) {
    New-Item -ItemType Directory -Path "./logs" | Out-Null
}

function Log {
    param([string]$message)
    $line = "[$(Get-Date -Format 'HH:mm:ss')] $message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

function LogError {
    param([string]$message)
    $line = "[ERROR $(Get-Date -Format 'HH:mm:ss')] $message"
    Write-Host $line -ForegroundColor Red
    Add-Content -Path $logFile -Value $line
    Add-Content -Path $errorFile -Value $line
}

function LogSuccess {
    param([string]$message)
    $line = "[SUCCESS $(Get-Date -Format 'HH:mm:ss')] $message"
    Write-Host $line -ForegroundColor Green
    Add-Content -Path $logFile -Value $line
}

# ==========================================
# 1. INICIA O BANCO
# ==========================================
Log "Iniciando o banco de dados..."
docker-compose up -d db 2>&1 | Tee-Object -FilePath $logFile -Append

$maxAttempts = 30
$attempt = 0
$connected = $false

while ($attempt -lt $maxAttempts -and -not $connected) {
    $attempt++
    Log "Aguardando banco estar pronto (tentativa $attempt/$maxAttempts)..."
    
    $result = docker-compose exec db pg_isready -U db_user 2>&1
    if ($LASTEXITCODE -eq 0) {
        $connected = $true
        LogSuccess "Banco conectado com sucesso!"
    } else {
        Start-Sleep -Seconds 2
    }
}

if (-not $connected) {
    LogError "Banco não ficou pronto após $maxAttempts tentativas"
    exit 1
}

# ==========================================
# 2. EXECUTA AS MIGRAÇÕES
# ==========================================
Log "Executando migrações TypeORM..."
$env:DB_HOST = 'localhost'
$env:DB_PORT = '5432'

yarn migrate 2>&1 | Tee-Object -FilePath $logFile -Append
$migrationExitCode = $LASTEXITCODE

if ($migrationExitCode -eq 0) {
    LogSuccess "Migrações executadas com sucesso!"
} else {
    LogError "Erro ao executar migrações (código: $migrationExitCode)"
}

# ==========================================
# 3. VERIFICA O ESTADO DO BANCO
# ==========================================
Log "Verificando tabelas criadas..."
$tables = docker-compose exec -T db psql -U db_user -d db_api -c "\dt" 2>&1

if ($tables -match "gallery_item|peca_item") {
    LogSuccess "Tabelas verificadas com sucesso!"
    Add-Content -Path $logFile -Value "Tabelas encontradas:"
    Add-Content -Path $logFile -Value $tables
} else {
    LogError "Tabelas não encontradas no banco"
    Add-Content -Path $logFile -Value $tables
}

# ==========================================
# 4. RELATÓRIO FINAL
# ==========================================
Log "=========================================="
Log "RELATÓRIO DE MIGRAÇÃO"
Log "=========================================="
Log "Timestamp: $timestamp"
Log "Exit Code: $migrationExitCode"
Log "Status: $(if ($migrationExitCode -eq 0) { 'SUCESSO' } else { 'FALHA' })"
Log "Log File: $logFile"
Log "=========================================="

# ==========================================
# 5. FECHA O BANCO (opcional)
# ==========================================
if (-not $KeepRunning) {
    Log "Encerrando banco de dados..."
    docker-compose down 2>&1 | Tee-Object -FilePath $logFile -Append
    LogSuccess "Banco encerrado"
} else {
    Log "Banco permanecerá em execução (use -KeepRunning)"
}

exit $migrationExitCode
