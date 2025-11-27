import requests
import feedparser

FEEDS = [
    ("Traxion.gg", "https://traxion.gg/feed/"),
    ("RaceDepartment", "https://www.racedepartment.com/news/categories/sim-racing.1/index.rss"),
    ("Motorsport SimRacing", "https://www.motorsport.com/rss/sim-racing/news/"),
]

def extract_thumbnail(entry):
    # media:thumbnail
    if "media_thumbnail" in entry:
        return entry.media_thumbnail[0]["url"]

    # media:content
    if "media_content" in entry:
        return entry.media_content[0]["url"]

    # enclosures
    if "enclosures" in entry and len(entry.enclosures) > 0:
        return entry.enclosures[0].get("href")

    # às vezes vem html com <img>
    if "summary" in entry and "<img" in entry.summary:
        import re
        m = re.search(r'<img[^>]+src="([^"]+)"', entry.summary)
        if m:
            return m.group(1)

    return None


def get_simracing_news():
    articles = []

    for source, url in FEEDS:
        try:
            feed = feedparser.parse(url)
            
            for entry in feed.entries[:6]:
                img = extract_thumbnail(entry)

                articles.append({
                    "title": entry.title,
                    "url": entry.link,
                    "description": getattr(entry, "summary", "")[:200],
                    "image": img,
                    "source": source,
                })
        except Exception:
            pass

    # destacadas = primeiras 6
    highlights = articles[:6]

    return {
        "highlights": highlights,
        "all": articles[:30]
    }
