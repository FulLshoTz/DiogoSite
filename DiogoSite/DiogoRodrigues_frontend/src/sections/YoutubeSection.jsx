import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { getChannelInfo, getLatestVideos } from "../api/youtube";

export default function YoutubeSection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(null);

  // 🎬 Mostra 3 vídeos de fallback enquanto o backend carrega
  const fallbackVideos = [
    {
      id: "dQw4w9WgXcQ", // substitui pelos teus vídeos
      title: "Vídeo 1 (placeholder)",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      id: "M7lc1UVf-VE",
      title: "Vídeo 2 (placeholder)",
      thumbnail: "https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg",
    },
    {
      id: "eY52Zsg-KVI",
      title: "Vídeo 3 (placeholder)",
      thumbnail: "https://i.ytimg.com/vi/eY52Zsg-KVI/hqdefault.jpg",
    },
  ];

  // Estado inicial com vídeos temporários
  const [videos, setVideos] = useState(fallbackVideos);
  const [info, setInfo] = useState({
    title: "Carregando canal...",
    subs: 0,
    views: 0,
    isLive: false,
    thumb: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [infoRes, videosRes] = await Promise.all([
          getChannelInfo(),
          getLatestVideos(),
        ]);

        if (infoRes) {
          setInfo({
            title: infoRes.title || "Canal",
            subs: infoRes?.stats?.subscriberCount || 0,
            views: infoRes?.stats?.viewCount || 0,
            thumb:
              infoRes?.thumbnails?.high?.url ||
              infoRes?.thumbnails?.medium?.url ||
              "",
            isLive: infoRes?.liveBroadcastContent === "live",
          });
        }

        if (videosRes?.videos?.length > 0) {
          const ordered = videosRes.videos
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 3);
          setVideos(ordered);
        }
      } catch (err) {
        console.error("Erro ao carregar YouTube:", err);
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

  const { title, subs, views, thumb, isLive } = info;

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4">
      {/* Cabeçalho do canal */}
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

      {/* Live stream ou últimos vídeos */}
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
          <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
            📺 Últimos Vídeos
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
