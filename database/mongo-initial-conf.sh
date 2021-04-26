#!/bin/sh

# This shell script creates an internal MongoDB user without admin permissions on databases.

# Environment variables
DATABASE=myDatabase
USERNAME=guest
PASSWORD=passwordForGuest
PORT=27017
PUBLIC_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

# Make sure the mongo deamon (mongod) service is running
sudo systemctl start mongod.service

# Open the needed port to the outside world
sudo iptables -A INPUT -s $PUBLIC_IP -p tcp --destination-port $PORT -m state --state NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -d $PUBLIC_IP -p tcp --source-port $PORT -m state --state ESTABLISHED -j ACCEPT

# Execute the JavaScript file
mongo localhost:$PORT/$DATABASE init-mongo.js

# Login with the created user
mongo --username $USERNAME --password $PASSWORD --authenticationDatabase $DATABASE
