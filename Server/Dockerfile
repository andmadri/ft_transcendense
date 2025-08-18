# STAGE ONE: FRONTEND -> build stage (Multi stage building)
FROM node:18 AS frontend
WORKDIR /app

# copies all the frontend files and jsons to the docker
COPY package.json tsconfig.json ./
COPY src/ ./src/

ENV NODE_ENV=development

# Installs all the dependencies named in the package.json file
RUN npm install

# TS will compile to JS -> works only if defined in package.json
RUN npm run build
# WHERE will this be stored?

# folder with all the stuff for the frontend
RUN mkdir -p build \
  && cp -r src/html build/ \
  && cp -r src/css build/ \
  && cp -r src/images build/


# STAGE TWO: NGINX (only contains the compiled version of node, not the env)
FROM nginx:alpine

# Install curl + download ngrok manually
RUN apk add --no-cache curl tar \
  && curl -L https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz -o ngrok.tgz \
  && tar -xvzf ngrok.tgz -C /usr/local/bin \
  && chmod +x /usr/local/bin/ngrok \
  && rm ngrok.tgz


# Copies from first stage the whole folder to the nginx docker
COPY --from=frontend /app/build /usr/share/nginx/html/

COPY conf/nginx.conf /etc/nginx/nginx.conf

COPY tools /etc/nginx/ssl

RUN chmod +x /etc/nginx/nginx.conf && \
	chmod 600 /etc/nginx/ssl

EXPOSE 8080 443

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
# CMD ["nginx", "-g", "daemon off;"]


# FILES now in:
	# /usr/share/nginx/html/index.html
	# /usr/share/nginx/html/html/*
	# /usr/share/nginx/html/css/*
	# /usr/share/nginx/html/js/*