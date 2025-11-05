import React, { useEffect, useState } from "react";

export default function Home() {
  const [info, setInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [live, setLive] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  useEffect(() => {
    setVisible(true); // faz fade-in do layout assim que carrega a página

    const load = async () => {
      try {
        const [infoRes, liveRes, videosRes] = await Promise.all([
          fetch(`${API_BASE}/youtube/channel-info`),
          fetch(`${API_BASE}/youtube/live-status`),
          fetch(`${API_BASE}/youtube/latest-videos?limit=3`),
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

  return (
    <section
      className={`pt-28 max-w-7xl mx-auto transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* CABEÇALHO */}
      <div className="flex flex-wrap justify-between items-center mb-8 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-4">
          {info ? (
            <img
              src={info.thumbnails?.high?.url}
              alt="Canal"
              className="w-20 h-20 rounded-full border-2 border-red-600"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-neutral-800 animate-pulse" />
          )}
          <div>
            <h2 className="text-3xl font-bold text-white">
              {info ? info.title : "FulLshoT"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {info
                ? `${info.stats.subscriberCount} subs • ${info.stats.viewCount} views`
                : "A carregar..."}
            </p>
            <p
              className={`mt-2 font-semibold ${
                live ? "text-green-500" : "text-gray-500"
              }`}
            >
              {live ? "🟢 Online" : "⚫ Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-6 mt-6 md:mt-0">
          <a
            href="https://www.youtube.com/@FulLShoT"
            target="_blank"
            rel="noreferrer"
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition"
          >
            YouTube
          </a>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:opacity-90 px-5 py-2 rounded-lg font-semibold transition"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* CONTEÚDO */}
      {error && (
        <p className="text-red-500 text-center mt-10">
          Erro: {error} — tenta novamente mais tarde.
        </p>
      )}

      {!error && (
        <>
          {live && (
            <div className="rounded-xl overflow-hidden shadow-lg border border-red-700 mb-8">
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/live_stream?channel=${info?.id}`}
                title="Live"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {!live && (
            <>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Últimos Vídeos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.length > 0
                  ? videos.map((v) => (
                      <a
                        key={v.id}
                        href={`https://www.youtube.com/watch?v=${v.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="card group"
                      >
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="mt-2 font-semibold text-white group-hover:text-red-500 transition-colors">
                          {v.title}
                        </p>
                      </a>
                    ))
                  : [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="card h-60 animate-pulse bg-neutral-900 border border-neutral-800"
                      />
                    ))}
              </div>
            </>
          )}
        </>
      )}

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
        <div className="card text-center">
          <p className="text-4xl font-bold text-red-500">35</p>
          <p className="text-gray-400">Corridas</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-red-500">12</p>
          <p className="text-gray-400">Circuitos</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-red-500">Top 5</p>
          <p className="text-gray-400">Melhor Resultado</p>
        </div>
      </div>
    </section>
  );
}
