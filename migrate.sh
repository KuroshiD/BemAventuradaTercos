#!/bin/bash

# Script de Migração Automática com Docker
# Abre o banco, executa as migrações, verifica e fecha

set -e

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
logFile="./logs/migration_${timestamp}.log"
errorFile="./logs/migration_${timestamp}.error.log"

# Criar pasta de logs se não existir
mkdir -p ./logs

log() {
    local message="$1"
    local line="[$(date +'%H:%M:%S')] $message"
    echo "$line"
    echo "$line" >> "$logFile"
}

log_error() {
    local message="$1"
    local line="[ERROR $(date +'%H:%M:%S')] $message"
    echo "$line" >&2
    echo "$line" >> "$logFile"
    echo "$line" >> "$errorFile"
}

log_success() {
    local message="$1"
    local line="[SUCCESS $(date +'%H:%M:%S')] $message"
    echo -e "\033[32m$line\033[0m"
    echo "$line" >> "$logFile"
}

# ==========================================
# 1. INICIA O BANCO
# ==========================================
log "Iniciando o banco de dados..."
docker-compose up -d db >> "$logFile" 2>&1

maxAttempts=30
attempt=0
connected=false

while [ $attempt -lt $maxAttempts ] && [ "$connected" = false ]; do
    attempt=$((attempt + 1))
    log "Aguardando banco estar pronto (tentativa $attempt/$maxAttempts)..."
    
    if docker-compose exec db pg_isready -U db_user >> "$logFile" 2>&1; then
        connected=true
        log_success "Banco conectado com sucesso!"
    else
        sleep 2
    fi
done

if [ "$connected" = false ]; then
    log_error "Banco não ficou pronto após $maxAttempts tentativas"
    exit 1
fi

# ==========================================
# 2. EXECUTA AS MIGRAÇÕES
# ==========================================
log "Executando migrações TypeORM..."
export DB_HOST='localhost'
export DB_PORT='5432'

if yarn migrate >> "$logFile" 2>&1; then
    log_success "Migrações executadas com sucesso!"
    migrationExitCode=0
else
    log_error "Erro ao executar migrações"
    migrationExitCode=1
fi

# ==========================================
# 3. VERIFICA O ESTADO DO BANCO
# ==========================================
log "Verificando tabelas criadas..."
tables=$(docker-compose exec -T db psql -U db_user -d db_api -c "\\dt" 2>&1 || true)

if echo "$tables" | grep -q "gallery_item\|peca_item"; then
    log_success "Tabelas verificadas com sucesso!"
    echo "Tabelas encontradas:" >> "$logFile"
    echo "$tables" >> "$logFile"
else
    log_error "Tabelas não encontradas no banco"
    echo "$tables" >> "$logFile"
fi

# ==========================================
# 4. RELATÓRIO FINAL
# ==========================================
log "=========================================="
log "RELATÓRIO DE MIGRAÇÃO"
log "=========================================="
log "Timestamp: $timestamp"
log "Exit Code: $migrationExitCode"
if [ $migrationExitCode -eq 0 ]; then
    log "Status: SUCESSO"
else
    log "Status: FALHA"
fi
log "Log File: $logFile"
log "=========================================="

# ==========================================
# 5. FECHA O BANCO (ou mantém rodando)
# ==========================================
if [ "$1" != "--keep-running" ]; then
    log "Encerrando banco de dados..."
    docker-compose down >> "$logFile" 2>&1
    log_success "Banco encerrado"
else
    log "Banco permanecerá em execução (use --keep-running)"
fi

exit $migrationExitCode
