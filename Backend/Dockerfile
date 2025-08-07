FROM node:24-alpine

WORKDIR /usr/app

# RUN apk add sqlite3

COPY package*.json ./
COPY ./src ./src

# CHANGE THIS LATER: added: sqlite sqlite-libs sqlite-dev
RUN apk add --no-cache sqlite sqlite-libs sqlite-dev sqlite sqlite-libs sqlite-dev python3 make g++ && \
    npm install fastify-socket.io && \
	npm install && \
    apk del python3 make g++

EXPOSE 8080 3000

CMD ["node", "src/index.js"]