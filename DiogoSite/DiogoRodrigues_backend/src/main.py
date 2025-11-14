import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Carrega variáveis do .env em dev
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default_secret")

    # ----------------------------
    #   CONFIGURAÇÃO DE CORS
    # ----------------------------
    cors_origin_raw = os.getenv("CORS_ORIGIN", "*")

    # Converte "a,b,c" numa lista ["a", "b", "c"]
    cors_origin = [
        origin.strip()
        for origin in cors_origin_raw.split(",")
        if origin.strip()
    ]

    # Aplica CORS apenas às rotas /api/*
    CORS(app, resources={r"/api/*": {"origins": cors_origin}}, supports_credentials=True)

    # ----------------------------
    #  IMPORTAÇÃO DAS ROTAS
    # ----------------------------
    from src.youtube_routes import youtube_bp
    app.register_blueprint(youtube_bp, url_prefix="/api/youtube")

    # ----------------------------
    #   ROTA PARA TESTAR BACKEND
    # ----------------------------
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok", "message": "backend ativo"})

    return app


# Criar app Flask
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
