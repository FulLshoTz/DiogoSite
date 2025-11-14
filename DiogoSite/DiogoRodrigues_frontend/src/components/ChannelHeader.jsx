import React, { useEffect, useState } from "react";

const API_BASE = "https://diogorodrigues-backend.onrender.com";

export default function ChannelHeader() {
  const [channel, setChannel] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [chRes, vidsRes] = await Promise.all([
          fetch(`${API_BASE}/api/channel`),
          fetch(`${API_BASE}/api/latest-videos`),
        ]);

        const ch = await chRes.json();
        const vdata = await vidsRes.json();

        setChannel(ch);
        setIsLive(!!vdata.live);
      } catch (err) {
        console.error("Erro a carregar header:", err);
      }
    }

    load();
  }, []);

  const name = "Diogo Rodrigues";

  return (
    <header className="bg-red-900/20 border-b border-red-900/40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/60 border border-red-700/60 flex items-center justify-center">
            {channel?.avatar ? (
              <img
                src={channel.avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-red-300">DR</span>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">{name}</h1>
            <p className="text-sm text-red-200/80">
              Simracing · Le Mans Ultimate · EA WRC
            </p>

            <div className="flex items-center gap-2 mt-1 text-sm">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isLive ? "bg-red-500" : "bg-neutral-500"
                }`}
              />
              <span className={isLive ? "text-red-400" : "text-neutral-400"}>
                {isLive ? "Ao vivo" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-sm font-semibold text-white"
          >
            YouTube
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-sm font-semibold text-white"
          >
            Instagram
          </a>
        </div>
      </div>
    </header>
  );
}
