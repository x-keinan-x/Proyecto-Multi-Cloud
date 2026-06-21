

# EdTech Multimedia - Arquitectura Multi-Cloud

Plataforma educativa basada en microservicios, diseñada para ofrecer alta disponibilidad, resiliencia y recuperación ante desastres (Disaster Recovery). Toda la infraestructura está aprovisionada como código (IaC) y orquestada mediante Kubernetes, operando bajo un modelo Multi-Cloud (Activo-Pasivo) entre Amazon Web Services y Google Cloud Platform.

## Arquitectura del Sistema

El proyecto sigue un enfoque de infraestructura distribuida:
- **Nube Principal (Activa):** Amazon Web Services (AWS). Sostiene la carga de producción mediante instancias EC2, Amazon RDS (PostgreSQL) para la base de datos transaccional, y Amazon S3 para el almacenamiento primario.
- **Nube de Contingencia (Pasiva):** Google Cloud Platform (GCP). Utiliza Cloud Storage para resguardar copias de seguridad críticas, garantizando la supervivencia de los datos ante una caída regional de AWS.

### Stack Tecnológico
* **Infraestructura como Código:** Terraform
* **Orquestación de Contenedores:** Kubernetes (K3s)
* **Docker Desktop**
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
- Tener instalado un editor de código(Visual Studio Code).
- Tener instalado PostgreSQL
- Tener instalado Terraform en la máquina local.
- Tener instalado Docker Desktop en la máquina local.
- Tener instalado Git en la máquina local.
- Configurar credenciales de AWS (`aws configure`) y GCP (`gcloud auth login`).
- Contar con un par de claves SSH para la conexión a las instancias EC2.

### 2. Clonación de repositorio y creación de imagenes y contenedores.

Clonar el repositorio desde tu servidor de Git (GitHub / GitLab / AWS CodeCommit)
```bash
git clone https://github.com/tu-usuario/Proyecto-Multi-Cloud.git
```

Acceder a la carpeta raíz del proyecto
```bash
cd Proyecto-Multi-Cloud
```

Una vez clonado el repositorio, debemos instalar las dependencias del proyecto abriendo una terminal (de preferiencia CMD para evitar conflictos con PowerShell).
```bash
npm install
```

Ya clonado, abrimos Docker Desktop y en una terminal de Visual Studio Code ejecutamos el siguiente comando en la ruta raíz del proyecto.
Construir las imágenes y levantar los contenedores en modo 'detached' (segundo plano)

```bash
docker-compose up --build -d
```

Luego de crear las imagenes hay que subirlas a docker hub. Esta es la preparación para el despliegue en la nube
Para que el clúster de Kubernetes en AWS pueda utilizar los microservicios, las imágenes deben ser publicadas en un registro accesible (ej. Docker Hub). 
Construya y suba las imágenes ejecutando:
```
# Construcción y etiquetado de la imagen (ejemplo con microservicio de usuarios)
docker build -t tu-usuario-docker/ms-users:latest ./path-al-microservicio

# Publicación en el registro público
docker push tu-usuario-docker/ms-users:latest
```
Asegúrese de que los manifiestos YAML en la carpeta 'kubernetes' apunten a los nombres de estas imágenes del registro público.

Luego de crear las imagenes en docker, hay que configurar las variables del archivo terraform.tfvars, guiandose por la plantilla del archivo (terraform.tfvars.template).
Esto es para que la construccion de la arquitectura sea automatica, de otra forma se le pedirá rellenar todas las variables a medida que ponga los comandos de terraform. 

Una vez realizado todo estos pasos, se podra ejecutar de manera local, dirigiendonos a la app Docker Desktop en la opción de Containers y dandole click al botón Start.  

### 3. Aprovisionamiento de Infraestructura
Navega a la carpeta de Terraform y ejecuta:
```bash
cd archivos terraform
```
Configure sus credenciales y variables del entorno creando el archivo terraform.tfvars basándose en la plantilla terraform.tfvars.template.
``` 
terraform init
terraform plan
terraform apply --auto-approve
```

Al finalizar, Terraform desplegará en la consola la IP_PUBLICA asignada a la instancia EC2 principal.


### 4. Despliegue de Microservicios en Kubernetes
Una vez dentro de la instancia EC2 principal vía SSH, aplica los manifiestos declarativos:

Conéctese de forma remota a la instancia EC2 principal aprovisionada mediante SSH:
```
ssh -i ~/.ssh/tu-clave-privada ubuntu@<IP_PUBLICA_EC2>
```

Una vez dentro del servidor de AWS, clone el repositorio para disponer de los manifiestos del proyecto en la nube:
```
git clone [https://github.com/tu-usuario/Proyecto-Multi-Cloud.git](https://github.com/tu-usuario/Proyecto-Multi-Cloud.git)
cd Proyecto-Multi-Cloud/kubernetes
```

Aplique los manifiestos declarativos en el clúster de Kubernetes respetando el orden de dependencias (Configuraciones -> Base de datos/Backends -> Frontend):
```
kubectl apply -f secrets-configmaps.yaml
kubectl apply -f ms-users.yaml
kubectl apply -f ms-catalog.yaml
kubectl apply -f frontend-deployment.yaml
```

Verifique que todos los componentes estén en estado operacional (Running):
```
kubectl get pods -w
```
### 5. Ejecución del Disaster Recovery (Backup Multi-Cloud)
El sistema cuenta con un proceso de respaldo que comprime el estado declarativo del clúster y lo exporta a ambas nubes. Para ejecutar el respaldo de forma manual:

1. Conéctate al servidor principal vía SSH.
```
ssh -i ~/.ssh/tu-clave-privada ubuntu@<IP_PUBLICA_EC2>
```

2. Asegúrate de estar autenticado en ambas nubes:
```
aws configure
gcloud auth login --no-browser
```
Ejecuta el script de respaldo:
```
# Otorgar permisos de ejecución al script si es la primera vez
chmod +x backup-to-gcp.sh
# Ejecutar el ciclo de respaldo Multi-Cloud
bash backup-to-gcp.sh
```

El sistema confirmará la subida del archivo .tar.gz tanto al bucket de AWS S3 como al bucket de contingencia en GCP.

# Autores
# Pablo Oteiza, Luis Diaz, Diego Curiqueo, Mauricio Carquin, Claudio Valenzuela.

Proyecto de Arquitectura Cloud e Ingeniería de Software.
