import os
from flask import Flask, jsonify
from flask_cors import CORS

# ============================================================
# APP FLASK
# ============================================================

def create_app():
    app = Flask(__name__)

    # CORS permitido só para o teu domínio
    CORS(app, resources={
        r"/api/*": {"origins": "https://diogorodrigues.pt"}
    })

    # BLUEPRINT (rotas de YouTube + Notícias)
    from src.youtube_routes import youtube_bp
    app.register_blueprint(youtube_bp, url_prefix="/api")

    # ROTA DE TESTE / HEALTH CHECK
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
