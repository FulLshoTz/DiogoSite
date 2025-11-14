import os
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_CHANNEL_ID = "UCg0AiAvX8ZDbEzu1s6QUd9w"  # ID do teu canal

# URL base para scraping (sem API Key)
YT_RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}"
YT_CHANNEL_URL = f"https://www.youtube.com/@FulLshoT"


def create_app():
    app = Flask(__name__)

    # CORS seguro
    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    # -----------------------------
    #   HELPERS
    # -----------------------------
    def fetch_latest_videos():
        """
        Vai ao feed RSS do YouTube buscar os últimos vídeos (sem API)
        """
        try:
            r = requests.get(YT_RSS_URL, timeout=5)
            r.raise_for_status()

            from xml.etree import ElementTree as ET
            xml = ET.fromstring(r.text)

            entries = xml.findall("{http://www.w3.org/2005/Atom}entry")

            videos = []
            live = None

            for e in entries:
                video_id = e.find("{http://www.youtube.com/xml/schemas/2015}videoId").text
                title = e.find("{http://www.w3.org/2005/Atom}title").text

                # Live detection
                is_live = "LIVE" in title.upper() or "🔴" in title

                if is_live and live is None:
                    live = {"id": video_id, "title": title}

                videos.append({
                    "id": video_id,
                    "title": title
                })

            return {"videos": videos, "live": live}

        except Exception as e:
            print("Erro ao carregar RSS:", e)
            return {"videos": [], "live": None}

    def fetch_channel_info():
        """
        Scrape simples da página do canal (sem API):
        - nome do canal
        - avatar
        - subs (aproximados)
        - total views (YouTube esconde valores exatos, mas dá round)
        """
        try:
            r = requests.get(YT_CHANNEL_URL, timeout=5)
            r.raise_for_status()
            html = r.text

            # Nome
            import re
            title_match = re.search(r'"title":"(.*?)"', html)
            title = title_match.group(1) if title_match else "FulLshoT | Diogo Rodrigues"

            # Avatar
            avatar_match = re.search(r'"avatar":{"thumbnails":\[{"url":"(.*?)"', html)
            avatar = avatar_match.group(1) if avatar_match else "https://yt3.ggpht.com/cg4Dfb7uuvYU48SCLabYtHJ8BZ5zRdeszrMJIN0Mm6MpVlH_PnHZPDEzE6PlvR4W6mbr-q2d=s800-c-k-c0x00ffffff-no-rj"

            # Subs (YouTube fornece arredondado)
            subs_match = re.search(r'"subscriberCountText".*?"simpleText":"(.*?)"', html)
            subs = subs_match.group(1) if subs_match else "???"

            # Views totais
            views_match = re.search(r'"viewCountText".*?"simpleText":"(.*?)"', html)
            views = views_match.group(1) if views_match else "???"

            return {
                "title": title,
                "avatar": avatar,
                "subs": subs,
                "views": views
            }

        except Exception as e:
            print("Erro channel-info:", e)
            return {
                "title": "FulLshoT | Diogo Rodrigues",
                "avatar": "https://yt3.ggpht.com/cg4Dfb7uuvYU48SCLabYtHJ8BZ5zRdeszrMJIN0Mm6MpVlH_PnHZPDEzE6PlvR4W6mbr-q2d=s800-c-k-c0x00ffffff-no-rj",
                "subs": "???",
                "views": "???",
            }

    # -----------------------------
    #   ROUTES
    # -----------------------------

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def latest_videos():
        data = fetch_latest_videos()
        return jsonify(data)

    @app.route("/api/channel")
    def channel():
        info = fetch_channel_info()
        return jsonify(info)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
