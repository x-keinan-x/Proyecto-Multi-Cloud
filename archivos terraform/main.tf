terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# --- RED VIRTUAL (VPC) ---
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "pi-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "pi-igw" }
}

resource "aws_subnet" "subnet_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags                    = { Name = "pi-subnet-a" }
}

resource "aws_subnet" "subnet_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true
  tags                    = { Name = "pi-subnet-b" }
}

resource "aws_route_table" "rt_public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "rta_a" {
  subnet_id      = aws_subnet.subnet_a.id
  route_table_id = aws_route_table.rt_public.id
}

resource "aws_route_table_association" "rta_b" {
  subnet_id      = aws_subnet.subnet_b.id
  route_table_id = aws_route_table.rt_public.id
}

# --- SEGURIDAD ---
resource "aws_security_group" "sg_web" {
  name        = "pi-sg-web"
  description = "Permitir SSH desde tu IP y HTTP global"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}

# --- MÁQUINAS VIRTUALES ---
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"]
}

resource "aws_instance" "vm_app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.subnet_a.id
  vpc_security_group_ids = [aws_security_group.sg_web.id]
  key_name               = aws_key_pair.deployer.key_name
  user_data              = file("user_data.sh")
  tags                   = { Name = "pi-vm-app" }
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }
}

resource "aws_instance" "vm_backup" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.subnet_b.id
  vpc_security_group_ids = [aws_security_group.sg_web.id]
  key_name               = aws_key_pair.deployer.key_name
  user_data              = file("user_data.sh")
  tags                   = { Name = "pi-vm-backup" }
}

# --- ALMACENAMIENTO Y RESPALDOS ---
resource "aws_ebs_volume" "data_vol" {
  availability_zone = "${var.aws_region}a"
  size              = 8
  tags              = { Name = "pi-data-vol" }
}

resource "aws_volume_attachment" "ebs_att" {
  device_name = "/dev/sdh"
  volume_id   = aws_ebs_volume.data_vol.id
  instance_id = aws_instance.vm_app.id
}

resource "aws_ebs_snapshot" "data_snapshot" {
  volume_id = aws_ebs_volume.data_vol.id
  tags = {
    Name      = "pi-data-snapshot"
    Retention = "7d"
  }
}

resource "aws_s3_bucket" "backup_bucket" {
  bucket = "pi-backup-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.backup_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "google_storage_bucket" "gcp_backup" {
  name                        = "${var.gcp_project}-pi-dr-backup"
  location                    = "US"
  force_destroy               = true
  uniform_bucket_level_access = true
}

# GRUPO DE SUBREDES PARA LA BASE DE DATOS
resource "aws_db_subnet_group" "db_subnet" {
  name       = "pi-db-subnet-group"
  subnet_ids = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]
  tags       = { Name = "pi-db-subnet-group" }
}

# BASE DE DATOS RDS (POSTGRESQL)
resource "aws_db_instance" "edtech_db" {
  identifier             = "pi-database"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t3.micro"
  username               = "dbadmin"
  password               = "PasswordSeguro123"
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  vpc_security_group_ids = [aws_security_group.sg_web.id]
  skip_final_snapshot    = true # Poder destruirla rápido al terminar
  publicly_accessible    = false
}

# identidad de seguridad para que CloudFront pueda entrar a S3 de forma privada
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "pi-cdn-oac"
  description                       = "Acceso seguro exclusivo para la CDN"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Configurar la Distribución de CloudFront
resource "aws_cloudfront_distribution" "video_cdn" {
  origin {
    domain_name              = aws_s3_bucket.backup_bucket.bucket_regional_domain_name
    origin_id                = "S3-VideoOrigin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN Global para Streaming de Videos EdTech"
  default_root_object = "index.html"

  # Configuración del comportamiento por defecto
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-VideoOrigin"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600  # Cachear por 1 hora por defecto
    max_ttl                = 86400
  }

  # Sin restricciones geográficas para acceso global
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Certificado SSL por defecto de Amazon para HTTPS seguro
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Name = "pi-video-cdn" }
}

# Permiso en el Bucket S3 para que acepte peticiones de CloudFront
resource "aws_s3_bucket_policy" "allow_cdn_access" {
  bucket = aws_s3_bucket.backup_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.backup_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.video_cdn.arn
          }
        }
      }
    ]
  })
}

# Mostrar la URL de la CDN en la consola al terminar
output "cdn_domain_name" {
  value       = aws_cloudfront_distribution.video_cdn.domain_name
  description = "URL de la CDN para poner en el Frontend"
}