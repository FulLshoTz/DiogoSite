import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS
import xml.etree.ElementTree as ET


CHANNEL_ID = "UCfg5QnFApnh0RXZlZFzvLiQ"
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"


def get_videos_from_rss():
    try:
        resp = requests.get(RSS_URL, timeout=10)
        if resp.status_code != 200:
            return None, []

        xml = resp.text
        root = ET.fromstring(xml)

        ns = {"yt": "http://www.youtube.com/xml/schemas/2015", "media": "http://search.yahoo.com/mrss/"}

        videos = []
        live = None

        for entry in root.findall("entry"):
            video_id = entry.find("yt:videoId", ns).text
            title = entry.find("title").text

            # detectar live (YouTube marca <yt:liveBroadcast>live</yt:liveBroadcast>)
            live_tag = entry.find("yt:liveBroadcast", ns)
            if live_tag is not None and live_tag.text == "live":
                live = {"id": video_id, "title": title}

            videos.append({"id": video_id, "title": title})

        return live, videos

    except Exception:
        return None, []


def create_app():
    app = Flask(__name__)

    frontend = os.getenv("CORS_ORIGIN", "https://diogorodrigues.pt")
    CORS(app, resources={r"/api/*": {"origins": frontend}})

    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    @app.route("/api/latest-videos")
    def latest_videos():
        live, videos = get_videos_from_rss()

        if not videos:
            fallback = [
                {"id": "akkgj63j5rg", "title": "PTracerz CUP 2025"},
                {"id": "95r7yKBo-4w", "title": "GT3 VS ORT - Corrida Resistência"},
                {"id": "gupDgHpu3DA", "title": "Cacetada no Zurga"}
            ]
            return jsonify({"live": None, "videos": fallback})

        return jsonify({"live": live, "videos": videos[:15]})

    @app.route("/api/channel")
    def channel():
        return jsonify({
            "title": "FulLshoT | Diogo Rodrigues",
            "avatar": f"https://yt3.googleusercontent.com/ytc/AGIKgqPp.png",  # opcional
            "subs": "",
            "views": ""
        })

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
