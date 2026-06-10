variable "aws_region" {
  description = "Región por defecto de AWS (N. Virginia)."
  type        = string
  default     = "us-east-1"
}

variable "gcp_project" {
  description = "ID del proyecto de Google Cloud."
  type        = string
}

variable "gcp_region" {
  description = "Región por defecto de Google Cloud (Iowa)."
  type        = string
  default     = "us-central1"
}

variable "my_ip" {
  description = "IP pública permitida para acceder por SSH."
  type        = string
}

variable "key_name" {
  description = "Nombre de la llave SSH en AWS."
  type        = string
}

variable "public_key_path" {
  description = "Ruta local a la llave pública SSH."
  type        = string
}