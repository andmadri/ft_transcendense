#!/bin/sh

# Add your Ngrok authtoken
ngrok config add-authtoken "$NGROK_AUTHTOKEN"

# Start Ngrok (tunnel HTTPS to local port 443)
ngrok http https://localhost:443 --log stdout &

# Start NGINX
nginx -g "daemon off;"