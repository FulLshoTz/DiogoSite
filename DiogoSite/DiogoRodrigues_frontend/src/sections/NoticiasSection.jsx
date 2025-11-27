import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Imagem padrão caso a notícia não tenha (podes trocar por um URL teu)
const FALLBACK_IMAGE = "https://placehold.co/600x400/1a1a1a/red?text=SimRacing";

export default function NoticiasSection() {
  const [highlights, setHighlights] = useState([]);
  const [feed, setFeed] = useState([]);
  
  // 3. Guardar preferências localmente (inicia com o valor guardado ou "ALL")
  const [filter, setFilter] = useState(() => localStorage.getItem("newsFilter") || "ALL");
  
  // 2. Paginação: Começa por mostrar 6 notícias
  const [visibleCount, setVisibleCount] = useState(6);
  
  const carouselRef = useRef();

  // Função de carregar dados com tratamento de erro (9.)
  async function load() {
    try {
      const res = await fetch("https://diogorodrigues-backend.onrender.com/api/simracing-news");
      
      // 9. Tratamento de erros HTTP
      if (!res.ok) {
        console.error("Erro ao buscar notícias:", res.status);
        return;
      }

      const data = await res.json();
      setHighlights(data.highlights || []);
      setFeed(data.all || []);
    } catch (err) {
      console.error("Erro de conexão:", err);
    }
  }

  useEffect(() => {
    load();
    // 1. Auto-refresh a cada 15 minutos (15 * 60 * 1000)
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Atualiza o LocalStorage sempre que o filtro mudar
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    localStorage.setItem("newsFilter", newFilter);
    setVisibleCount(6); // Reseta a paginação ao trocar filtro
  };

  const categories = [
    { key: "ALL", label: "Todas" },
    { key: "LMU", label: "LMU" },
    { key: "WRC", label: "WRC" },
    { key: "ASSETTO", label: "Assetto Corsa" },
    { key: "IRACING", label: "iRacing" },
    { key: "HARDWARE", label: "Hardware" },
  ];

  // Filtra as notícias
  const filteredList = feed.filter((n) => {
    if (filter === "ALL") return true;
    const text = (n.title + n.description).toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  // Lista visível baseada na paginação
  const visibleList = filteredList.slice(0, visibleCount);

  return (
    <section className="max-w-7xl mx-auto text-white px-4 py-8 space-y-12">
      
      {/* ====================== */}
      {/* SECÇÃO 1 — Destaques */}
      {/* ====================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          {/* 6. Corrigir Ícone SVG (adicionado fill-current text-red-600) */}
          <svg className="w-6 h-6 text-red-600 fill-current" viewBox="0 0 576 512">
            <path d="M480 32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h384c53 0 96-43 96-96V128C576 75 533 32 480 32z" />
          </svg>
          <h3 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "RushDriver" }}>
            Destaques SimRacing
          </h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {/* 8. Scroll estilo Netflix (com drag constraints) */}
        <motion.div className="cursor-grab overflow-hidden" ref={carouselRef}>
          <motion.div 
            className="flex gap-6"
            drag="x"
            dragConstraints={{ right: 0, left: -1000 }} // Ajuste simples para permitir scroll
            whileTap={{ cursor: "grabbing" }}
          >
            {highlights.map((n, i) => (
              <motion.a
                key={i}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                className="min-w-[280px] w-[280px] bg-neutral-900 border border-red-800 rounded-xl overflow-hidden shadow-md flex-shrink-0"
              >
                {/* 7. Fallback de Imagem */}
                <img
                  src={n.image || FALLBACK_IMAGE}
                  alt={n.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
                <div className="p-4 h-32 flex flex-col justify-between">
                  <p className="font-bold text-sm line-clamp-2">{n.title}</p>
                  <p className="text-xs text-red-400 mt-2">{n.source}</p>
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
            Feed de Notícias
          </h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {/* FILTRO */}
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

        {/* GRID (10. Design Mobile Responsivo já incluído com grid-cols-1 sm:grid-cols-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleList.map((n, i) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900 border border-red-800/50 hover:border-red-600 transition-all duration-300 rounded-xl p-4 shadow-lg hover:shadow-red-900/20 group"
            >
              <div className="overflow-hidden rounded-lg mb-3">
                <img
                  src={n.image || FALLBACK_IMAGE}
                  alt={n.title}
                  className="w-full h-44 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
              </div>
              <h4 className="font-bold mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2">
                {n.title}
              </h4>
              <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                {n.description.replace(/<[^>]*>?/gm, "")} {/* Remove tags HTML simples da descrição */}
              </p>
              <p className="text-xs text-red-500 font-semibold">{n.source}</p>
            </a>
          ))}
        </div>

        {/* 2. Botão MOSTRAR MAIS */}
        {visibleCount < filteredList.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 bg-neutral-800 hover:bg-red-600 border border-red-800 rounded-full text-white font-bold transition-all shadow-lg hover:shadow-red-500/50"
            >
              Mostrar Mais Notícias
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
