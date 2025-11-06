import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

export default function YoutubeSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(null); // guarda o ID do vídeo a tocar

  useEffect(() => {
    async function fetchData() {
      try {
        const [resInfo, resVideos] = await Promise.all([
          fetch("https://diogorodrigues-backend.onrender.com/api/youtube/channel-info"),
          fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos"),
        ]);

        if (!resInfo.ok || !resVideos.ok) {
          throw new Error("Falha ao buscar dados do YouTube");
        }

        const info = await resInfo.json();
        const videosData = await resVideos.json();

        // Ordenar vídeos por data e limitar a 3
        const orderedVideos = (videosData?.videos || [])
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, 3);

        // Verificar se o canal está em direto
        const isLive = info?.liveBroadcastContent === "live";

        setData({
          title: info?.title || "Canal",
          subs: info?.stats?.subscriberCount || 0,
          views: info?.stats?.viewCount || 0,
          thumb:
            info?.thumbnails?.high?.url ||
            info?.thumbnails?.medium?.url ||
            info?.thumbnails?.default?.url ||
            "",
          isLive,
          videos: orderedVideos,
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar dados do YouTube");
      }
    }

    fetchData();
  }, []);

  if (error)
    return (
      <section className="text-center py-16 text-red-500 font-semibold">
        {error}
      </section>
    );

  if (!data)
    return (
      <section className="text-center py-16 text-gray-400">
        A carregar dados do YouTube...
      </section>
    );

  const { title, subs, views, thumb, videos, isLive } = data;

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4">
      {/* Header do canal */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          {thumb && (
            <img
              src={thumb}
              alt={title}
              className="w-20 h-20 rounded-full border-2 border-red-600"
            />
          )}
          <div className="text-left">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-400 text-sm">
              {subs} subs • {views} views
            </p>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  isLive ? "bg-red-600 animate-pulse" : "bg-gray-500"
                }`}
              ></span>
              {isLive ? "Ao vivo agora 🔴" : "Offline"}
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
          >
            <FaYoutube /> YouTube
          </a>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-yellow-400 hover:opacity-90 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
          >
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>

      {/* 🔴 Se estiver live, mostra o player diretamente */}
      {isLive ? (
        <div className="flex justify-center my-10">
          <iframe
            src="https://www.youtube.com/embed/live_stream?channel=UCfg5QnFApnh0RXZlZFzvLiQ&autoplay=1&mute=0"
            title="Live stream"
            className="w-full max-w-4xl aspect-video rounded-lg border-2 border-red-600"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <>
          {/* Últimos vídeos */}
          <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
            <span role="img" aria-label="tv">
              📺
            </span>
            Últimos Vídeos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div
                key={v.id}
                className="relative bg-neutral-900 hover:bg-neutral-800 transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-lg border border-red-700/30 cursor-pointer"
                onClick={() => setPlaying(playing === v.id ? null : v.id)}
              >
                {playing === v.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                    title={v.title}
                    className="w-full h-48 object-cover"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 p-3 rounded-full">
                        <FaYoutube className="text-4xl text-red-600" />
                      </div>
                    </div>
                  </>
                )}
                <div className="p-3 text-left">
                  <p className="font-semibold">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
