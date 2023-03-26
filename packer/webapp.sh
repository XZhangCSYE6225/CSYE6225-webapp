#!/bin/bash

sleep 10

sudo yum update -y

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs

sudo yum install unzip -y

cd ~/ && unzip webapp.zip
cd ~/webapp && npm i
sudo cp ~/webapp/packer/config.json /opt/
sudo mkdir -p /var/log/webapp/
sudo yum install amazon-cloudwatch-agent -y

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl enable webapp.service
sudo systemctl enable amazon-cloudwatch-agent.service
sudo systemctl start amazon-cloudwatch-agent.service