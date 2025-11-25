import React, { useEffect, useState } from "react";

export default function ChannelHeader() {
  const [stats, setStats] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Stats reais
        const s = await fetch("https://diogorodrigues-backend.onrender.com/api/channel-stats").then(r => r.json());

        // Live status
        const v = await fetch("https://diogorodrigues-backend.onrender.com/api/latest-videos").then(r => r.json());
        setIsLive(!!v.live);

        setStats(s);
      } catch (err) {
        console.error("Erro no header:", err);
      }
    }

    load();
  }, []);

  return (
    <header className="w-full bg-black/40 border-b border-red-800/40 py-6 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* BLOCO ESQUERDO */}
        <div className="flex items-center gap-6">

          {/* LOGO GRANDE */}
          <img
            src="/logo.png"
            className="w-20 h-20 rounded-xl border border-red-700 shadow-lg"
            alt="Logo"
          />

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              FulLshoT <span className="text-red-400">|</span> Diogo Rodrigues
            </h1>

            <div className="flex items-center gap-4 text-sm text-red-200/80 mt-1">
              <span>{stats?.subs || "???"} subs</span>
              <span>·</span>
              <span>{stats?.views || "???"} views</span>
              <span>·</span>
              <span>{stats?.videos || "???"} vídeos</span>
            </div>

            {/* ESTADO */}
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className={`w-3 h-3 rounded-full ${isLive ? "bg-red-500" : "bg-neutral-500"}`} />
              <span className={`${isLive ? "text-red-400" : "text-neutral-400"}`}>
                {isLive ? "🔴 Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3">
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-sm font-semibold text-white shadow-md"
          >
            YouTube
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-sm font-semibold text-white shadow-md"
          >
            Instagram
          </a>
        </div>
      </div>
    </header>
  );
}
