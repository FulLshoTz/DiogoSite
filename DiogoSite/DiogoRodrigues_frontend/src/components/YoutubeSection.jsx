import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

export default function YoutubeSection() {
  const [info, setInfo] = useState(null);
  const [live, setLive] = useState(false);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  useEffect(() => {
    const load = async () => {
      try {
        const [infoRes, liveRes, videosRes] = await Promise.all([
          fetch(`${API_BASE}/youtube/channel-info`),
          fetch(`${API_BASE}/youtube/live-status`),
          fetch(`${API_BASE}/youtube/latest-videos?limit=3`)
        ]);

        if (!infoRes.ok || !liveRes.ok || !videosRes.ok)
          throw new Error("Erro ao carregar dados");

        const infoData = await infoRes.json();
        const liveData = await liveRes.json();
        const videosData = await videosRes.json();

        setInfo(infoData);
        setLive(liveData.is_live);
        setVideos(videosData.videos || []);
      } catch (e) {
        setError(e.message);
      }
    };

    load();
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">Erro: {error}</p>;
  if (!info) return <p className="text-center mt-10">A carregar dados do YouTube...</p>;

  return (
    <section className="max-w-6xl mx-auto mt-32 text-center">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={info.thumbnails?.high?.url}
            alt={info.title}
            className="w-24 h-24 rounded-full border-2 border-red-600"
          />
          <div className="text-left">
            <h2 className="text-2xl font-bold">{info.title}</h2>
            <p className="text-gray-400 text-sm">
              {info.stats?.subscriberCount} subs • {info.stats?.viewCount} views
            </p>
            <p
              className={`mt-1 font-semibold ${
                live ? "text-green-500" : "text-gray-400"
              }`}
            >
              {live ? "🟢 Online" : "⚪ Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition-transform hover:scale-105"
          >
            <FaYoutube className="text-xl" /> YouTube
          </a>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 px-4 py-2 rounded-lg text-white font-semibold transition-transform hover:scale-105"
          >
            <FaInstagram className="text-xl" /> Instagram
          </a>
        </div>
      </div>

      <h3 className="text-xl text-red-600 font-bold mb-6 uppercase tracking-wide">
        {live ? "🔴 Live Agora" : "🎬 Últimos Vídeos"}
      </h3>

      {!live && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900 border border-neutral-800 hover:border-red-600 hover:scale-105 transition-all rounded-xl overflow-hidden"
            >
              <img src={v.thumbnail} alt={v.title} className="w-full" />
              <p className="p-3 text-left text-sm font-semibold">{v.title}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
