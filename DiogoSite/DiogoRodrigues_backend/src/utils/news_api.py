import feedparser
from datetime import datetime, timedelta
import time
import re

# ==============================================================================
# LISTA DE FONTES (Filtrada para sites com RSS válidos e notícias reais)
# ==============================================================================
FEEDS = [
    # --- FONTES PORTUGUESAS ---
    ("Autosport.pt", "https://www.autosport.pt/esports/feed/"),
    ("RTP Arena", "https://arena.rtp.pt/category/sim-racing/feed/"),

    # --- FONTES INTERNACIONAIS DE TOPO ---
    ("OverTake.gg", "https://www.overtake.gg/news/index.rss"),
    ("Traxion.gg", "https://traxion.gg/feed/"),
    ("GTPlanet", "https://www.gtplanet.net/feed/"),
    ("BoxThisLap", "https://boxthislap.org/feed/"),
    ("BSimRacing", "https://www.bsimracing.com/feed/"),
    ("SimRace247", "https://www.simrace247.com/feed/"),
    
    # --- SIMULADORES ESPECÍFICOS ---
    ("iRacing", "https://www.iracing.com/category/news/sim-racing-news/feed/"),
    ("Studio 397 (rF2)", "https://www.studio-397.com/feed/"),
    ("WRC Official", "https://www.wrc.com/rss/news"), 
    
    # --- HARDWARE & TECH ---
    ("Fanatec Blog", "https://fanatec.com/eu-en/blog/rss"),
    ("SimRacingCockpit", "https://simracingcockpit.com/feed/"),
]

# ==============================================================================
# LÓGICA DE DATA DE CORTE (3 AM)
# ==============================================================================
def get_cutoff_date():
    """
    Define a data limite. 
    Regra: Às 03:00 da manhã de Sexta, remove notícias de Quarta.
    Lógica: Data de corte = (Agora - 3h) - 1 dia.
    """
    now = datetime.now()
    # Recuamos 3 horas. Se for 02:00AM de Sexta, conta como Quinta.
    adjusted_time = now - timedelta(hours=3)
    # A data base é o "ontem" desse tempo ajustado.
    base_date = adjusted_time.date()
    cutoff_date = base_date - timedelta(days=1)
    return cutoff_date

def is_recent(entry):
    """Verifica se a notícia é mais recente que a data de corte."""
    try:
        published = entry.get("published_parsed") or entry.get("updated_parsed")
        if not published:
            return True # Aceita se não tiver data (segurança)
            
        entry_date = datetime.fromtimestamp(time.mktime(published)).date()
        return entry_date >= get_cutoff_date()
    except Exception:
        return True

# ==============================================================================
# EXTRAÇÃO DE IMAGENS (Melhorada para vários formatos)
# ==============================================================================
def extract_thumbnail(entry):
    # 1. Tenta media_thumbnail (comum em Wordpress)
    if "media_thumbnail" in entry:
        return entry.media_thumbnail[0]["url"]
        
    # 2. Tenta media_content (comum em sites de notícias)
    if "media_content" in entry:
        media = entry.media_content[0]
        if "url" in media: 
            return media["url"]

    # 3. Tenta enclosures (ex: GTPlanet)
    if "enclosures" in entry:
        for enc in entry.enclosures:
            if enc.get("type", "").startswith("image/"):
                return enc.get("href")

    # 4. Fallback: Procura tag <img src="..."> no HTML da descrição
    content = ""
    if "content" in entry:
        content = entry.content[0].value
    elif "summary" in entry:
        content = entry.summary
        
    if content and "<img" in content:
        m = re.search(r'<img[^>]+src="([^"]+)"', content)
        if m:
            return m.group(1)
            
    return None

def clean_html(raw_html):
    """Remove tags HTML simples para a descrição ficar limpa"""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext.replace("&nbsp;", " ").strip()

# ==============================================================================
# FUNÇÃO PRINCIPAL
# ==============================================================================
def get_simracing_news():
    articles = []
    
    for source_name, url in FEEDS:
        try:
            # Timeout curto para não prender o site se um feed estiver lento
            # feedparser não tem timeout nativo fácil, mas geralmente é rápido.
            feed = feedparser.parse(url)
            
            # Limite de segurança: 5 notícias por fonte para não encher de lixo
            for entry in feed.entries[:5]: 
                
                # FILTRO DE DATA
                if not is_recent(entry):
                    continue

                img = extract_thumbnail(entry)
                
                # Limpeza da descrição
                raw_summary = getattr(entry, "summary", "") or getattr(entry, "title", "")
                description = clean_html(raw_summary)[:200] + "..."
                
                # Timestamp seguro
                pub_date = entry.get("published_parsed") or entry.get("updated_parsed") or time.gmtime()
                timestamp = time.mktime(pub_date)

                articles.append({
                    "title": entry.title,
                    "url": entry.link,
                    "description": description,
                    "image": img,
                    "source": source_name,
                    "timestamp": timestamp
                })
        except Exception as e:
            print(f"Erro ao ler feed {source_name}: {e}")
            continue

    # Ordenar por data (mais recente primeiro)
    articles.sort(key=lambda x: x["timestamp"], reverse=True)

    # Remover duplicados (pelo título)
    seen_titles = set()
    unique_articles = []
    for art in articles:
        # Normaliza o título para evitar duplicados com pequenas diferenças
        normalized_title = art["title"].lower().strip()
        if normalized_title not in seen_titles:
            unique_articles.append(art)
            seen_titles.add(normalized_title)

    # Destaques = primeiras 6 (as mais recentes de todas)
    highlights = unique_articles[:6]
    
    # All = até 50 notícias para o botão "Carregar Mais"
    return {
        "highlights": highlights,
        "all": unique_articles[:50]
    }
