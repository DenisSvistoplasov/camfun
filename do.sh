#!/bin/bash

docker build -t camfun2 .
docker run --detach \
	--name=camfun2 \
	--publish=32769:80 \
	--restart=always \
	camfun2 > /dev/null
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' camfun2
docker port camfun2
