import time
from flask import Blueprint, jsonify, request
from src.utils.youtube_api import (
    get_channel_info,
    get_live_status,
    get_latest_videos,
)
from src.utils.news_api import get_simracing_news

youtube_bp = Blueprint("youtube", __name__)

# ============================================================
# SISTEMA DE CACHE (Igual ao do YouTube)
# ============================================================
CACHE_DURATION = 15 * 60  # 15 minutos em segundos
news_cache = {
    "data": None,
    "last_updated": 0
}

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

@youtube_bp.route("/simracing-news", methods=["GET"])
def simracing_news():
    global news_cache
    
    current_time = time.time()
    
    # 1. Verifica se já temos notícias guardadas e se são recentes (< 15 min)
    if news_cache["data"] and (current_time - news_cache["last_updated"] < CACHE_DURATION):
        print("⚡ A servir notícias da CACHE (Rápido)")
        return jsonify(news_cache["data"])

    # 2. Se não houver cache (ou for velha), vai buscar novas
    print("🐢 A buscar notícias frescas aos sites RSS (Lento)...")
    try:
        fresh_data = get_simracing_news()
        
        # Guarda na memória
        news_cache["data"] = fresh_data
        news_cache["last_updated"] = current_time
        
        return jsonify(fresh_data)
    except Exception as e:
        print(f"Erro ao atualizar notícias: {e}")
        # Se der erro, tenta devolver a cache antiga se existir
        if news_cache["data"]:
            return jsonify(news_cache["data"])
        return jsonify({"error": "Falha ao obter notícias"}), 500
