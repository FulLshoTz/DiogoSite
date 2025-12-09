/* 🔴 REGRAS DO HEADER (TOP BAR):
   1. API: Faz fetch a '/api/live-status' e '/api/channel-info' ao iniciar.
   2. RESPONSIVIDADE: Ajusta o tamanho do logo e texto entre Mobile (sm:) e Desktop.
   3. STATUS: Mostra a bola vermelha a piscar (animate-pulse/live-ring) APENAS se isLive for true.
*/
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

// URL do backend (mantive o que tinhas)
const API_URL = "https://diogorodrigues-backend.onrender.com";

export default function Header() {
  const [stats, setStats] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // 1. Buscar STATUS DA LIVE (Nova rota separada)
        // O backend novo separou a verificação de live dos vídeos normais
        const liveRes = await fetch(`${API_URL}/api/live-status`);
        const liveData = await liveRes.json();
        setIsLive(liveData.is_live);

        // 2. Buscar ESTATÍSTICAS (Nova rota organizada)
        // A rota antiga era /channel-stats, a nova é /channel-info
        const infoRes = await fetch(`${API_URL}/api/channel-info`);
        const infoData = await infoRes.json();

        // O formato dos dados mudou ligeiramente no novo backend,
        // por isso precisamos de mapear corretamente aqui:
        if (infoData.stats) {
          setStats({
            subs: infoData.stats.subscriberCount,
            views: infoData.stats.viewCount,
            videos: infoData.stats.videoCount,
          });
        }
      } catch (err) {
        console.error("Erro Header:", err);
      }
    }
    load();
  }, []);

  const links = [
    { to: "/", label: "INÍCIO" },
    { to: "/treino-analise", label: "TREINO & ANÁLISE" },
    { to: "/definicoes", label: "DEFINIÇÕES" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-red-700/40 z-50">
      {/* WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-4">
          {/* LOGO + INFO */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* LOGO RESPONSIVO */}
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl border border-red-700 shadow-xl"
            />
            <div className="leading-tight">
              {/* TÍTULO RESPONSIVO */}
              <h1
                className="text-lg sm:text-3xl font-extrabold text-white leading-tight"
                style={{
                  fontFamily: "RushDriver",
                  letterSpacing: "0.04em",
                }}
              >
                FulLshoT <span className="text-red-400">|</span> Diogo Rodrigues
              </h1>

              {/* STATS compactas */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-red-200/80 mt-1">
                <span>{stats?.subs || "..."} subs</span>
                <span>·</span>
                <span>{stats?.views || "..."} views</span>
                <span>·</span>
                <span>{stats?.videos || "..."} vídeos</span>
              </div>

              {/* LIVE/Offline */}
              <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm">
                <span
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                    isLive ? "bg-red-500 live-ring" : "bg-neutral-500"
                  }`}
                />
                <span className={`${isLive ? "text-red-400" : "text-neutral-400"}`}>
                  {isLive ? " 🔴  Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* BOTÕES – RESPONSIVOS */}
          <div className="flex gap-2 sm:gap-3">
            <a
              href="https://www.youtube.com/@FulLshoT"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 sm:px-5 sm:py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs sm:text-sm font-semibold text-white shadow-md"
            >
              YouTube
            </a>
            <a
              href="https://instagram.com/fullshotz"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 sm:px-5 sm:py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-xs sm:text-sm font-semibold text-white shadow-md"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* NAVIGATION – RESPONSIVO */}
        <nav className="flex gap-4 sm:gap-10 mt-3 sm:mt-5 pl-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `uppercase text-xs sm:text-sm tracking-wider font-semibold ${
                  isActive
                    ? "text-red-500 border-b-2 border-red-500 pb-1"
                    : "text-gray-300 hover:text-red-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
