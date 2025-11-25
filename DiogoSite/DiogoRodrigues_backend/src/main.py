import os
import time
import requests
from flask import Flask, jsonify
from flask_cors import CORS

# ============================================================
# CONFIGURAÇÕES
# ============================================================

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
CHANNEL_ID = "UCfg5QnFApnh0RXZlZFzvLiQ"

CACHE_DURATION = 60 * 15  # 15 minutos
cache = {
    "videos": None,
    "videos_time": 0,
    "stats": None,
    "stats_time": 0
}

# ============================================================
# FUNÇÃO: Buscar últimos vídeos + live
# ============================================================

def fetch_latest_videos():
    # Cache valida?
    if cache["videos"] and time.time() - cache["videos_time"] < CACHE_DURATION:
        return cache["videos"]

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "key": YOUTUBE_API_KEY,
        "channelId": CHANNEL_ID,
        "order": "date",
        "maxResults": 10,
        "part": "snippet"
    }

    r = requests.get(url, params=params, timeout=10)
    data = r.json()

    videos = []
    live = None

    for item in data.get("items", []):
        video_id = item["id"].get("videoId")
        snippet = item.get("snippet", {})
        title = snippet.get("title", "")

        if not video_id:
            continue

        # Live?
        if snippet.get("liveBroadcastContent") == "live":
            live = {"id": video_id, "title": title}

        videos.append({"id": video_id, "title": title})

    result = {"live": live, "videos": videos}

    cache["videos"] = result
    cache["videos_time"] = time.time()
    return result

# ============================================================
# FUNÇÃO: Buscar subs, views, nº vídeos
# ============================================================

def fetch_channel_stats():
    # Cache valida?
    if cache["stats"] and time.time() - cache["stats_time"] < CACHE_DURATION:
        return cache["stats"]

    url = "https://www.googleapis.com/youtube/v3/channels"
    params = {
        "key": YOUTUBE_API_KEY,
        "id": CHANNEL_ID,
        "part": "statistics"
    }

    r = requests.get(url, params=params, timeout=10)
    data = r.json()

    stats = data["items"][0]["statistics"]

    result = {
        "subs": stats.get("subscriberCount", "0"),
        "views": stats.get("viewCount", "0"),
        "videos": stats.get("videoCount", "0"),
    }

    cache["stats"] = result
    cache["stats_time"] = time.time()
    return result

# ============================================================
# APP FLASK
# ============================================================

def create_app():
    app = Flask(__name__)

    CORS(app, resources={
        r"/api/*": {"origins": "https://diogorodrigues.pt"}
    })

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def latest_videos():
        try:
            return jsonify(fetch_latest_videos())
        except Exception as e:
            print("Erro /api/latest-videos:", e)
            return jsonify({"live": None, "videos": []})

    @app.route("/api/channel-stats")
    def channel_stats():
        try:
            return jsonify(fetch_channel_stats())
        except Exception as e:
            print("Erro /api/channel-stats:", e)
            return jsonify({"subs": "0", "views": "0", "videos": "0"})

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
