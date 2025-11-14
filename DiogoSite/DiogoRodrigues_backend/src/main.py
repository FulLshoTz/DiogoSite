import os
import requests
import xml.etree.ElementTree as ET
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

CHANNEL_ID = "UCUAEYHXtNbnwHBaSqHSqJJA"
CHANNEL_USERNAME = "FulLshoT"

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ------------------------------
    #   LATEST VIDEOS (RSS)
    # ------------------------------
    @app.route("/api/latest-videos")
    def latest_videos():
        rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"

        try:
            rss_data = requests.get(rss_url, timeout=5)
            root = ET.fromstring(rss_data.text)

            ns = {"yt": "http://www.youtube.com/xml/schemas/2015", "media": "http://search.yahoo.com/mrss/"}

            videos = []
            for entry in root.findall("entry"):
                video_id = entry.find("yt:videoId", ns).text
                title = entry.find("title").text
                published = entry.find("published").text
                thumbnail = entry.find("media:group/media:thumbnail", ns).attrib["url"]

                videos.append({
                    "videoId": video_id,
                    "title": title,
                    "published": published,
                    "thumbnail": thumbnail
                })

            return jsonify({"status": "ok", "videos": videos})

        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    # ------------------------------
    #   LIVE CHECK
    # ------------------------------
    @app.route("/api/live")
    def live_check():
        live_url = f"https://www.youtube.com/@{CHANNEL_USERNAME}/live"

        try:
            # follow redirects = True → YouTube envia para /watch?v=XXXX se estiver live
            response = requests.get(live_url, allow_redirects=True, timeout=5)

            final_url = response.url

            if "watch?v=" in final_url:
                video_id = final_url.split("watch?v=")[1].split("&")[0]
                return jsonify({"live": True, "videoId": video_id})

            return jsonify({"live": False})

        except Exception as e:
            return jsonify({"live": False, "error": str(e)})

    # ------------------------------
    #   PING
    # ------------------------------
    @app.route("/api/ping")
    def ping():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
