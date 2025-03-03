#!/bin/bash

sudo cp -rf HHC_cicd.conf /etc/nginx/sites-available/HHC_cicd
chmod 777 /var/lib/jenkins/workspace/HHC_CICD

sudo ln -s /etc/nginx/sites-available/HHC_cicd /etc/nginx/sites-enabled
sudo nginx -t

sudo systemctl start nginx
sudo systemctl enable nginx

echo "Nginx has been started"

sudo systemctl status nginx
sudo systemctl restart nginx