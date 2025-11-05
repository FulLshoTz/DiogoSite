import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

export default function YoutubeSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/channel-info");
        const info = await res.json();
        if (info.error) throw new Error(info.error);

        const videosRes = await fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos");
        const videosData = await videosRes.json();

        setData({
          title: info.title,
          subs: info.stats.subscriberCount,
          views: info.stats.viewCount,
          banner: info.banner?.bannerExternalUrl,
          thumb: info.thumbnails?.high?.url,
          videos: videosData.videos || [],
        });
      } catch (err) {
        console.error("Erro ao carregar dados do YouTube:", err);
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

  const { title, subs, views, thumb, videos } = data;

  return (
    <section className="max-w-7xl mx-auto text-center text-white">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <img
            src={thumb}
            alt={title}
            className="w-20 h-20 rounded-full border-2 border-red-600"
          />
          <div className="text-left">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-400 text-sm">
              {subs} subs • {views} views
            </p>
            <p className="text-gray-400 mt-1">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
              Offline
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

      <h3 className="text-2xl font-bold mb-6">Últimos vídeos</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelected(v.id)}
            className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-lg border border-red-700/30"
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-left">
              <p className="font-semibold">{v.title}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full max-w-4xl mx-auto aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selected}?autoplay=1`}
              title="YouTube video player"
              className="w-full h-full rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
