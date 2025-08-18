#!/bin/sh
set -e

ngrok config add-authtoken "$NGROK_AUTHTOKEN"

# make sure shared dir exists and is writable
mkdir -p /shared/ngrok
chmod 0777 /shared/ngrok

# start ngrok in background (tunnel the nginx https)
ngrok http https://localhost:443 --log=stdout &

# wait for ngrok admin API and write public URL to shared file
NGROK_ADMIN_URL="http://127.0.0.1:4040/api/tunnels"
OUTFILE="/shared/ngrok/ngrok_url"

max_attempts=30
attempt=1
sleep_interval=1

while [ $attempt -le $max_attempts ]; do
  echo "Waiting for ngrok admin API (attempt $attempt)..."
  if curl -s --fail "$NGROK_ADMIN_URL" >/tmp/ngrok_admin.json 2>/dev/null; then
    # extract public_url using sed (BusyBox compatible)
    PUB=$(sed -n 's/.*"public_url":"\([^"]*\)".*/\1/p' /tmp/ngrok_admin.json | head -n 1)
    if [ -n "$PUB" ]; then
      echo "$PUB" > "$OUTFILE"
      chmod 0666 "$OUTFILE"
      echo "Ngrok public URL: $PUB saved to $OUTFILE"
      break
    fi
  fi
  attempt=$((attempt + 1))
  sleep $sleep_interval
done

if [ ! -f "$OUTFILE" ]; then
  echo "Warning: ngrok URL file not created after $max_attempts attempts"
fi

# start nginx (foreground)
nginx -g "daemon off;"