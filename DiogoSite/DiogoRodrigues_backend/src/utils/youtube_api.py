import os
import requests

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
CHANNEL_HANDLE = os.getenv("CHANNEL_HANDLE", "@FulLShoT")

BASE_URL = "https://www.googleapis.com/youtube/v3"


def get_channel_id():
    """Obtém o channelId a partir do handle, com fallback via search"""
    if not YOUTUBE_API_KEY:
        raise Exception("YOUTUBE_API_KEY não definida")

    # 1️⃣ Tenta via forHandle
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
        if response.status_code == 200:
            data = response.json()
            if data.get("items"):
                return data["items"][0]["id"]
        else:
            print(f"[YouTube] forHandle falhou: {response.status_code}")
    except Exception as e:
        print(f"[YouTube] Erro via forHandle: {e}")

    # 2️⃣ Fallback via pesquisa
    try:
        response2 = requests.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "type": "channel",
                "q": CHANNEL_HANDLE.replace("@", ""),
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response2.raise_for_status()
        data2 = response2.json()
        if data2.get("items"):
            return data2["items"][0]["snippet"]["channelId"]
    except Exception as e:
        raise Exception(f"Erro ao obter channelId via fallback: {e}")

    raise Exception("Canal não encontrado via handle nem pesquisa")


def get_channel_info():
    """Obtém informações gerais do canal"""
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
        if response.status_code == 403:
            # fallback via channelId
            channel_id = get_channel_id()
            response = requests.get(
                f"{BASE_URL}/channels",
                params={
                    "part": "snippet,statistics,brandingSettings",
                    "id": channel_id,
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


def get_live_status():
    """Verifica se há live ativa"""
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
    """Obtém os últimos vídeos"""
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
