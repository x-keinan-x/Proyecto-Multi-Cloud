#!/bin/bash
# 1. Crear memoria Swap de 2GB inmediatamente al nacer
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 2. Hacer que el Swap sobreviva a los reinicios
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 3. Instalar Kubernetes ahora que la máquina es a prueba de balas
curl -sfL https://get.k3s.io | sh -
chmod 644 /etc/rancher/k3s/k3s.yaml