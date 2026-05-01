FROM node:20-alpine

WORKDIR /app

COPY server.js ./server.js
COPY public ./public

ENV WEB_PORT=3000

EXPOSE 3000

CMD ["node", "/app/server.js"]
