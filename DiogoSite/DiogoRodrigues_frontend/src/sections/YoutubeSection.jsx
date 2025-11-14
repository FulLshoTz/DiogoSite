import React, { useState, useEffect } from "react";
import ChannelHeader from "../components/ChannelHeader";

export default function YoutubeSection() {
  // 🔥 3 vídeos fallback (mostram SEMPRE alguma coisa)
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
        const res = await fetch(
          "https://diogorodrigues-backend.onrender.com/api/latest-videos"
        );
        const data = await res.json();

        console.log("📦 Latest videos:", data);

        if (!data || !Array.isArray(data.videos)) {
          // resposta marada → mantemos fallback
          setLoading(false);
          return;
        }

        if (data.live) {
          // prioridade: live
          setLive(data.live);
          setVideos([]);
        } else if (data.videos.length > 0) {
          // se houver vídeos → substitui fallback
          setVideos(data.videos.slice(0, 3));
          setLive(null);
        }
        // se length === 0 → não tocamos em videos (fica fallback)
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
        // erro → mantemos fallback
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <>
      <ChannelHeader />

      <section className="max-w-7xl mx-auto text-white px-4 py-6 mt-2">
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="w-6 h-6 text-red-600"
            viewBox="0 0 576 512"
            fill="currentColor"
          >
            <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z" />
          </svg>
          <h3 className="text-2xl font-bold tracking-wide">Últimos Vídeos</h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {loading && <p>A carregar…</p>}

        {live ? (
          <div className="rounded-xl overflow-hidden border border-red-700/40 shadow-lg">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${live.id}?autoplay=1&mute=1`}
                title={live.title}
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <p className="font-semibold">{live.title}</p>
              <p className="text-sm text-red-400">🔴 Em direto</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {videos.map((v) => (
              <div
                key={v.id}
                className="bg-neutral-900 rounded-xl overflow-hidden border border-red-700/30"
              >
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allowFullScreen
                  />
                </div>
                {v.title && (
                  <div className="p-4">
                    <p className="font-semibold">{v.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
