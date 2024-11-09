# Use uma imagem base do Node.js
FROM node:20.11

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Instale as dependências do npm
COPY package*.json ./
RUN npm install

# Exponha a porta em que a aplicação irá ser executada
EXPOSE 3004

# Comando padrão para executar a aplicação
CMD ["npm", "run", "dev"]