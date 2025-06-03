FROM node:24-alpine

WORKDIR /usr/app

COPY package*.json ./

COPY ./src/ ./

RUN npm install

RUN npm install fastify

RUN npm install sqlite3

EXPOSE 3000

CMD ["node", "index.js"]