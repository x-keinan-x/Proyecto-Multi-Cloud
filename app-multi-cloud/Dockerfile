#Capa base
FROM node:20-alpine

WORKDIR /app

#Copiar manifiestos para cachear dependencias
COPY package*.json ./
RUN npm install

# Copiar el proyecto Next.js
COPY . .

# Construir el proyecto
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]