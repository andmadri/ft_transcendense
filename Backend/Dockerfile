FROM node:24-alpine

WORKDIR /usr/app

# RUN apk add sqlite3

COPY Backend/package*.json Backend/tsconfig*.json ./
COPY Backend/src ./src
COPY Shared ./src/Shared

RUN apk add --no-cache sqlite sqlite-libs sqlite-dev 
# python3 make g++

# Install npm dependencies
RUN npm install fastify-socket.io
RUN npm install

# Compile shared typescript
RUN npx tsc

# Clean up build tools
# RUN apk del python3 make g++

RUN mkdir -p /data && chown -R node:node /data

USER node

# copy folders from ./default_iamges to folder uploads/avatars inside the container
COPY Backend/default_avatars/ /usr/app/uploads/avatars/

EXPOSE 8080 3000

CMD ["node", "src/index.js"]