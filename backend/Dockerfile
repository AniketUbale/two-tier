FROM node:20-alpine

WORKDIR /app

COPY . .

COPY package*.json .

RUN npm install

EXPOSE 3001

CMD ["node","./backend/server.js"]
