#!/bin/bash

docker build -t websocket .
docker run --detach \
	--name=websocket \
	--publish-all \
	--restart=always \
	websocket > /dev/null
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' websocket
docker port websocket
