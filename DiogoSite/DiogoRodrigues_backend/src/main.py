import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Carrega variáveis do .env em dev
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default_secret")

    # Configurar CORS
    cors_origin = os.getenv("CORS_ORIGIN", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origin}})

    # Importar e registar rotas do YouTube
    from src.youtube_routes import youtube_bp
    app.register_blueprint(youtube_bp, url_prefix="/api/youtube")

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok", "message": "backend ativo"})

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
