FROM node:alpine

ARG timezone
ENV TIMEZONE=${timezone:-"America/Sao_Paulo"} \
    APP_ENV=prod \
    SCAN_CACHEABLE=(true)

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

# Instalar o Yarn no container para poder executar os comandos do projeto
RUN npm install -g yarn

# Instalar todas as dependências, incluindo as de desenvolvimento
RUN yarn install

COPY . /usr/src/app

# Instalar nodemon globalmente
RUN yarn global add nodemon

# Compilar o código TypeScript
RUN yarn build

# Remover as dependências de desenvolvimento para otimizar o tamanho da imagem
RUN yarn install --production --frozen-lockfile

EXPOSE 3000
CMD ["yarn", "build-and-start"]
