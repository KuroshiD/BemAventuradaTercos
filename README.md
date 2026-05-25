# base_api

Este repositório contém a API do projeto — uma aplicação Node.js + TypeScript com uma interface estática em `src/front`.

## Sumário

- **Visão geral**: Como executar o projeto localmente e via Docker
- **Pré-requisitos**: ferramentas necessárias
- **Execução local**: passo a passo (recomendado via WSL/Git Bash no Windows)
- **Execução via Docker**: usar `docker` / `docker-compose`
- **Variáveis de ambiente**: `.env` de exemplo
- **Comandos úteis**: build, start, observações para Windows

---

## 1. Visão geral

A aplicação é escrita em TypeScript e, quando compilada, gera `dist/` contendo o servidor (`dist/server.js`) e os assets estáticos copiados para `dist/front`.

O repositório já inclui um `Dockerfile` e um `docker-compose.yml` para execução em contêineres (recomendado para ambientes Windows sem WSL). Em ambiente local a forma mais simples é usar o Yarn (os scripts do projeto usam `yarn`).

## 2. Pré-requisitos

- Node.js (recomenda-se v18+)
- Yarn (opcional para execução local; o Dockerfile instala Yarn dentro do container)
- TypeScript (está como devDependency)
- Git (para clonar)
- Para execução com Docker: Docker e Docker Compose instalados
- No Windows: usar WSL2 ou Git Bash/PowerShell com cuidado — os scripts npm usam `rm`/`cp` (comandos Unix). Para evitar problemas no PowerShell, prefira WSL ou Docker.

## 3. Preparar o ambiente local (via Yarn) — recomendação

1. Clone o repositório e entre no diretório:

```bash
git clone <repo-url> && cd base_api
```

2. Instale o Yarn (se ainda não tiver):

```bash
npm install -g yarn
# ou, com Corepack (Node 16+):
corepack enable
```

3. Instale dependências:

```bash
yarn install
```

4. Build da aplicação (gera `dist/` e copia os assets estáticos):

> Observação: o script `build` usa `rm -rf` e `cp -rf`, que são comandos Unix. Em Windows use WSL/Git Bash ou rode os comandos equivalentes do PowerShell.

```bash
yarn build
# ou, para compilar e iniciar em sequência:
yarn build-and-start
```

5. Rodar a aplicação (após build):

```bash
yarn start
# por padrão o server loga a URL com base nas variáveis de ambiente (porta padrão 3000)
```

6. Acesse a aplicação no navegador em:

- se o `NGINX_PORT` for `80`: `http://localhost`
- caso contrário (ex.: porta 3000): `http://localhost:3000`

## 4. Execução em desenvolvimento (sem build) — alternativa com `ts-node`/`nodemon`

Se quiser rodar diretamente o TypeScript para desenvolvimento sem passos de build:

```bash
# Usando ts-node (instalado localmente como devDependency):
npx ts-node src/server.ts

# Ou com nodemon (auto-reload):
npx nodemon --watch src -e ts --exec "npx ts-node src/server.ts"
```

Essas alternativas são úteis para desenvolvimento rápido. Se tiver problemas no Windows, use WSL/Git Bash.

## 5. Execução com Docker (recomendado no Windows)

O projeto inclui `Dockerfile` e `docker-compose.yml`. O `Dockerfile` instala Yarn no container, instala dependências, compila e roda a aplicação.

1. Construir a imagem Docker (caso queira testar apenas uma imagem):

```bash
docker build -t base_api:latest .
```

2. Rodar com Docker diretamente:

```bash
docker run -e TIMEZONE=America/Sao_Paulo -p 3000:3000 base_api:latest
```

3. Rodar com Docker Compose (recomendado — orquestra `api1`, `api2`, `nginx` e `db`):

```bash
docker compose up --build
# ou (compatibilidade): docker-compose up --build
```

Observações importantes para `docker-compose.yml`:

- O serviço `db` (Postgres) usa as variáveis de ambiente `DB`, `DB_USER` e `DB_PASS`. Defina-as em um arquivo `.env` (veja seção abaixo) ou exporte-as antes.
- Os serviços `api1` e `api2` expõem internamente a porta `3001` no arquivo, mas o Nginx no compose expõe a porta definida por `NGINX_PORT` (padrão 80). Ajuste conforme necessário.

## 6. Variáveis de ambiente e `.env` de exemplo

Crie um arquivo `.env` na raiz para configurar o banco e portas, por exemplo:

```env
# Porta do servidor Node (opcional)
PORT=3000

# Porta que o Nginx irá expor (no docker-compose)
NGINX_PORT=80

# Configuração do Postgres usada pelo docker-compose
DB=db_api
DB_USER=db_user
DB_PASS=db_pass
```

O projeto lê as variáveis via `dotenv` (veja `src/env.ts`). Se não definidas, há valores padrão.

## 7. Problemas comuns e soluções

- Erro ao rodar `yarn build` no Windows (comando `rm`/`cp`): use WSL2, Git Bash, ou substitua manualmente os passos:

  - Remover `dist/` no PowerShell: `Remove-Item -Recurse -Force dist`
  - Compilar: `npx tsc`
  - Copiar assets: `xcopy /E /I src\front dist\front`

- Portas já em uso: verificar com `netstat -ano | findstr :3000` no Windows ou `ss -tulpn | grep 3000` no Linux.

- Se usar Docker, rode `docker compose down -v` para limpar volumes e reiniciar os serviços.

## 8. Comandos úteis resumidos

- Instalar dependências: `yarn install`
- Build: `yarn build`
- Start (produção): `yarn start`
- Build + start: `yarn build-and-start`
- Dev (ts-node): `npx ts-node src/server.ts`
- Docker-compose: `docker compose up --build`

## 9. Arquivos relevantes

- [src/server.ts](src/server.ts#L1) — inicialização do servidor
- [src/env.ts](src/env.ts#L1) — variáveis de ambiente carregadas via `dotenv`
- [Dockerfile](Dockerfile#L1) — instruções de imagem
- [docker-compose.yml](docker-compose.yml#L1) — orquestração

---

Se quiser, eu posso:

- adicionar um `.env.example` no repositório com as variáveis mostradas acima;
- ajustar os scripts em `package.json` para serem cross-platform (Windows + Unix);
- criar um script `dev` com `nodemon` para facilitar desenvolvimento.

Arquivo criado: [README.md](README.md)
