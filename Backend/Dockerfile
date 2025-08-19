FROM node:24-alpine

WORKDIR /usr/app

# RUN apk add sqlite3

COPY Backend/package*.json Backend/tsconfig*.json ./
COPY Backend/src ./src
COPY Shared ./src/Shared

# CHANGE THIS LATER: added: sqlite sqlite-libs sqlite-dev
RUN apk add --no-cache sqlite sqlite-libs sqlite-dev sqlite sqlite-libs sqlite-dev python3 make g++

# Install npm dependencies
RUN npm install fastify-socket.io
RUN npm install

# Compile shared typescript
RUN npx tsc

# Clean up build tools
RUN apk del python3 make g++

EXPOSE 8080 3000

CMD ["node", "src/index.js"]