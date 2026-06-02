FROM python:3.9-slim

#Instalar FFmpeg a nivel del sistema operativo primero
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

#Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || true

# Copiar script transcoder.py
COPY . .

# Ejecutar el script
CMD ["python", "transcoder.py"]