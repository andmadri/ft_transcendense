
# FRONTEND -> build stage (Multi stage building)
FROM node:18 AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src/

ENV NODE_ENV=development

# Installs all the dependencies named in the package.json file
RUN npm install

# TS will compile to JS -> works only if defined in package.json
RUN npm run build

# Maak een build-folder met frontend-assets
RUN mkdir -p build \
  && cp -r src/html/*.html build/ \
  && cp -r src/css/*.css build/

# NGINX (only contains the compiled version of node, not the env)
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf
 
RUN chmod +x /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]


# FILES now in:
	# /usr/share/nginx/html/index.html
	# /usr/share/nginx/html/html
	# /usr/share/nginx/html/js/
	# /usr/share/nginx/html/css
