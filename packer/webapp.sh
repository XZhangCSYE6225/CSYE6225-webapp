#!/bin/bash

sleep 10

sudo yum update -y

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs

sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
wget http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm
sudo yum localinstall -y mysql57-community-release-el7-8.noarch.rpm
sudo yum install -y mysql-community-server
sudo systemctl start mysqld 
sudo systemctl enable mysqld
passwords=$(sudo grep 'temporary password' /var/log/mysqld.log | awk {'print $11'})
mysql --connect-expired-password -u root -p$passwords -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Zx991115!';CREATE DATABASE webapp;"


sudo systemctl start mysqld 
sudo systemctl enable mysqld 

sudo yum install unzip -y

cd ~/ && unzip webapp.zip
cd ~/webapp && npm i

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl enable webapp.service
sudo systemctl start webapp.service

