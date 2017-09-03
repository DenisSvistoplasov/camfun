#!/bin/bash

docker save -o camfun2.tar camfun2
gzip -c camfun2.tar > camfun2.tar.gz
rm camfun2.tar
scp camfun2.tar.gz asus:~/
ssh asus "docker stop camfun2"
ssh asus "docker rm camfun2"
ssh asus "docker rmi camfun2"
ssh asus "docker load -i ~/camfun2.tar.gz"
ssh asus "docker run --detach --name=camfun2 --publish=32769:80 --restart=always camfun2"
rm camfun2.tar.gz

