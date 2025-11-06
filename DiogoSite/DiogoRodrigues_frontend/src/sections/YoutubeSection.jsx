import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

// vídeos públicos diretos do canal FulLshoT (sem depender da API)
const localVideos = [
  { id: "bK88eTATwz8", title: "EA WRC - Rally Portugal | FulLshoT" },
  { id: "hW7sBHeHhTg", title: "Le Mans Ultimate - Hotlap GT3 | FulLshoT" },
  { id: "FJ_Htu_f5Cs", title: "Assetto Corsa - Lexus GT3 | FulLshoT" },
];

export default function YoutubeSection() {
  const [videos, setVideos] = useState(localVideos);
  const [channel, setChannel] = useState({
    title: "FulLshoT",
    subs: "—",
    views: "—",
    thumb: "https://yt3.googleusercontent.com/ytc/AIf8zZTykE0QzvPZOH3MeDfPZL5K8kUR5LKZ0ikQ2w=s176-c-k-c0x00ffffff-no-rj",
  });

  // assim que o backend acordar, atualiza a informação
  useEffect(() => {
    async function updateFromBackend() {
      try {
        const [infoRes, vidsRes] = await Promise.all([
          fetch("https://diogorodrigues-backend.onrender.com/api/youtube/channel-info"),
          fetch("https://diogorodrigues-backend.onrender.com/api/youtube/latest-videos"),
        ]);

        if (!infoRes.ok || !vidsRes.ok) return; // se backend ainda estiver a acordar, ignora

        const info = await infoRes.json();
        const vids = await vidsRes.json();

        if (info?.title) {
          setChannel({
            title: info.title,
            subs: info?.stats?.subscriberCount ?? "—",
            views: info?.stats?.viewCount ?? "—",
            thumb:
              info?.thumbnails?.high?.url ||
              info?.thumbnails?.default?.url ||
              channel.thumb,
          });
        }

        if (vids?.videos?.length > 0) {
          setVideos(vids.videos.slice(0, 3));
        }
      } catch (err) {
        console.log("Backend ainda não está ativo:", err);
      }
    }

    updateFromBackend();

    // tenta novamente de 30 em 30 segundos (caso o backend acorde)
    const interval = setInterval(updateFromBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4 py-16">
      {/* Cabeçalho do canal */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <img
            src={channel.thumb}
            alt="Logo canal"
            className="w-20 h-20 rounded-full border-2 border-red-600"
          />
          <div className="text-left">
            <h2 className="text-xl font-bold">{channel.title}</h2>
            <p className="text-gray-400 text-sm">
              {channel.subs} subs • {channel.views} views
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

      {/* Últimos vídeos */}
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
