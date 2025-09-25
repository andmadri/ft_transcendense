NAME	= transcendence

# Generate random base64 strings for secrets
rand_b64_32 = $(shell openssl rand -base64 32 | tr -d '\n')
rand_b64_64 = $(shell openssl rand -base64 64 | tr -d '\n')


all:	up

up:
	rm -rf Server/src
	cp -r Frontend/* Server/
	docker compose -f docker-compose.yml up

down:
	docker compose -f docker-compose.yml down

start:
	@echo "=== Start Docker ==="
	docker compose -f docker-compose.yml start

stop:
	@echo "=== Stop Docker ==="
	docker compose -f docker-compose.yml stop

build:
	@echo "=== Building Docker Image ==="
	docker compose -f docker-compose.yml build

server: Frontend/*
	rm -rf Server/src
	rm -rf Server/*.json
	cp -r Frontend/* Server/
	docker compose up -d --build --force-recreate server

server-build-fast:
	@echo "=== Building server image (cache) and restarting server only ==="
	docker compose -f docker-compose.yml build server
	docker compose -f docker-compose.yml up -d --no-deps server

backend:
# 	docker compose up -d --build --force-recreate backend
	docker compose -f docker-compose.yml up -d --build --no-deps backend

update-host-env:
	@HOST_IP=$$(hostname -I | awk '{print $$1}'); \
	if grep -q '^HOST_IP=' .env; then \
		sed -i "s/^HOST_IP=.*/HOST_IP=$$HOST_IP/" .env; \
	else \
		echo "HOST_IP=$$HOST_IP" >> .env; \
	fi
	@HOST_DOMAIN="$$(hostname):8443"; \
	if grep -q '^HOST_DOMAIN=' .env; then \
		sed -i "s/^HOST_DOMAIN=.*/HOST_DOMAIN=$$HOST_DOMAIN/" .env; \
	else \
		echo "HOST_DOMAIN=$$HOST_DOMAIN" >> .env; \
	fi

# Target to refresh secrets in .env file
refresh-secrets:
	@echo "Refreshing secrets..."
	@sed -i '' \
		-e 's|^JWT_SECRET=.*|JWT_SECRET=$(rand_b64_32)|' \
		-e 's|^COOKIE_SECRET=.*|COOKIE_SECRET=$(rand_b64_32)|' \
		-e 's|^PENDING_TWOFA_SECRET=.*|PENDING_TWOFA_SECRET=$(rand_b64_32)|' \
		-e 's|^ENC_2FA_SECRET=.*|ENC_2FA_SECRET=$(rand_b64_32)|' \
		.env
	@echo "✅ Secrets refreshed in .env"

clean_volumes:
	docker compose down -v

clean: stop
	@if [ "$(docker ps -qa)" ]; then docker stop $(docker ps -qa); fi
	@if [ "$(docker ps -qa)" ]; then docker rm $(docker ps -qa); fi
	@if [ "$(docker images -qa)" ]; then docker rmi -f $(docker images -qa); fi
	@if [ "$(docker network ls -q)" ]; then docker network rm $(docker network ls -q); fi
	rm -rf Server/src
	rm -rf Server/*.json
	@echo "containers, images and network are removed"

# re:	clean up
re:	backend server-build-fast up

prune: clean clean_volumes
	docker system prune -a --volumes -f

.PHONY: all up down start stop build server backend test clean_volumes clean re prune


# TESTER:
# npx install --save-dev @playwright/test
# npx playwright install
# npx playwright test --ui (IN VSC)