FROM node:20-alpine
WORKDIR /usr/app
COPY Backend/package*.json Backend/tsconfig*.json ./
COPY Backend/src ./src
COPY Shared ./src/Shared

RUN apk add --no-cache \
    sqlite sqlite-libs sqlite-dev \
    python3 py3-pip \
    make g++ \
    && npm install \
    && apk del make g++

RUN npx tsc
RUN mkdir -p /data && chown -R node:node /data
USER node
COPY --chown=node:node Backend/default_avatars/ /usr/app/uploads/avatars/
EXPOSE 8080 3000
CMD ["node", "src/index.js"]