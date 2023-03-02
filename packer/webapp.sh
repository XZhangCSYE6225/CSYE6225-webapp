#!/bin/bash

sleep 10

sudo yum update -y

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs

sudo yum install unzip -y

cd ~/ && unzip webapp.zip
cd ~/webapp && npm i

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl enable webapp.service