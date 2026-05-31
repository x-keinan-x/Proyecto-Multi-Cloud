# ms-transcoder/transcoder.py (Python)
import os
import subprocess

def transcode_video(input_s3_path, output_filename):
    print(f"Descargando video original desde S3: {input_s3_path}...")
    # Aquí vendría la lógica usando la librería boto3 para descargar desde AWS S3
    
    print("Iniciando pipeline de transcodificación con FFmpeg (HLS / .m3u8)...")
    # Comando FFmpeg para segmentar el video (adaptativo para streaming móvil/web)
    comando_ffmpeg = [
        'ffmpeg', '-i', 'video_original.mp4',
        '-profile:v', 'baseline', '-level', '3.0',
        '-s', '1280x720', '-start_number', '0',
        '-hls_time', '10', '-hls_list_size', '0',
        '-f', 'hls', f'output/{output_filename}.m3u8'
    ]
    
    # Ejecutar el proceso en el contenedor
    subprocess.run(comando_ffmpeg)
    
    print("Subiendo fragmentos optimizados al Bucket de AWS S3 de salida...")
    # Almacenar de forma segura para que la CDN (CloudFront) pueda leerlo
    print("¡Proceso completado con éxito!")

# Simulación de ejecución del pipeline
if __name__ == "__main__":
    transcode_video("s3://bucket-origen/clase1.mp4", "clase1_optimizada")

#Pruebas
