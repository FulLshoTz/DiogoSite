import React, { useState, useEffect } from "react";
import ChannelHeader from "../components/ChannelHeader";

export default function YoutubeSection() {
  const [videos, setVideos] = useState([
    // Placeholders com vídeos antigos
    { id: "mErQBHBnQ0U", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/mErQBHBnQ0U/hqdefault.jpg", publishedAt: "2025-11-06T11:55:18Z" },
    { id: "BiDkc-i6ICs", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/BiDkc-i6ICs/hqdefault.jpg", publishedAt: "2025-11-05T11:59:18Z" },
    { id: "CwDFK3weUBE", title: "ROUND 2 | LMU CHAMPIONSHIP Interlagos | LMGT3 Fixed | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/CwDFK3weUBE/hqdefault.jpg", publishedAt: "2025-08-06T05:42:20Z" }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos");
        const data = await res.json();
        if (data?.videos?.length) setVideos(data.videos.slice(0, 3));
      } catch (err) {
        console.warn("⚠️ Backend não respondeu — a mostrar placeholders");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <ChannelHeader />
      <section className="max-w-7xl mx-auto text-white px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-red-600" viewBox="0 0 576 512" fill="currentColor">
            <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z"/>
          </svg>
          <h3 className="text-2xl font-bold text-white tracking-wide">Últimos Vídeos</h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {loading && <p className="text-gray-400 mb-6">A carregar vídeos...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div key={v.id} className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-red-700/30">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 text-left">
                <p className="font-semibold mb-1">{v.title}</p>
                <p className="text-sm text-gray-400">
                  {formatDate(v.publishedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
