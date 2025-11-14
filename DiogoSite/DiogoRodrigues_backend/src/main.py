import os
import re
import requests
from flask import Flask, jsonify
from flask_cors import CORS

YOUTUBE_URL = "https://www.youtube.com/@FulLshoT"

def create_app():
    app = Flask(__name__)

    # CORS correto
    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # ------------------------------------------------------------
    #  SCRAPER — extrair vídeos via HTML
    # ------------------------------------------------------------
    def fetch_videos_from_html():
        try:
            html = requests.get(YOUTUBE_URL, timeout=5).text

            # procurar videorenderers
            matches = re.findall(r'"videoRenderer":({.*?}})', html)

            videos = []
            live = None

            for block in matches:
                vid = re.search(r'"videoId":"(.*?)"', block)
                if not vid:
                    continue

                video_id = vid.group(1)

                title_match = re.search(r'"title":\{"runs":\[\{"text":"(.*?)"\}\]', block)
                title = title_match.group(1) if title_match else "Vídeo"

                # LIVE detection
                is_live = '"style":"LIVE"' in block.upper() or 'LIVE"}' in block.upper()

                if is_live and live is None:
                    live = {"id": video_id, "title": title}

                videos.append({"id": video_id, "title": title})

            return {"videos": videos, "live": live}

        except Exception as e:
            print("ERRO SCRAPER:", e)
            return {"videos": [], "live": None}

    # ------------------------------------------------------------
    #  SCRAPER — info do canal
    # ------------------------------------------------------------
    def fetch_channel_info():
        try:
            html = requests.get(YOUTUBE_URL, timeout=5).text

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

    # ------------------------------------------------------------
    #  ROUTES
    # ------------------------------------------------------------

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def api_videos():
        data = fetch_videos_from_html()

        # fallback quando YouTube falha
        if len(data["videos"]) == 0:
            data["videos"] = [
                {"id": "akkgj63j5rg", "title": "PTracerz CUP 2025"},
                {"id": "95r7yKBo-4w", "title": "GT3 VS ORT - Corrida resistência"},
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
