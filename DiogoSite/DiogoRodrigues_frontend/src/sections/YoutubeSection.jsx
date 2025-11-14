import React, { useState, useEffect } from "react";
import ChannelHeader from "../components/ChannelHeader";

const API_BASE = "https://diogorodrigues-backend.onrender.com";

export default function YoutubeSection() {
  const fallbackVideos = [
    { id: "akkgj63j5rg", title: "PTracerz CUP 2025" },
    { id: "95r7yKBo-4w", title: "GT3 VS ORT - Corrida resistência" },
    { id: "gupDgHpu3DA", title: "Cacetada no Zurga (Renault Clio)" },
  ];

  const [videos, setVideos] = useState(fallbackVideos);
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/latest-videos`);
        const data = await res.json();

        if (data.live) {
          setLive(data.live);
          setVideos([]);
        } else if (data.videos.length > 0) {
          setVideos(data.videos.slice(0, 3));
        }
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const sectionTitle = live ? "Ao vivo" : "Últimos Vídeos";

  return (
    <>
      <ChannelHeader />

      <section className="max-w-7xl mx-auto text-white px-4 py-6 mt-2">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-red-600" viewBox="0 0 576 512" fill="currentColor">
            <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z"/>
          </svg>
          <h3 className="text-2xl font-bold tracking-wide">{sectionTitle}</h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {loading && <p>A carregar…</p>}

        {/* LIVE BLOCK GRANDE */}
        {live ? (
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-red-700/40 shadow-xl bg-black/40">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${live.id}?autoplay=1&mute=1`}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-lg">{live.title}</p>
              <p className="text-sm text-red-400">🔴 Ao vivo</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {videos.map((v) => (
              <div key={v.id} className="bg-neutral-900 rounded-xl overflow-hidden border border-red-700/30">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
