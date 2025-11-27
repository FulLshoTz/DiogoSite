import React, { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://placehold.co/600x400/1a1a1a/red?text=SimRacing";

export default function NoticiasSection() {
  const [highlights, setHighlights] = useState([]);
  const [feed, setFeed] = useState([]);
  const [filter, setFilter] = useState(() => localStorage.getItem("newsFilter") || "ALL");
  const [loading, setLoading] = useState(true);

  const formatDate = (unixTimestamp) => {
    if (!unixTimestamp) return "";
    const date = new Date(unixTimestamp * 1000);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

    if (isToday) {
      return `Hoje, ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("pt-PT", { 
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" 
    });
  };

  async function load() {
    try {
      // setLoading(true) apenas no primeiro load para não piscar no auto-refresh
      const res = await fetch("https://diogorodrigues-backend.onrender.com/api/simracing-news");
      if (!res.ok) return;
      const data = await res.json();
      setHighlights(data.highlights || []);
      setFeed(data.all || []);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15 * 60 * 1000); // 15 min
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    localStorage.setItem("newsFilter", newFilter);
  };

  const categories = [
    { key: "ALL", label: "Todas" },
    { key: "LMU", label: "LMU" },
    { key: "WRC", label: "WRC" },
    { key: "ASSETTO", label: "Assetto Corsa" },
    { key: "IRACING", label: "iRacing" },
    { key: "HARDWARE", label: "Hardware" },
  ];

  // Filtros e Deduplicação
  const highlightLinks = new Set(highlights.map(h => h.url));
  const filteredList = feed.filter((n) => {
    if (highlightLinks.has(n.url)) return false;
    if (filter === "ALL") return true;
    const text = (n.title + n.description).toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  return (
    <section className="max-w-7xl mx-auto text-white px-4 py-8 space-y-12">
      
      {/* Estilos para a Barra de Scroll Vermelha */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px; /* Altura da barra horizontal */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #171717; /* Cor do fundo da calha (neutral-900) */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dc2626; /* Cor da barra (red-600) */
          border-radius: 4px;
          cursor: pointer;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444; /* Cor ao passar o rato (red-500) */
        }
      `}</style>

      {/* ====================== */}
      {/* DESTAQUES (Scroll Horizontal) */}
      {/* ====================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-red-600 fill-current" viewBox="0 0 576 512">
            <path d="M480 32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h384c53 0 96-43 96-96V128C576 75 533 32 480 32z" />
          </svg>
          <h3 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "RushDriver" }}>
            Destaques SimRacing
          </h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {/* CONTAINER DE SCROLL COM BARRA VERMELHA */}
        {loading && highlights.length === 0 ? (
          <p className="text-gray-500 animate-pulse">⏳ A carregar destaques...</p>
        ) : (
          <div className="custom-scrollbar overflow-x-auto pb-4">
            <div className="flex gap-6 w-max"> {/* w-max garante que os itens ficam em linha */}
              {highlights.map((n, i) => (
                <a
                  key={i}
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-[280px] w-[280px] bg-neutral-900 border border-red-800 rounded-xl overflow-hidden shadow-md flex-shrink-0 relative hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={n.image || FALLBACK_IMAGE}
                    alt={n.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  />
                  <div className="p-4 h-36 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-sm line-clamp-2 mb-1 text-white">{n.title}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                         🕒 {formatDate(n.timestamp)}
                      </p>
                    </div>
                    <p className="text-xs text-red-400 font-bold">{n.source}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ====================== */}
      {/* OUTRAS NOTÍCIAS */}
      {/* ====================== */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-bold tracking-wide text-red-400" style={{ fontFamily: "RushDriver" }}>
            Outras Notícias
          </h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => handleFilterChange(c.key)}
              className={`px-4 py-1 rounded-full text-sm border transition-colors ${
                filter === c.key
                  ? "bg-red-600 border-red-700 text-white"
                  : "bg-neutral-800 border-neutral-700 hover:border-red-600 text-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading && feed.length === 0 ? (
           <p className="text-gray-500 animate-pulse text-center py-10">⏳ A atualizar feed...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((n, i) => (
              <a
                key={i}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-900 border border-red-800/50 hover:border-red-600 transition-all duration-300 rounded-xl p-4 shadow-lg hover:shadow-red-900/20 group flex flex-col"
              >
                <div className="overflow-hidden rounded-lg mb-3 relative">
                  <img
                    src={n.image || FALLBACK_IMAGE}
                    alt={n.title}
                    className="w-full h-44 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  />
                  <div className="absolute bottom-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-tl-lg font-bold">
                    {n.source}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-bold mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2">
                    {n.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>📅 {formatDate(n.timestamp)}</span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {n.description.replace(/<[^>]*>?/gm, "")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && filteredList.length === 0 && (
            <div className="text-center text-gray-500 py-10">
                Nenhuma notícia encontrada com este filtro hoje.
            </div>
        )}
      </div>
    </section>
  );
}
