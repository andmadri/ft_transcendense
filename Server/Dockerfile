
# FRONTEND
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# NGINX
FROM nginx:alpine

# COPY build/* /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY default.conf /etc/nginx/conf.d/default.conf

# RUN chmod +x /etc/nginx/nginx.conf

