FROM node:20-alpine

WORKDIR /app

# Cachear dependencias
COPY package*.json ./
RUN npm install --omit=dev

#Copiar server.js
COPY . .

# Exponer el puerto configurado
EXPOSE 5000

CMD ["node", "server.js"]