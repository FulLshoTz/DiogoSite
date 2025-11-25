import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # CORS correto (usa env do Render)
    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # URL correto — usar ID do canal + /videos
    YOUTUBE_URL = "https://www.youtube.com/channel/UCfg5QnFApnh0RXZlZFzvLiQ/videos"

    # User-Agent real (YouTube bloqueia bots)
    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    def fetch_videos_from_html():
        try:
            response = requests.get(YOUTUBE_URL, headers=HEADERS, timeout=10)
            if response.status_code != 200:
                return None, None

            html = response.text

            # Procurar vídeos no ytInitialData
            if "videoRenderer" not in html:
                return None, None

            blocks = html.split('"videoRenderer"')
            videos = []

            for block in blocks[1:]:
                # extrair videoId
                if '"videoId":"' not in block:
                    continue
                try:
                    video_id = block.split('"videoId":"')[1].split('"')[0]
                except:
                    continue

                # extrair título
                title = "Vídeo"
                if '"text":"' in block:
                    title = block.split('"text":"')[1].split('"')[0]

                videos.append({"id": video_id, "title": title})

                if len(videos) >= 15:
                    break

            # detectar live
            live = None
            live_markers = ["LIVE_NOW", "BADGE_STYLE_TYPE_LIVE_NOW", "styleType\":\"LIVE"]
            if any(marker in html for marker in live_markers):
                if len(videos) > 0:
                    live = videos[0]

            return live, videos

        except Exception:
            return None, None

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def latest_videos():
        live, vids = fetch_videos_from_html()

        # fallback se scrap falhar
        if vids is None or len(vids) == 0:
            fallback = [
                {"id": "akkgj63j5rg", "title": "PTracerz CUP 2025"},
                {"id": "95r7yKBo-4w", "title": "GT3 VS ORT - Corrida Resistência"},
                {"id": "gupDgHpu3DA", "title": "Cacetada no Zurga"}
            ]
            return jsonify({"live": None, "videos": fallback})

        return jsonify({"live": live, "videos": vids[:15]})

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
