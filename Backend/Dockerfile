FROM node:24-alpine

WORKDIR /usr/app

COPY Backend/package*.json Backend/tsconfig*.json ./
COPY Backend/src ./src
COPY Shared ./src/Shared

RUN apk add --no-cache sqlite sqlite-libs sqlite-dev 

# Install npm dependencies
RUN npm install fastify-socket.io
RUN npm install

# Compile shared typescript
RUN npx tsc

RUN mkdir -p /data && chown -R node:node /data

USER node

# copy folders from ./default_iamges to folder uploads/avatars inside the container
COPY --chown=node:node Backend/default_avatars/ /usr/app/uploads/avatars/

EXPOSE 8080 3000

CMD ["node", "src/index.js"]