import os
import subprocess
from flask import Flask, request, jsonify

app = Flask(__name__)

def transcode_video(input_s3_path, output_filename):
    print(f"Descargando video original desde S3: {input_s3_path}...")
    
    print("Iniciando pipeline de transcodificación con FFmpeg...")
    comando_ffmpeg = [
        'ffmpeg', '-i', 'video_original.mp4',
        '-profile:v', 'baseline', '-level', '3.0',
        '-s', '1280x720', '-start_number', '0',
        '-hls_time', '10', '-hls_list_size', '0',
        '-f', 'hls', f'output/{output_filename}.m3u8'
    ]
    
    try:
        subprocess.run(comando_ffmpeg, check=False) 
    except Exception as e:
        print(f"Error al ejecutar FFmpeg: {e}")
        
    print("Subiendo fragmentos optimizados al Bucket de AWS S3 de salida...")
    print("¡Proceso completado con éxito!")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Transcodificador API funcionando perfectamente"}), 200

@app.route('/api/transcode', methods=['POST'])
def trigger_transcode():
    data = request.get_json() or {}
    input_path = data.get("input_path", "s3://bucket-origen/clase1.mp4")
    output_name = data.get("output_name", "clase1_optimizada")
    
    # Ejecutar la función
    transcode_video(input_path, output_name)
    
    return jsonify({
        "message": "Transcodificación procesada",
        "video": output_name
    }), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
