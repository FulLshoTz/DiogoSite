import os

BASE = os.path.join(os.path.expanduser("~"), "Desktop", "DiogoSite")

# --- Conteúdos dos ficheiros ---
main_py = r'''import os
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
'''

youtube_routes_py = r'''from flask import Blueprint, jsonify, request
from src.utils.youtube_api import (
    get_channel_info,
    get_live_status,
    get_latest_videos,
)

youtube_bp = Blueprint("youtube", __name__)

@youtube_bp.route("/channel-info", methods=["GET"])
def channel_info():
    data = get_channel_info()
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)

@youtube_bp.route("/live-status", methods=["GET"])
def live_status():
    data = get_live_status()
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)

@youtube_bp.route("/latest-videos", methods=["GET"])
def latest_videos():
    limit = int(request.args.get("limit", 6))
    data = get_latest_videos(limit)
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)
'''

youtube_api_py = r'''import os
import requests

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
CHANNEL_HANDLE = os.getenv("CHANNEL_HANDLE", "@FulLShoT")

BASE_URL = "https://www.googleapis.com/youtube/v3"

def get_channel_info():
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}

    try:
        response = requests.get(
            f"{BASE_URL}/channels",
            params={
                "part": "snippet,statistics,brandingSettings",
                "forHandle": CHANNEL_HANDLE,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("items"):
            return {"error": "Canal não encontrado"}
        channel = data["items"][0]
        return {
            "title": channel["snippet"]["title"],
            "description": channel["snippet"]["description"],
            "thumbnails": channel["snippet"]["thumbnails"],
            "stats": channel["statistics"],
            "banner": channel.get("brandingSettings", {}).get("image", {}),
        }
    except Exception as e:
        return {"error": str(e)}

def get_channel_id():
    """Obtém o channelId a partir do handle"""
    try:
        response = requests.get(
            f"{BASE_URL}/channels",
            params={
                "part": "id",
                "forHandle": CHANNEL_HANDLE,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("items"):
            raise Exception("Canal não encontrado")
        return data["items"][0]["id"]
    except Exception as e:
        raise Exception(f"Erro ao obter channelId: {e}")

def get_live_status():
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}
    try:
        response = requests.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "channelId": get_channel_id(),
                "eventType": "live",
                "type": "video",
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        return {"is_live": len(data.get("items", [])) > 0}
    except Exception as e:
        return {"error": str(e)}

def get_latest_videos(limit=6):
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}
    try:
        response = requests.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "channelId": get_channel_id(),
                "order": "date",
                "maxResults": limit,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        videos = []
        for item in data.get("items", []):
            if item["id"]["kind"] == "youtube#video":
                videos.append({
                    "id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                    "publishedAt": item["snippet"]["publishedAt"],
                })
        return {"videos": videos}
    except Exception as e:
        return {"error": str(e)}
'''

render_yaml = r'''services:
  - type: web
    name: diogorodrigues-backend
    env: python
    rootDir: DiogoRodrigues_backend
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn src.main:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: CHANNEL_HANDLE
        value: "@FulLShoT"
      - key: CORS_ORIGIN
        value: "https://DiogoRodrigues.onrender.com"
      - key: SECRET_KEY
        sync: false
      - key: YOUTUBE_API_KEY
        sync: false

  - type: static
    name: diogorodrigues-frontend
    rootDir: DiogoRodrigues_frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_API_BASE
        value: "https://DiogoRodrigues-backend.onrender.com/api"
'''

# --- Escrita dos ficheiros ---
# Backend paths
backend_src = os.path.join(BASE, "DiogoRodrigues_backend", "src")
utils_dir = os.path.join(backend_src, "utils")
os.makedirs(utils_dir, exist_ok=True)

with open(os.path.join(backend_src, "main.py"), "w", encoding="utf-8") as f:
    f.write(main_py)

with open(os.path.join(backend_src, "youtube_routes.py"), "w", encoding="utf-8") as f:
    f.write(youtube_routes_py)

with open(os.path.join(utils_dir, "youtube_api.py"), "w", encoding="utf-8") as f:
    f.write(youtube_api_py)

# render.yaml na raiz DiogoSite
with open(os.path.join(BASE, "render.yaml"), "w", encoding="utf-8") as f:
    f.write(render_yaml)

print("Ficheiros escritos com sucesso ✅")
print("Verifica:")
print(" - DiogoRodrigues_backend/src/main.py")
print(" - DiogoRodrigues_backend/src/youtube_routes.py")
print(" - DiogoRodrigues_backend/src/utils/youtube_api.py")
print(" - render.yaml (na raiz)")
