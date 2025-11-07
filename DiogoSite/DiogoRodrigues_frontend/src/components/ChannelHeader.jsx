import React, { useState, useEffect } from "react";

export default function ChannelHeader() {
  const [channel, setChannel] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadChannel() {
    try {
      const res = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/channel-info");
      const data = await res.json();
      setChannel(data);
    } catch (e) {
      console.warn("⚠️ Erro ao carregar canal:", e);
    } finally {
      setLoading(false);
    }
  }

  async function checkLive() {
    try {
      const res = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos");
      const data = await res.json();
      const liveId =
        data?.live?.id ||
        data?.liveId ||
        (Array.isArray(data?.videos) && data.videos[0]?.isLive ? data.videos[0].id : null);

      setIsLive(Boolean(liveId));
    } catch {
      try {
        const res2 = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/live");
        const data2 = await res2.json();
        setIsLive(Boolean(data2?.id || data2?.liveId));
      } catch {
        setIsLive(false);
      }
    }
  }

  useEffect(() => {
    loadChannel();
    checkLive();
    const id = setInterval(checkLive, 60000);
    return () => clearInterval(id);
  }, []);

  const Wrapper = ({ children }) => (
    <section className="bg-gradient-to-r from-black via-[#200000] to-[#3b0000] text-white py-4 rounded-xl border border-red-900 shadow-md mx-4 mb-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-6">
        {children}
      </div>
    </section>
  );

  if (loading) {
    return (
      <Wrapper>
        <p className="text-center w-full">A carregar informações do canal…</p>
      </Wrapper>
    );
  }

  if (!channel) {
    return (
      <Wrapper>
        <p className="text-center w-full">Erro a carregar canal.</p>
      </Wrapper>
    );
  }

  const stats = channel.stats || {};
  const thumb = channel.thumbnails?.high?.url || channel.thumbnails?.default?.url || "";
  const title = channel.title || "Canal";

  return (
    <Wrapper>
      {/* Esquerda: avatar + info */}
      <div className="flex items-center gap-4">
        <div className={`rounded-full p-[1px] bg-red-600`}>
          <img
            src={thumb}
            alt={title}
            className="w-20 h-20 rounded-full border border-red-600"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-red-400">{title}</h2>
          <p className="text-sm opacity-90">
            {stats.subscriberCount} subs • {stats.viewCount} visualizações
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400" : "bg-gray-400"}`}
            />
            <span className="text-sm">{isLive ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* Direita: botões */}
      <div className="flex gap-4">
        <a
          href="https://www.youtube.com/@FulLshoT"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-500 transition-transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-5 h-5" fill="currentColor">
            <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z" />
          </svg>
          YouTube
        </a>

        <a
          href="https://www.instagram.com/diofdx"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg transition-transform hover:scale-105"
          style={{
            background:
              "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5" fill="currentColor">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm146.4-25.3a26.8 26.8 0 1 1 0 53.6 26.8 26.8 0 0 1 0-53.6zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
          Instagram
        </a>
      </div>
    </Wrapper>
  );
}
