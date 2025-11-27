import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Imagem padrão
const FALLBACK_IMAGE = "https://placehold.co/600x400/1a1a1a/red?text=SimRacing";

export default function NoticiasSection() {
  const [highlights, setHighlights] = useState([]);
  const [feed, setFeed] = useState([]); // Feed bruto (todas as notícias)
  const [filter, setFilter] = useState(() => localStorage.getItem("newsFilter") || "ALL");
  const carouselRef = useRef();

  // Função para formatar a data (ex: 27/11 - 15:30)
  const formatDate = (unixTimestamp) => {
    if (!unixTimestamp) return "";
    const date = new Date(unixTimestamp * 1000); // Converter segundos para milissegundos
    
    // Se for hoje, mostra apenas as horas
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();

    if (isToday) {
      return `Hoje, ${date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
    }
    
    // Se for outro dia
    return date.toLocaleDateString("pt-PT", { 
      day: "2-digit", 
      month: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  async function load() {
    try {
      const res = await fetch("https://diogorodrigues-backend.onrender.com/api/simracing-news");
      if (!res.ok) return;
      const data = await res.json();
      setHighlights(data.highlights || []);
      setFeed(data.all || []);
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15 * 60 * 1000);
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

  // 1. Lógica de Deduplicação (Anti-Repetição)
  // Criamos um conjunto com os Links dos destaques para filtrar o feed de baixo
  const highlightLinks = new Set(highlights.map(h => h.url));

  // Filtra as notícias
  const filteredList = feed.filter((n) => {
    // 1. Remove se já estiver nos destaques
    if (highlightLinks.has(n.url)) return false;

    // 2. Aplica o filtro de categoria
    if (filter === "ALL") return true;
    const text = (n.title + n.description).toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  return (
    <section className="max-w-7xl mx-auto text-white px-4 py-8 space-y-12">
      
      {/* ====================== */}
      {/* SECÇÃO 1 — Destaques */}
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

        {/* Scroll Horizontal (Netflix style) */}
        <motion.div className="cursor-grab overflow-hidden" ref={carouselRef}>
          <motion.div 
            className="flex gap-6"
            drag="x"
            dragConstraints={{ right: 0, left: -1200 }} 
            whileTap={{ cursor: "grabbing" }}
          >
            {highlights.map((n, i) => (
              <motion.a
                key={i}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                className="min-w-[280px] w-[280px] bg-neutral-900 border border-red-800 rounded-xl overflow-hidden shadow-md flex-shrink-0 relative"
              >
                <img
                  src={n.image || FALLBACK_IMAGE}
                  alt={n.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
                <div className="p-4 h-36 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-sm line-clamp-2 mb-1">{n.title}</p>
                    {/* DATA NO DESTAQUE */}
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                       🕒 {formatDate(n.timestamp)}
                    </p>
                  </div>
                  <p className="text-xs text-red-400 font-bold">{n.source}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ====================== */}
      {/* SECÇÃO 2 — Feed Completo */}
      {/* ====================== */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-bold tracking-wide text-red-400" style={{ fontFamily: "RushDriver" }}>
            Outras Notícias
          </h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {/* FILTROS */}
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

        {/* GRID INFINITA (Sem paginação, mostra tudo o que o filtro permitir) */}
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
                {/* Badge da Fonte sobre a imagem */}
                <div className="absolute bottom-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-tl-lg font-bold">
                  {n.source}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2">
                  {n.title}
                </h4>
                
                {/* DATA E HORA */}
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
        
        {/* Mensagem se não houver notícias */}
        {filteredList.length === 0 && (
            <div className="text-center text-gray-500 py-10">
                Nenhuma notícia encontrada com este filtro hoje.
            </div>
        )}

      </div>
    </section>
  );
}
