import os
import re
import requests
from flask import Flask, jsonify
from flask_cors import CORS

YOUTUBE_URL = "https://www.youtube.com/@FulLshoT"

def create_app():
    app = Flask(__name__)

    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # ------------------------------------------------------------
    #  SCRAPER — extrai vídeos do HTML do canal
    # ------------------------------------------------------------
    def fetch_videos_from_html():
        try:
            html = requests.get(YOUTUBE_URL, timeout=5).text

            # Procura objetos "videoRenderer"
            matches = re.findall(r'"videoRenderer":({.*?}})', html)

            videos = []
            live = None

            for block in matches:
                # Extrair ID
                vid_match = re.search(r'"videoId":"(.*?)"', block)
                if not vid_match:
                    continue

                video_id = vid_match.group(1)

                # Extrair título
                title_match = re.search(r'"title":\{"runs":\[\{"text":"(.*?)"\}\]', block)
                title = title_match.group(1) if title_match else "Sem título"

                # Detetar LIVE
                is_live = '"style":"LIVE"' in block.upper() or 'LIVE"}' in block.upper()

                if is_live and live is None:
                    live = {"id": video_id, "title": title}

                videos.append({"id": video_id, "title": title})

            return {"videos": videos, "live": live}

        except Exception as e:
            print("ERRO SCRAPER:", e)
            return {"videos": [], "live": None}

    # ------------------------------------------------------------
    #  SCRAPER — extrai info do canal (avatar + nome)
    # ------------------------------------------------------------
    def fetch_channel_info():
        try:
            html = requests.get(YOUTUBE_URL, timeout=5).text

            # título
            title = re.search(r'"title":"(.*?)"', html)
            title = title.group(1) if title else "FulLshoT | Diogo Rodrigues"

            # avatar
            avatar = re.search(r'"avatar":{"thumbnails":\[\{"url":"(.*?)"', html)
            avatar = avatar.group(1) if avatar else ""

            # subs
            subs = re.search(r'"subscriberCountText".*?"simpleText":"(.*?)"', html)
            subs = subs.group(1) if subs else "???"

            # views
            views = re.search(r'"viewCountText".*?"simpleText":"(.*?)"', html)
            views = views.group(1) if views else "???"

            return {
                "title": title,
                "avatar": avatar,
                "subs": subs,
                "views": views
            }

        except:
            return {
                "title": "FulLshoT | Diogo Rodrigues",
                "avatar": "",
                "subs": "???",
                "views": "???"
            }

    # ------------------------------------------------------------
    #  ROTAS
    # ------------------------------------------------------------

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def api_videos():
        data = fetch_videos_from_html()

        # fallback — nunca envia vazio
        if len(data["videos"]) == 0:
            data["videos"] = [
                {"id": "akkgj63j5rg", "title": "Hotlap 1"},
                {"id": "95r7yKBo-4w", "title": "Hotlap 2"},
                {"id": "gupDgHpu3DA", "title": "Hotlap 3"},
            ]

        return jsonify({
            "live": data["live"],
            "videos": data["videos"][:15]  # devolve 15 para futuro
        })

    @app.route("/api/channel")
    def api_channel():
        return jsonify(fetch_channel_info())

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
