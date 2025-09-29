# STAGE ONE: FRONTEND -> build stage (Multi stage building)
FROM node:18 AS frontend
WORKDIR /app

# copies all the frontend files and jsons to the docker
COPY Server/package.json Server/tsconfig.json ./
COPY Server/src/ ./src/
COPY Shared ./src/Shared
COPY Server/build.js ./

ENV NODE_ENV=development

# Installs all the dependencies named in the package.json file
RUN npm install

# TS will compile to JS -> works only if defined in package.json
RUN npm run build

# folder with all the stuff for the frontend
RUN mkdir -p build \
  && cp -r src/html build/ \
  && cp -r src/css build/ \
  && cp -r src/images build/

# STAGE TWO: NGINX (only contains the compiled version of node, not the env)
FROM nginx:alpine

# Copies from first stage the whole folder to the nginx docker
COPY --from=frontend /app/build /usr/share/nginx/html/

COPY Server/conf/nginx.conf /etc/nginx/nginx.conf

COPY Server/tools /etc/nginx/ssl
 
RUN chmod 600 /etc/nginx/ssl

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]