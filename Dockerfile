FROM node:18-alpine AS app
WORKDIR /app


COPY package*.json ./


RUN npm install --production

COPY . .

EXPOSE 8080


CMD ["node", "app.js"]
