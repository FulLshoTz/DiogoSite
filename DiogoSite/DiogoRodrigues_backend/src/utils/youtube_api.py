def get_live_status():
    """Verifica se há live ativa e devolve os dados dela"""
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY não definida"}

    try:
        channel_id = get_channel_id()
        response = requests.get(
            f"{BASE_URL}/search",
            params={
                "part": "snippet",
                "channelId": channel_id,
                "eventType": "live",
                "type": "video",
                "key": YOUTUBE_API_KEY,
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        
        items = data.get("items", [])
        if len(items) > 0:
            # Encontrou live! Vamos devolver os dados dela
            live_video = items[0]
            return {
                "is_live": True,
                "id": live_video["id"]["videoId"],
                "title": live_video["snippet"]["title"]
            }
        
        # Não há live
        return {"is_live": False}

    except Exception as e:
        return {"error": str(e)}
