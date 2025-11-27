import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NoticiasSection() {
  const [highlights, setHighlights] = useState([]);
  const [feed, setFeed] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function load() {
      const res = await fetch("https://diogorodrigues-backend.onrender.com/api/simracing-news");
      const data = await res.json();
      setHighlights(data.highlights);
      setFeed(data.all);
    }
    load();
  }, []);

  const categories = [
    { key: "ALL", label: "Todas" },
    { key: "LMU", label: "LMU" },
    { key: "WRC", label: "WRC" },
    { key: "ASSETTO", label: "Assetto Corsa" },
    { key: "IRACING", label: "iRacing" },
    { key: "HARDWARE", label: "Hardware" },
  ];

  const filtered = feed.filter(n => {
    if (filter === "ALL") return true;
    const text = (n.title + n.description).toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  return (
    <section className="max-w-7xl mx-auto text-white px-4 py-10 space-y-12">

      {/* ====================== */}
      {/* SECÇÃO 1 — Destaques */}
      {/* ====================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-red-600" viewBox="0 0 576 512">
            <path d="M480 32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h384c53 0 96-43 96-96V128C576 75 533 32 480 32z"/>
          </svg>

          <h3
            className="text-2xl font-bold tracking-wide"
            style={{ fontFamily: "RushDriver" }}
          >
            Destaques SimRacing
          </h3>

          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {/* Scroll estilo Netflix */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {highlights.map((n, i) => (
            <motion.a
              key={i}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              className="min-w-[260px] bg-neutral-900 border border-red-800 rounded-xl overflow-hidden shadow-md"
            >
              {n.image && (
                <img
                  src={n.image}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <p className="font-bold mb-1">{n.title}</p>
                <p className="text-xs text-red-400">{n.source}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* ====================== */}
      {/* SECÇÃO 2 — Feed Completo */}
      {/* ====================== */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h3
            className="text-xl font-bold tracking-wide text-red-400"
            style={{ fontFamily: "RushDriver" }}
          >
            Notícias Completa
          </h3>

          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {/* FILTRO */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`
                px-4 py-1 rounded-full text-sm border 
                ${filter === c.key 
                  ? "bg-red-600 border-red-700" 
                  : "bg-neutral-800 border-neutral-700 hover:border-red-600"}
              `}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((n, i) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900 border border-red-800 hover:border-red-600 transition-all duration-300 rounded-xl p-5 shadow-md hover:shadow-red-900/20 transform hover:-translate-y-1 hover:scale-105"
            >
              {n.image && (
                <img
                  src={n.image}
                  className="w-full h-44 object-cover rounded-md mb-3"
                />
              )}

              <h4 className="font-bold mb-2">{n.title}</h4>
              <p className="text-gray-400 text-sm line-clamp-3">{n.description}</p>
              <p className="text-xs text-red-400 mt-3">{n.source}</p>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
}
