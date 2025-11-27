import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const [stats, setStats] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const status = await fetch("https://diogorodrigues-backend.onrender.com/api/latest-videos").then(r => r.json());
        const s = await fetch("https://diogorodrigues-backend.onrender.com/api/channel-stats").then(r => r.json());

        setIsLive(!!status.live);
        setStats(s);
      } catch (err) {
        console.error("Erro Header:", err);
      }
    }

    load();
  }, []);

  const links = [
    { to: "/", label: "INÍCIO" },
    { to: "/corridas", label: "CORRIDAS" },
    { to: "/circuitos", label: "CIRCUITOS" },
    { to: "/definicoes", label: "DEFINIÇÕES" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-red-700/50 z-50 py-4">
      <div className="max-w-7xl mx-auto px-8">

        <div className="flex items-center justify-between">

          {/* LOGO + INFO */}
          <div className="flex items-center gap-6">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-xl border border-red-700 shadow-xl"
            />

            <div>
              <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "RushDriver" }}>
                FulLshoT <span className="text-red-400">|</span> Diogo Rodrigues
              </h1>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-red-200/80 mt-1">
                <span>{stats?.subs || "???"} subs</span>
                <span>·</span>
                <span>{stats?.views || "???"} views</span>
                <span>·</span>
                <span>{stats?.videos || "???"} vídeos</span>
              </div>

              {/* Live / Offline */}
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-3 h-3 rounded-full ${isLive ? "bg-red-500" : "bg-neutral-500"}`} />
                <span className={`${isLive ? "text-red-400" : "text-neutral-400"} text-sm`}>
                  {isLive ? "🔴 Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* SOCIAL BUTTONS */}
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
              href="https://instagram.com/fullshotz"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-sm font-semibold text-white shadow-md"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex gap-10 mt-5 pl-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `uppercase text-sm tracking-wider font-semibold ${
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
