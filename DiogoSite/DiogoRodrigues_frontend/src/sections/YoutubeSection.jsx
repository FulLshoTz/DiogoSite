import React, { useState, useEffect } from "react";
import ChannelHeader from "../components/ChannelHeader";

export default function YoutubeSection() {
  // placeholders instantâneos (mostram logo)
  const [videos, setVideos] = useState([
    { id: "mErQBHBnQ0U", title: "8h Bahrain | TREINO | Diogo Rodrigues", publishedAt: "2025-11-06T11:55:18Z" },
    { id: "BiDkc-i6ICs", title: "8h Bahrain | TREINO | Diogo Rodrigues", publishedAt: "2025-11-05T11:59:18Z" },
    { id: "CwDFK3weUBE", title: "ROUND 2 | LMU CHAMPIONSHIP Interlagos | LMGT3 Fixed | Diogo Rodrigues", publishedAt: "2025-08-06T05:42:20Z" }
  ]);
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos");
        const data = await res.json();

        // LIVE primeiro (qualquer formato razoável)
        const liveObj = data?.live || null;
        const liveId = liveObj?.id || data?.liveId || null;

        if (liveId) {
          setLive({
            id: liveId,
            title: liveObj?.title || "🔴 Live no ar",
          });
          setVideos([]); // limpa vídeos quando está live
        } else if (Array.isArray(data?.videos) && data.videos.length) {
          setVideos(data.videos.slice(0, 3));
          setLive(null);
        }
      } catch (err) {
        console.warn("⚠️ Backend não respondeu — a mostrar placeholders");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <ChannelHeader />
      <section className="max-w-7xl mx-auto text-white px-4 py-6 mt-0">
        {/* Título com ícone + linha */}
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-red-600" viewBox="0 0 576 512" fill="currentColor">
            <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z"/>
          </svg>
          <h3 className="text-2xl font-bold tracking-wide">Últimos Vídeos</h3>
          <div className="flex-1 h-[2px] bg-red-600"></div>
        </div>

        {loading && <p className="text-gray-400 mb-6">A carregar do YouTube…</p>}

        {/* Se estiver LIVE → mostra só a live (autoplay) */}
        {live ? (
          <div className="rounded-xl overflow-hidden border border-red-700/40 shadow-lg">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${live.id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
                title={live.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 text-left">
              <p className="font-semibold">{live.title}</p>
              <p className="text-sm text-red-400">🔴 Em direto</p>
            </div>
          </div>
        ) : (
          // Senão → 3 vídeos (cada um reproduz embutido; podes ver vários em simultâneo)
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {videos.map((v) => (
              <div key={v.id} className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-red-700/30">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1&playsinline=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 text-left">
                  <p className="font-semibold mb-1">{v.title}</p>
                  <p className="text-sm text-gray-400">{formatDate(v.publishedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
