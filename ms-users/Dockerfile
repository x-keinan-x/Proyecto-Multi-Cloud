FROM node:20-alpine

WORKDIR /app

# Cachear dependencias de Node
COPY package*.json ./
RUN npm install --omit=dev

# Copiar server.js
COPY . .

# Exponer el puerto configurado
EXPOSE 4000

CMD ["node", "server.js"]