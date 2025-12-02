# ft_transcendence

Requirements:
- docker desktop (https://www.docker.com/products/docker-desktop/)
- .env (see example)
- .env file
    Copy .env.example → .env and fill in the required secrets.

How to run
1. Start all in bash: make 
2. open the app: https://localhost:8443
3. play!
4. Play against players on the same local network

Project Structure
Frontend -> Node.js
Backend -> Typescript
Proxy server -> nginx
docker-compose.yml -> defines all services

Throubleshooting
- If Docker says command not found, install Docker Desktop
- If HTTPS doesn't load, make sure ports 8443 is free