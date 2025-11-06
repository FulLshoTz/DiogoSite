import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

export default function YoutubeSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Mostra 3 vídeos reais logo no início (canal FulLshoT)
  const [videos, setVideos] = useState([
    { id: "VqHqU7q4mV0", title: "Hotlap #1" },
    { id: "1v6A2yEIxv4", title: "Hotlap #2" },
    { id: "x6LB0u6C6Xo", title: "Hotlap #3" },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resInfo, resVideos] = await Promise.all([
          fetch("https://diogorodrigues-backend.onrender.com/api/youtube/channel-info"),
          fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos"),
        ]);
        const info = await resInfo.json();
        const list = await resVideos.json();

        if (list?.videos?.length > 0) {
          setVideos(list.videos.slice(0, 3));
        }

        setData(info);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
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

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <img
            src={data?.thumbnails?.high?.url || "https://www.youtube.com/s/desktop/e1f7b6db/img/favicon_144x144.png"}
            alt="FulLshoT"
            className="w-20 h-20 rounded-full border-2 border-red-600"
          />
          <div className="text-left">
            <h2 className="text-xl font-bold">{data?.title || "FulLshoT"}</h2>
            <p className="text-gray-400 text-sm">
              {data?.stats?.subscriberCount || "—"} subs •{" "}
              {data?.stats?.viewCount || "—"} views
            </p>
          </div>
        </div>

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

      {/* Últimos vídeos (mostra logo placeholders reais do canal) */}
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
        📺 Últimos Vídeos
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div
            key={v.id}
            className="relative bg-neutral-900 hover:bg-neutral-800 transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-lg border border-red-700/30"
          >
            <iframe
              src={`https://www.youtube.com/embed/${v.id}`}
              title={v.title}
              className="w-full aspect-video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <div className="p-3 text-left">
              <p className="font-semibold">{v.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
