#!/bin/bash
apt-get update -y
apt-get install -y nginx unzip curl awscli
systemctl enable nginx
systemctl start nginx
echo "<h1>Proyecto Integrador - VM desplegada con Terraform</h1>" > /var/www/html/index.html