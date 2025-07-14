NAME	= transcendence

VOLUME	= "./Database"

all:	up

up:		
	mkdir -p Database
	cp -r Frontend/* Server/
	docker compose -f docker-compose.yml up

down:
	docker compose -f docker-compose.yml down

start:
	docker compose -f docker-compose.yml start

stop:
	docker compose -f docker-compose.yml stop

build:
	docker compose -f docker-compose.yml build

server:
	rm -rf Server/src
	rm -rf Server/*.json
	cp -r Frontend/* Server/
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
	@echo "containers, images and network are removed"

re:	clean up

prune: clean clean_volumes
	docker system prune -a --volumes -f