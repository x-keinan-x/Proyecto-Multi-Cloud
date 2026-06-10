output "vm_app_public_ip" {
  description = "IP pública de la VM principal (aplicación)."
  value       = aws_instance.vm_app.public_ip
}

output "vm_backup_public_ip" {
  description = "IP pública de la VM secundaria (administración/respaldo)."
  value       = aws_instance.vm_backup.public_ip
}

output "aws_s3_bucket" {
  description = "Nombre del bucket creado en AWS."
  value       = aws_s3_bucket.backup_bucket.bucket
}