#!/bin/bash

docker save -o camfun2.tar camfun2
gzip -c camfun2.tar > camfun2.tar.gz
rm camfun2.tar
scp camfun2.tar.gz asus:~/
ssh asus "docker load -i ~/camfun2.tar.gz"
rm camfun2.tar.gz

