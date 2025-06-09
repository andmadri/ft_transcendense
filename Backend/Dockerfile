FROM node:24-alpine

WORKDIR /usr/app

COPY package*.json ./
COPY ./src/index.js ./

RUN npm install

EXPOSE 8080 3000

CMD ["node", "index.js"]