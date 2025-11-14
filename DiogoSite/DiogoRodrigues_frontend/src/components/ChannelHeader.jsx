import React, { useState, useEffect } from "react";

export default function ChannelHeader() {
  const [channel, setChannel] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallback = {
    title: "FulLshoT | Diogo Rodrigues",
    avatar: "https://yt3.ggpht.com/cg4Dfb7uuvYU48SCLabYtHJ8BZ5zRdeszrMJIN0Mm6MpVlH_PnHZPDEzE6PlvR4W6mbr-q2d=s800-c-k-c0x00ffffff-no-rj",
    subs: "282",
    views: "178986",
  };

  useEffect(() => {
    async function loadChannel() {
      try {
        const res = await fetch("https://diogorodrigues-backend.onrender.com/api/channel");
        const data = await res.json();
        setChannel(data);
      } catch {
        setChannel(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadChannel();
  }, []);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const r = await fetch("https://diogorodrigues-backend.onrender.com/api/latest-videos");
        const d = await r.json();
        setIsLive(Boolean(d.live));
      } catch {
        setIsLive(false);
      }
    };

    checkLive();
    const id = setInterval(checkLive, 60000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <section className="bg-[#200] text-white py-5 rounded-xl mx-4 mt-2 mb-0">
        <div className="text-center">A carregar…</div>
      </section>
    );
  }

  const avatar = channel?.avatar || fallback.avatar;

  return (
    <section className="bg-gradient-to-r from-[#3b0000] via-[#220000] to-[#0b0000] text-white py-5 rounded-xl border border-red-900 shadow-md mx-4 mt-2 mb-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img src={avatar} className="w-20 h-20 rounded-full border border-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-red-400">{channel.title}</h2>
            <p>{channel.subs} subs • {channel.views} visualizações</p>
            <p className={`mt-1 text-sm ${isLive ? "text-green-400" : "text-gray-400"}`}>
              ● {isLive ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            YouTube
          </a>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            className="bg-pink-600 px-4 py-2 rounded-lg"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
