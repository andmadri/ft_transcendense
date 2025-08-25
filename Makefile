NAME	= transcendence

VOLUME	= "./Database"

all:	up

up:
	rm -rf Server/src
	mkdir -p Database
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

backend:
	docker compose up -d --build --force-recreate backend

update-host-env:
	@HOST_IP=$$(hostname -I | awk '{print $$1}'); \
	if grep -q '^HOST_IP=' .env; then \
		sed -i "s/^HOST_IP=.*/HOST_IP=$$HOST_IP/" .env; \
	else \
		echo "HOST_IP=$$HOST_IP" >> .env; \
	fi
	@HOST_DOMAIN=$$(hostname); \
	if grep -q '^HOST_DOMAIN=' .env; then \
		sed -i "s/^HOST_DOMAIN=.*/HOST_DOMAIN=$$HOST_DOMAIN/" .env; \
	else \
		echo "HOST_DOMAIN=$$HOST_DOMAIN" >> .env; \
	fi

build_volumes:
	mkdir -p $(VOLUME)
	chmod -R 777 $(VOLUME)
	echo "volume directories are set up"

clean_volumes:
	rm -rf $(VOLUME)
	echo "volume directories are removed"

clean: stop
	@if [ "$(docker ps -qa)" ]; then docker stop $(docker ps -qa); fi
	@if [ "$(docker ps -qa)" ]; then docker rm $(docker ps -qa); fi
	@if [ "$(docker images -qa)" ]; then docker rmi -f $(docker images -qa); fi
	@if [ "$(docker volume ls -q)" ]; then docker volume rm $(docker volume ls -q); fi
	@if [ "$(docker network ls -q)" ]; then docker network rm $(docker network ls -q); fi
	rm -rf Server/src
	rm -rf Server/*.json
	@echo "containers, images and network are removed"

re:	clean up

prune: clean clean_volumes
	docker system prune -a --volumes -f

.PHONY: all up down start stop build server backend build_volumes test clean_volumes clean re prune


# TESTER:
# npm install --save-dev @playwright/test
# npx playwright install
# npx playwright test --ui (IN VSC)