"""
🔴 REGRAS DO SERVIDOR (NÃO REMOVER LÓGICA):
   1. SETUP: Inicializa o Flask e carrega as variáveis de ambiente.
   2. CORS: Deve SEMPRE permitir as origens:
      - Site Oficial (https://diogorodrigues.pt)
      - Localhost (http://localhost:5173) para desenvolvimento.
   3. PING: Mantém a rota '/api/ping' para o Health Check do Render.
"""

import os
import logging
import time
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify
from flask_cors import CORS

# ============================================================
# LIMPEZA DE FICHEIROS AUTOMÁTICA
# ============================================================

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'temp_uploads')
RETENTION_MINUTES = 30 # Tempo em minutos para manter os ficheiros

def cleanup_old_files():
    """Apaga ficheiros na UPLOAD_FOLDER mais antigos que RETENTION_MINUTES."""
    try:
        now = time.time()
        retention_seconds = RETENTION_MINUTES * 60
        
        if not os.path.exists(UPLOAD_FOLDER):
            return # A pasta pode ainda não ter sido criada

        for filename in os.listdir(UPLOAD_FOLDER):
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.isfile(filepath):
                file_mod_time = os.path.getmtime(filepath)
                if (now - file_mod_time) > retention_seconds:
                    os.remove(filepath)
                    logging.info(f"Ficheiro antigo removido: {filename}")
    except Exception as e:
        logging.error(f"Erro durante a limpeza de ficheiros: {e}", exc_info=True)


# ============================================================
# APP FLASK
# ============================================================

def create_app():
    app = Flask(__name__)

   # CORS permitido para o site oficial E para o teu localhost (testes)
    CORS(app, resources={
        r"/api/*": {"origins": ["https://diogorodrigues.pt", "http://localhost:5173"]}
    })

    # BLUEPRINT (rotas de YouTube + Notícias)
    from src.youtube_routes import youtube_bp
    app.register_blueprint(youtube_bp, url_prefix="/api")

    # BLUEPRINT (rotas de Telemetria)
    from src.telemetry_routes import telemetry_bp
    app.register_blueprint(telemetry_bp, url_prefix="/api")

    # ROTA DE TESTE / HEALTH CHECK
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    return app

logging.basicConfig(level=logging.INFO)
app = create_app()

# Inicia o agendador de limpeza que corre em background
scheduler = BackgroundScheduler(daemon=True)
scheduler.add_job(cleanup_old_files, 'interval', minutes=15)
scheduler.start()
logging.info("Agendador de limpeza de ficheiros iniciado (intervalo: 15 min, retenção: 30 min).")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # use_reloader=False previne que o agendador seja iniciado duas vezes em dev
    app.run(host="0.0.0.0", port=port, use_reloader=False)