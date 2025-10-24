import os
import requests

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
CHANNEL_HANDLE = os.getenv("CHANNEL_HANDLE", "@FulLShoT")

BASE_URL = "https://www.googleapis.com/youtube/v3"

def get_channel_info():
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}

    try:
        response = requests.get(
            f"{BASE_URL}/channels",
            params={
                "part": "snippet,statistics,brandingSettings",
                "forHandle": CHANNEL_HANDLE,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("items"):
            return {"error": "Canal não encontrado"}
        channel = data["items"][0]
        return {
            "title": channel["snippet"]["title"],
            "description": channel["snippet"]["description"],
            "thumbnails": channel["snippet"]["thumbnails"],
            "stats": channel["statistics"],
            "banner": channel.get("brandingSettings", {}).get("image", {}),
        }
    except Exception as e:
        return {"error": str(e)}

def get_channel_id():
    """Obtém o channelId a partir do handle"""
    try:
        response = requests.get(
            f"{BASE_URL}/channels",
            params={
                "part": "id",
                "forHandle": CHANNEL_HANDLE,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("items"):
            raise Exception("Canal não encontrado")
        return data["items"][0]["id"]
    except Exception as e:
        raise Exception(f"Erro ao obter channelId: {e}")

def get_live_status():
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}
    try:
        response = requests.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "channelId": get_channel_id(),
                "eventType": "live",
                "type": "video",
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        return {"is_live": len(data.get("items", [])) > 0}
    except Exception as e:
        return {"error": str(e)}

def get_latest_videos(limit=6):
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}
    try:
        response = requests.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "channelId": get_channel_id(),
                "order": "date",
                "maxResults": limit,
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        videos = []
        for item in data.get("items", []):
            if item["id"]["kind"] == "youtube#video":
                videos.append({
                    "id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                    "publishedAt": item["snippet"]["publishedAt"],
                })
        return {"videos": videos}
    except Exception as e:
        return {"error": str(e)}
