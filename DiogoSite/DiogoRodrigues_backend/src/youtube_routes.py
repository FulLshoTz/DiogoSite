"""
🔴 REGRAS DESTE MÓDULO (NÃO REMOVER LÓGICA):
   1. CACHE OBRIGATÓRIO: Todas as rotas (videos, live, channel) TÊM de verificar a cache global antes de chamar a API.
   2. QUOTA DO YOUTUBE: A busca de vídeos e live custa 100 pontos. Não remover a lógica de 'CACHE_DURATION_VIDEOS' (30 min).
   3. FALLBACK: Se a API der erro (ex: quota excedida), o código deve tentar servir os dados antigos da cache em vez de falhar.
   4. LIMITES: Manter o parametro 'limit' nos videos para não trazer o canal todo.
"""

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
# 🧠 SISTEMA DE CACHE (Memória Temporária)
# ============================================================
CACHE_DURATION_VIDEOS = 30 * 60  # 30 min (Poupa muita quota!)
CACHE_DURATION_NEWS = 15 * 60    # 15 min
CACHE_DURATION_LIVE = 2 * 60     # 2 min (Para detetar lives rápido)

# A nossa "Base de Dados" na memória RAM
cache = {
    "videos": {"data": None, "last_updated": 0},
    "live": {"data": None, "last_updated": 0},
    "channel": {"data": None, "last_updated": 0},
    "news": {"data": None, "last_updated": 0}
}

# ============================================================
# 🚦 ROTAS (Com Proteção de Cache)
# ============================================================

@youtube_bp.route("/channel-info", methods=["GET"])
def channel_info():
    current_time = time.time()
    
    # 1. Verifica Cache
    if cache["channel"]["data"] and (current_time - cache["channel"]["last_updated"] < CACHE_DURATION_VIDEOS):
        return jsonify(cache["channel"]["data"])

    # 2. Se expirou, vai à API
    data = get_channel_info()
    if "error" not in data:
        cache["channel"]["data"] = data
        cache["channel"]["last_updated"] = current_time
        return jsonify(data)
    
    # 3. Fallback
    if cache["channel"]["data"]:
        return jsonify(cache["channel"]["data"])
        
    return jsonify(data), 500

@youtube_bp.route("/live-status", methods=["GET"])
def live_status():
    current_time = time.time()

    if cache["live"]["data"] and (current_time - cache["live"]["last_updated"] < CACHE_DURATION_LIVE):
        return jsonify(cache["live"]["data"])

    data = get_live_status()
    if "error" not in data:
        cache["live"]["data"] = data
        cache["live"]["last_updated"] = current_time
        return jsonify(data)

    return jsonify(data), 500

@youtube_bp.route("/latest-videos", methods=["GET"])
def latest_videos():
    current_time = time.time()
    limit = int(request.args.get("limit", 6))

    # 1. Verifica Cache (CRÍTICO: A busca custa 100 pontos!)
    if cache["videos"]["data"] and (current_time - cache["videos"]["last_updated"] < CACHE_DURATION_VIDEOS):
        print(" ⚡ (CACHE) A servir vídeos da memória...")
        return jsonify(cache["videos"]["data"])

    print(" 🐢 (API) A gastar quota do YouTube...")
    data = get_latest_videos(limit)
    
    if "error" not in data:
        cache["videos"]["data"] = data
        cache["videos"]["last_updated"] = current_time
        return jsonify(data)
    
    # Fallback de segurança
    if cache["videos"]["data"]:
        print(" ⚠️ Erro na API, a servir cache antiga de segurança.")
        return jsonify(cache["videos"]["data"])

    return jsonify(data), 500

@youtube_bp.route("/simracing-news", methods=["GET"])
def simracing_news():
    current_time = time.time()

    if cache["news"]["data"] and (current_time - cache["news"]["last_updated"] < CACHE_DURATION_NEWS):
        print(" ⚡ (CACHE) A servir notícias...")
        return jsonify(cache["news"]["data"])

    print(" 🐢 (RSS) A buscar notícias frescas...")
    try:
        fresh_data = get_simracing_news()
        cache["news"]["data"] = fresh_data
        cache["news"]["last_updated"] = current_time
        return jsonify(fresh_data)
    except Exception as e:
        print(f"Erro notícias: {e}")
        if cache["news"]["data"]:
            return jsonify(cache["news"]["data"])
        return jsonify({"error": "Falha ao obter notícias"}), 500