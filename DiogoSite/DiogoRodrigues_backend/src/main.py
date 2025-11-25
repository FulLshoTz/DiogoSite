import os
import time
import requests
from flask import Flask, jsonify
from flask_cors import CORS

# cache em memória (RAM do Render)
CACHE_DURATION = 15 * 60  # 15 minutos
cache_timestamp = 0
cache_data = None


CHANNEL_ID = "UCfg5QnFApnh0RXZlZFzvLiQ"
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

SEARCH_URL = (
    "https://www.googleapis.com/youtube/v3/search"
    "?part=snippet"
    "&channelId={channel}"
    "&maxResults=15"
    "&order=date"
    "&type=video"
    "&key={key}"
)


def fetch_youtube_api():
    """Chama YouTube API (1 vez a cada 15 min)"""
    global cache_data, cache_timestamp

    now = time.time()

    # usar cache se ainda é válida
    if cache_data and (now - cache_timestamp) < CACHE_DURATION:
        return cache_data

    # criar URL
    url = SEARCH_URL.format(channel=CHANNEL_ID, key=YOUTUBE_API_KEY)

    try:
        response = requests.get(url, timeout=10)
        data = response.json()

        # erro da API, evita crash
        if "items" not in data:
            raise Exception("YouTube API error")

        videos = []
        live_video = None

        for item in data["items"]:
            video_id = item["id"]["videoId"]
            title = item["snippet"]["title"]

            # live detection
            if item["snippet"].get("liveBroadcastContent") == "live":
                live_video = {"id": video_id, "title": title}

            videos.append({"id": video_id, "title": title})

        result = {"live": live_video, "videos": videos}

        # guardar em cache
        cache_data = result
        cache_timestamp = now

        return result

    except Exception as e:
        print("Erro YouTube API:", e)

        # fallback se der erro
        return {
            "live": None,
            "videos": [
                {"id": "akkgj63j5rg", "title": "PTracerz CUP 2025"},
                {"id": "95r7yKBo-4w", "title": "GT3 VS ORT - Corrida Resistência"},
                {"id": "gupDgHpu3DA", "title": "Cacetada no Zurga"},
            ],
        }


def create_app():
    app = Flask(__name__)

    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def latest_videos():
        data = fetch_youtube_api()
        return jsonify(data)

    @app.route("/api/channel")
    def channel():
        return jsonify({
            "title": "FulLshoT | Diogo Rodrigues",
            "avatar": "",
            "subs": "",
            "views": ""
        })

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
