import React, { useEffect, useState } from "react";

const YoutubeSection = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([
    // placeholders iniciais (visíveis só até backend responder)
    { id: "mErQBHBnQ0U", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/mErQBHBnQ0U/hqdefault.jpg" },
    { id: "BiDkc-i6ICs", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/BiDkc-i6ICs/hqdefault.jpg" },
    { id: "CwDFK3weUBE", title: "ROUND 2 | LMU CHAMPIONSHIP Interlagos | LMGT3 Fixed | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/CwDFK3weUBE/hqdefault.jpg" },
  ]);

  const [loading, setLoading] = useState(true);

  // 🧠 Carregar info do canal
  useEffect(() => {
    fetch("https://diogorodrigues-backend.onrender.com/api/youtube/channel-info")
      .then((res) => res.json())
      .then((data) => setChannel(data))
      .catch(() => console.warn("⚠️ Falha ao carregar info do canal"));
  }, []);

  // 🧠 Carregar vídeos
  useEffect(() => {
    fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos")
      .then((res) => res.json())
      .then((data) => {
        if (data?.videos?.length > 0) setVideos(data.videos);
      })
      .catch(() => console.warn("⚠️ Falha ao carregar vídeos, a mostrar placeholders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4 py-16">
      {/* 🔹 Info do canal */}
      {channel && (
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <img
              src={channel?.thumbnails?.high?.url}
              alt={channel?.title}
              className="w-20 h-20 rounded-full border-2 border-red-600"
            />
            <div className="text-left">
              <h2 className="text-xl font-bold">{channel?.title}</h2>
              <p className="text-gray-400 text-sm">
                {channel?.stats?.subscriberCount} subs • {channel?.stats?.viewCount} views
              </p>
            </div>
          </div>

          {/* 🔹 Botões */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://www.youtube.com/@FulLShoT"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
              </svg>
              YouTube
            </a>

            <a
              href="https://www.instagram.com/diofdx"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-yellow-400 hover:opacity-90 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      )}

      {/* 🔹 Últimos vídeos */}
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
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-4xl text-red-600" xmlns="http://www.w3.org/2000/svg">
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
