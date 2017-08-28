#!/bin/bash

docker save -o camfun.tar camfun
gzip -c camfun.tar > camfun.tar.gz
rm camfun.tar
scp camfun.tar.gz asus:~/
ssh asus "docker load -i ~/camfun.tar.gz"
rm camfun.tar.gz

