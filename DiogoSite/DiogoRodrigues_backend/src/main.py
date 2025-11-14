import os
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_CHANNEL_ID = "UCg0AiAvX8ZDbEzu1s6QUd9w"
YT_RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}"
YT_CHANNEL_URL = "https://www.youtube.com/@FulLshoT"


def create_app():
    app = Flask(__name__)

    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # ----------------------------------------------------------------
    #  SAFE XML FETCH  —  NÃO REBENTA MESMO QUE O RSS VENHA PARTIDO
    # ----------------------------------------------------------------
    def safe_fetch_rss():
        try:
            r = requests.get(YT_RSS_URL, timeout=5)
            if not r.text.startswith("<?xml"):
                raise ValueError("RSS não é XML")
            return r.text
        except:
            return None

    # ----------------------------------------------------------------
    def fetch_latest_videos():
        xml = safe_fetch_rss()

        # ⚠️ SE O XML FOR INVÁLIDO → DEVOLVE VAZIO EM VEZ DE 500
        if xml is None:
            return {"videos": [], "live": None}

        try:
            from xml.etree import ElementTree as ET
            root = ET.fromstring(xml)
            entries = root.findall("{http://www.w3.org/2005/Atom}entry")

            videos = []
            live = None

            for e in entries:
                vid = e.find("{http://www.youtube.com/xml/schemas/2015}videoId").text
                title = e.find("{http://www.w3.org/2005/Atom}title").text

                is_live = "LIVE" in title.upper() or "🔴" in title

                if is_live and live is None:
                    live = {"id": vid, "title": title}

                videos.append({"id": vid, "title": title})

            return {"videos": videos, "live": live}

        except Exception as e:
            print("ERRO PARSE RSS:", e)
            return {"videos": [], "live": None}

    # ----------------------------------------------------------------
    def fetch_channel_info():
        # manter como antes — isto está estável
        try:
            r = requests.get(YT_CHANNEL_URL, timeout=5)
            html = r.text

            import re
            title = re.search(r'"title":"(.*?)"', html)
            avatar = re.search(r'"avatar":{"thumbnails":\[{"url":"(.*?)"', html)
            subs = re.search(r'"subscriberCountText".*?"simpleText":"(.*?)"', html)
            views = re.search(r'"viewCountText".*?"simpleText":"(.*?)"', html)

            return {
                "title": title.group(1) if title else "FulLshoT | Diogo Rodrigues",
                "avatar": avatar.group(1) if avatar else "",
                "subs": subs.group(1) if subs else "???",
                "views": views.group(1) if views else "???",
            }

        except:
            return {
                "title": "FulLshoT | Diogo Rodrigues",
                "avatar": "",
                "subs": "???",
                "views": "???",
            }

    # ----------------------------------------------------------------
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def api_latest():
        return jsonify(fetch_latest_videos())

    @app.route("/api/channel")
    def api_channel():
        return jsonify(fetch_channel_info())

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
