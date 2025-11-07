import React, { useEffect, useState } from "react";

const YoutubeSection = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([
    { id: "mErQBHBnQ0U", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/mErQBHBnQ0U/hqdefault.jpg" },
    { id: "BiDkc-i6ICs", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/BiDkc-i6ICs/hqdefault.jpg" },
    { id: "CwDFK3weUBE", title: "ROUND 2 | LMU CHAMPIONSHIP Interlagos | LMGT3 Fixed | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/CwDFK3weUBE/hqdefault.jpg" }
  ]);

  const [loading, setLoading] = useState(true);
  const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  useEffect(() => {
    fetch(`https://diogorodrigues-backend.onrender.com/api/youtube/channel-info?id=${channelId}`)
      .then((res) => res.json())
      .then((data) => setChannel(data))
      .catch(() => console.warn("⚠️ Falha ao carregar info do canal"));
  }, [channelId]);

  useEffect(() => {
    fetch(`https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos?id=${channelId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.videos?.length > 0) setVideos(data.videos);
      })
      .catch(() => console.warn("⚠️ Falha ao carregar vídeos, a mostrar placeholders"))
      .finally(() => setLoading(false));
  }, [channelId]);

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4 py-16">
      {/* 🔹 Informação do canal (sem banner) */}
      {channel && (
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-black/40 p-4 rounded-lg border border-red-700/40 shadow-md">
            <div className="flex items-center gap-4">
              <img
                src={channel.thumbnails?.high?.url}
                alt={channel.title}
                className="w-16 h-16 rounded-full border-2 border-red-700"
              />
              <div className="text-left">
                <h2 className="text-2xl font-bold">{channel.title}</h2>
                <p className="text-sm mt-1 text-gray-400">
                  {channel.stats?.subscriberCount} subscritores • {channel.stats?.viewCount} visualizações
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-4 sm:mt-0">
              <a
                href={`https://www.youtube.com/@FulLShoT`}
                target="_blank"
                rel="noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                YouTube
              </a>
              <a
                href="https://www.instagram.com/diogorodrigues.fullshot/"
                target="_blank"
                rel="noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Título e vídeos */}
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
        📺 Últimos Vídeos
      </h3>

      {loading && <p className="text-gray-400 mb-6">A carregar dados do YouTube...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div
            key={v.id}
            className="relative bg-neutral-900 hover:bg-neutral-800 transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-lg border border-red-700/30 cursor-pointer"
          >
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
              <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 p-3 rounded-full">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 576 512"
                    className="text-4xl text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                  </svg>
                </div>
              </div>
            </a>
            <div className="p-3 text-left">
              <p className="font-semibold">{v.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YoutubeSection;
