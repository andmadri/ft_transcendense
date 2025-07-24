NAME	= transcendence

VOLUME	= "./Database"

all:	up

up:		
	rm -rf Server/src
	rm -rf Server/aiModel
	mkdir -p Database
	cp -r Frontend/* Server/
	cp -r aiTraining/aiModel Server/
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
	rm -rf Server/aiModel
	cp -r Frontend/* Server/
	cp -r aiTraining/aiModel Server/
	docker compose up -d --build --force-recreate server

backend:
	docker compose up -d --build --force-recreate backend

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
	rm -rf Server/aiModel
	@echo "containers, images and network are removed"

re:	clean up

prune: clean clean_volumes
	docker system prune -a --volumes -f

.PHONY: all up down start stop build server backend build_volumes clean_volumes clean re prune