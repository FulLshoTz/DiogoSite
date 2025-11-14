import os
import re
import requests
from flask import Flask, jsonify
from flask_cors import CORS

YOUTUBE_URL = "https://www.youtube.com/@FulLshoT"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    )
}


def create_app():
    app = Flask(__name__)

    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # ----------------- SCRAPER VÍDEOS -----------------
    def fetch_videos_from_html():
        try:
            html = requests.get(YOUTUBE_URL, timeout=6, headers=HEADERS).text

            matches = re.findall(r'"videoRenderer":({.*?}})', html)

            videos = []
            live = None

            for block in matches:
                vid = re.search(r'"videoId":"(.*?)"', block)
                if not vid:
                    continue

                video_id = vid.group(1)

                title_match = re.search(
                    r'"title":\{"runs":\[\{"text":"(.*?)"\}\]', block
                )
                title = title_match.group(1) if title_match else "Vídeo"

                BL = block.upper()

                is_live = (
                    '"STYLE":"LIVE"' in BL
                    or '"STYLE":"LIVE_NOW"' in BL
                    or "LIVE NOW" in BL
                    or "BADGE_STYLE_TYPE_LIVE_NOW" in BL
                    or '"LABEL":"LIVE"' in BL
                    or '"text":"LIVE"' in BL
                )

                if is_live and live is None:
                    live = {"id": video_id, "title": title}

                videos.append({"id": video_id, "title": title})

            return {"videos": videos, "live": live}

        except Exception as e:
            print("ERRO SCRAPER:", e)
            return {"videos": [], "live": None}

    # ----------------- INFO CANAL -----------------
    def fetch_channel_info():
        try:
            html = requests.get(YOUTUBE_URL, timeout=6, headers=HEADERS).text

            avatar = re.search(r'"avatar":{"thumbnails":\[\{"url":"(.*?)"', html)

            return {
                # força o nome certo, não queremos "Home"
                "title": "Diogo Rodrigues",
                "avatar": avatar.group(1) if avatar else "",
                # já não usamos estes no frontend, mas ficam aqui
                "subs": "",
                "views": "",
            }

        except Exception:
            return {
                "title": "Diogo Rodrigues",
                "avatar": "",
                "subs": "",
                "views": "",
            }

    # ----------------- ROUTES -----------------

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def api_videos():
        data = fetch_videos_from_html()

        if len(data["videos"]) == 0:
            data["videos"] = [
                {"id": "akkgj63j5rg", "title": "PTracerz CUP 2025"},
                {"id": "95r7yKBo-4w", "title": "GT3 VS ORT - Corrida resistência"},
                {"id": "gupDgHpu3DA", "title": "Cacetada no Zurga"},
            ]

        return jsonify({
            "live": data["live"],
            "videos": data["videos"][:15],
        })

    @app.route("/api/channel")
    def api_channel():
        return jsonify(fetch_channel_info())

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
