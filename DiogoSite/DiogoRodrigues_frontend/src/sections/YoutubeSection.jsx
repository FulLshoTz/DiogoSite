import React, { useEffect, useState } from "react";

const YoutubeSection = () => {
  const [videos, setVideos] = useState([
    // placeholders instantâneos
    { id: "mErQBHBnQ0U", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/mErQBHBnQ0U/hqdefault.jpg" },
    { id: "BiDkc-i6ICs", title: "8h Bahrain | TREINO | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/BiDkc-i6ICs/hqdefault.jpg" },
    { id: "CwDFK3weUBE", title: "ROUND 2 | LMU CHAMPIONSHIP Interlagos | LMGT3 Fixed | Diogo Rodrigues", thumbnail: "https://i.ytimg.com/vi/CwDFK3weUBE/hqdefault.jpg" }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos")
      .then(res => res.json())
      .then(data => {
        if (data?.videos) setVideos(data.videos);
      })
      .catch(() => console.warn("⚠️ Backend não respondeu, a mostrar placeholders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4 py-16">
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
        📺 Últimos Vídeos
      </h3>

      {loading && <p className="text-gray-400 mb-6">A carregar dados do YouTube...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div key={v.id} className="relative bg-neutral-900 hover:bg-neutral-800 transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-lg border border-red-700/30 cursor-pointer">
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
