import os
import json
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

    # ----------------------------------------------------------------
    #  CORS FIX — suporta LISTAS vindas do Render sem falhar
    # ----------------------------------------------------------------
    cors_raw = os.getenv("CORS_ORIGIN", "[]")

    try:
        # Se for lista JSON válida, usa
        cors_origins = json.loads(cors_raw)
    except:
        # Se for string, separa por vírgulas
        cors_origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

    if not cors_origins:
        cors_origins = ["*"]  # fallback seguro

    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    # ----------------------------------------------------------------
    #  SAFE RSS FETCH — evita erros quando YouTube bloqueia
    # ----------------------------------------------------------------
    def safe_fetch_rss():
        try:
            r = requests.get(YT_RSS_URL, timeout=6)
            txt = r.text.strip()

            # Se não começa por XML → YouTube devolveu HTML → inválido
            if not txt.startswith("<?xml"):
                raise ValueError("RSS não é XML válido")
            return txt

        except Exception as e:
            print("RSS ERROR:", e)
            return None

    # ----------------------------------------------------------------
    def fetch_latest_videos():
        xml = safe_fetch_rss()

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
            print("PARSE RSS ERROR:", e)
            return {"videos": [], "live": None}

    # ----------------------------------------------------------------
    def fetch_channel_info():
        try:
            r = requests.get(YT_CHANNEL_URL, timeout=6)
            html = r.text

            import re

            def regex(pattern):
                m = re.search(pattern, html)
                return m.group(1) if m else None

            title = regex(r'"title":"(.*?)"') or "FulLshoT | Diogo Rodrigues"
            avatar = regex(r'"avatar":{"thumbnails":\[{"url":"(.*?)"') or ""
            subs = regex(r'"subscriberCountText".*?"simpleText":"(.*?)"') or "???"
            views = regex(r'"viewCountText".*?"simpleText":"(.*?)"') or "???"

            return {
                "title": title,
                "avatar": avatar,
                "subs": subs,
                "views": views,
            }

        except Exception as e:
            print("CHANNEL INFO ERROR:", e)
            return {
                "title": "FulLshoT | Diogo Rodrigues",
                "avatar": "",
                "subs": "???",
                "views": "???",
            }

    # ----------------------------------------------------------------
    # ROUTES
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
