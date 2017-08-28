#!/bin/bash

docker build -t camfun .
docker run --detach \
	--name=camfun \
	--publish-all \
	--restart=always \
	camfun > /dev/null
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' camfun
docker port camfun
