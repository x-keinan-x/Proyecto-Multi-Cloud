# SCRIPT DE BACKUP MULTICLOUD (DISASTER RECOVERY)

# 1. Variables de configuración
AWS_BUCKET="pi-backup-8cbb7eb5"
GCP_BUCKET="project-743a56f6-2a76-4816-b0d-pi-dr-backup"

# 2. Configuración del archivo a respaldar
FECHA=$(date +%Y-%m-%d_%H-%M-%S)
ARCHIVO_BACKUP="backup_app_$FECHA.tar.gz"
DIRECTORIO_DATOS="/home/ubuntu/kubernetes"

echo "Iniciando proceso de Disaster Recovery Backup - $FECHA"
echo "--------------------------------------------------------"

# 3. Comprimir los datos locales de la aplicación
echo "[1/3] Comprimiendo datos críticos..."
tar -czf $ARCHIVO_BACKUP $DIRECTORIO_DATOS
echo "Datos comprimidos en: $ARCHIVO_BACKUP"

# 4. Enviar a la nube principal (AWS S3) para respaldo temporal
echo "[2/3] Transfiriendo respaldo temporal a Amazon S3..."
aws s3 cp $ARCHIVO_BACKUP s3://$AWS_BUCKET/

# 5. Replicar hacia la nube secundaria (Google Cloud) como repositorio final
echo "[3/3] Replicando datos hacia Google Cloud Storage (DR)..."
gcloud storage cp $ARCHIVO_BACKUP gs://$GCP_BUCKET/

# 6. Limpieza local
rm $ARCHIVO_BACKUP

echo "--------------------------------------------------------"
echo "¡Ciclo de Backup Multicloud completado con éxito!"