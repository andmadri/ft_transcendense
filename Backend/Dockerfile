FROM node:24-alpine

WORKDIR /usr/app

# RUN apk add sqlite3

COPY package*.json ./
COPY ./src ./src

RUN npm install


EXPOSE 8080 3000

CMD ["node", "src/index.js"]