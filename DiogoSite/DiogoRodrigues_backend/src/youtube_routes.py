from flask import Blueprint, jsonify, request
from src.utils.youtube_api import (
    get_channel_info,
    get_live_status,
    get_latest_videos,
)

youtube_bp = Blueprint("youtube", __name__)

@youtube_bp.route("/channel-info", methods=["GET"])
def channel_info():
    data = get_channel_info()
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)

@youtube_bp.route("/live-status", methods=["GET"])
def live_status():
    data = get_live_status()
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)

@youtube_bp.route("/latest-videos", methods=["GET"])
def latest_videos():
    limit = int(request.args.get("limit", 6))
    data = get_latest_videos(limit)
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)
    
from src.utils.news_api import get_simracing_news

@youtube_bp.route("/simracing-news", methods=["GET"])
def simracing_news():
    return jsonify(get_simracing_news())

