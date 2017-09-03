#!/bin/bash

docker save -o websocket.tar websocket
gzip -c websocket.tar > websocket.tar.gz
rm websocket.tar
scp websocket.tar.gz asus:~/
ssh asus "docker load -i ~/websocket.tar.gz"
rm websocket.tar.gz

