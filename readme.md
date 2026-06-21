

# EdTech Multimedia - Arquitectura Multi-Cloud

Plataforma educativa basada en microservicios, diseñada para ofrecer alta disponibilidad, resiliencia y recuperación ante desastres (Disaster Recovery). Toda la infraestructura está aprovisionada como código (IaC) y orquestada mediante Kubernetes, operando bajo un modelo Multi-Cloud (Activo-Pasivo) entre Amazon Web Services y Google Cloud Platform.

## Arquitectura del Sistema

El proyecto sigue un enfoque de infraestructura distribuida:
- **Nube Principal (Activa):** Amazon Web Services (AWS). Sostiene la carga de producción mediante instancias EC2, Amazon RDS (PostgreSQL) para la base de datos transaccional, y Amazon S3 para el almacenamiento primario.
- **Nube de Contingencia (Pasiva):** Google Cloud Platform (GCP). Utiliza Cloud Storage para resguardar copias de seguridad críticas, garantizando la supervivencia de los datos ante una caída regional de AWS.

### Stack Tecnológico
* **Infraestructura como Código:** Terraform
* **Orquestación de Contenedores:** Kubernetes (K3s)
* **Frontend:** Next.js
* **Backend / Microservicios:** Node.js (Catálogo y Usuarios)
* **Base de Datos:** PostgreSQL
* **Cloud CLI:** AWS CLI, Google Cloud SDK

---

## Características Principales (Requerimientos No Funcionales)

1. **Alta Disponibilidad (Auto-healing):** Los despliegues del frontend y backend en Kubernetes garantizan que, ante la falla crítica de un contenedor, el orquestador levante una nueva réplica en segundos sin intervención humana.
2. **Disaster Recovery (DR):** Implementación de un script automatizado que empaqueta los manifiestos de infraestructura y datos críticos, enviándolos simultáneamente a Amazon S3 y Google Cloud Storage.
3. **Optimización de Costos (FinOps):** La infraestructura está diseñada para permitir el apagado de nodos no productivos fuera del horario laboral, reduciendo la facturación sin perder el estado del clúster.

---

## Despliegue e Instalación

### 1. Requisitos Previos
- Tener instalado Terraform en la máquina local.
- Configurar credenciales de AWS (`aws configure`) y GCP (`gcloud auth login`).
- Contar con un par de claves SSH para la conexión a las instancias EC2.

### 2. Aprovisionamiento de Infraestructura
Navega a la carpeta de Terraform y ejecuta:
```bash
cd archivos terraform
terraform init
terraform plan
terraform apply --auto-approve
``` 

### 3. Despliegue de Microservicios en Kubernetes
Una vez dentro de la instancia EC2 principal vía SSH, aplica los manifiestos declarativos:

```
cd /home/ubuntu/kubernetes
kubectl apply -f secrets-configmaps.yaml
kubectl apply -f ms-users.yaml
kubectl apply -f ms-catalog.yaml
kubectl apply -f frontend-deployment.yaml
```

### 🛡️ Ejecución del Disaster Recovery (Backup Multi-Cloud)
El sistema cuenta con un proceso de respaldo que comprime el estado declarativo del clúster y lo exporta a ambas nubes. Para ejecutar el respaldo de forma manual:

1. Conéctate al servidor principal vía SSH.
2. Asegúrate de estar autenticado en ambas nubes:
```
aws configure
gcloud auth login --no-browser
```
Ejecuta el script de respaldo:
```
bash backup-to-gcp.sh
```

El sistema confirmará la subida del archivo .tar.gz tanto al bucket de AWS S3 como al bucket de contingencia en GCP.

# Autores
# Pablo Oteiza, Luis Diaz, Diego Curiqueo, Mauricio Carquin, Claudio Valenzuela.

Proyecto de Arquitectura Cloud e Ingeniería de Software.