import React, { useEffect, useState } from "react";

const API_BASE = "https://diogorodrigues-backend.onrender.com";

export default function ChannelHeader() {
  const [channel, setChannel] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const chRes = await fetch(`${API_BASE}/api/channel`);
        const vidRes = await fetch(`${API_BASE}/api/latest-videos`);

        const ch = await chRes.json();
        const vids = await vidRes.json();

        setChannel(ch);
        setIsLive(!!vids.live);
      } catch (err) {
        console.error("Erro no header:", err);
      }
    }

    load();
  }, []);

  const name = "FulLshoT | Diogo Rodrigues";

  return (
    <header className="bg-red-900/20 border-b border-red-900/40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Avatar + Nome + Info */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/60 border border-red-700/60">
            {channel?.avatar ? (
              <img src={channel.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-red-300">
                DR
              </div>
            )}
          </div>

          {/* NOME + STATS */}
          <div>
            <h1 className="text-xl font-bold text-white">{name}</h1>

            <p className="text-sm text-red-200/80">
              {channel?.subs || "???"} subs · {channel?.views || "???"}
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

        {/* BOTÕES */}
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
