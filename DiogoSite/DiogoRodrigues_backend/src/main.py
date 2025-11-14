import os
import re
import requests
from flask import Flask, jsonify
from flask_cors import CORS

YOUTUBE_URL = "https://www.youtube.com/@FulLshoT/videos"

def create_app():
    app = Flask(__name__)

    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # ----------------------------------------------------------------
    #  SCRAPER — usar o separador /videos (muito mais estável)
    # ----------------------------------------------------------------
    def fetch_videos():
        try:
            html = requests.get(YOUTUBE_URL, timeout=6).text

            # encontrar blocos videoRenderer completos
            blocks = re.findall(r'"videoRenderer":\s*({.*?})\s*,\s*"trackingParams"', html)

            videos = []
            live = None

            for block in blocks:
                # videoId
                vid = re.search(r'"videoId":"(.*?)"', block)
                if not vid:
                    continue
                video_id = vid.group(1)

                # título
                title_match = re.search(r'"title":\{"runs":\[\{"text":"(.*?)"\}\]', block)
                title = title_match.group(1) if title_match else "Vídeo"

                # LIVE detection
                is_live = (
                    '"style":"LIVE"' in block.upper()
                    or '"label":"LIVE"' in block.upper()
                    or '"BADGE_STYLE_TYPE_LIVE_NOW"' in block.upper()
                )

                if is_live and live is None:
                    live = {"id": video_id, "title": title}

                videos.append({"id": video_id, "title": title})

            return {"videos": videos, "live": live}

        except Exception as e:
            print("ERRO SCRAPER:", e)
            return {"videos": [], "live": None}

    # ----------------------------------------------------------------
    #  SCRAPER — info do canal
    # ----------------------------------------------------------------
    def fetch_channel_info():
        try:
            html = requests.get("https://www.youtube.com/@FulLshoT", timeout=5).text

            title = re.search(r'"title":"(.*?)"', html)
            avatar = re.search(r'"avatar":{"thumbnails":\[\{"url":"(.*?)"', html)
            subs = re.search(r'"subscriberCountText".*?"simpleText":"(.*?)"', html)
            views = re.search(r'"viewCountText".*?"simpleText":"(.*?)"', html)

            return {
                "title": title.group(1) if title else "FulLshoT | Diogo Rodrigues",
                "avatar": avatar.group(1) if avatar else "",
                "subs": subs.group(1) if subs else "???",
                "views": views.group(1) if views else "???"
            }

        except:
            return {
                "title": "FulLshoT | Diogo Rodrigues",
                "avatar": "",
                "subs": "???",
                "views": "???"
            }

    # ----------------------------------------------------------------
    #  ROUTES
    # ----------------------------------------------------------------
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def api_latest():
        data = fetch_videos()

        # fallback — se YouTube bloquear scraping
        if len(data["videos"]) == 0:
            data["videos"] = [
                {"id": "akkgj63j5rg", "title": "PTracerz CUP 2025"},
                {"id": "95r7yKBo-4w", "title": "GT3 vs ORT - Corrida resistência"},
                {"id": "gupDgHpu3DA", "title": "Cacetada no Zurga"},
            ]

        return jsonify({
            "live": data["live"],
            "videos": data["videos"][:15]
        })

    @app.route("/api/channel")
    def api_channel():
        return jsonify(fetch_channel_info())

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
