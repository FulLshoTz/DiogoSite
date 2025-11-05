import React, { useEffect, useState } from "react";
import { fetchChannelInfo, fetchLatestVideos } from "../api/youtube";
import { FaYoutube, FaInstagram } from "react-icons/fa";

const Home = () => {
  const [info, setInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const load = async () => {
      const channelData = await fetchChannelInfo();
      const videosData = await fetchLatestVideos();
      setInfo(channelData);
      setVideos(videosData.videos || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-400 animate-pulse">A carregar dados do YouTube...</p>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500">
        Erro ao carregar dados.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Banner do canal */}
      {info.banner?.bannerExternalUrl && (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={info.banner.bannerExternalUrl}
            alt="Banner"
            className="w-full h-64 object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent"></div>
          <div className="absolute bottom-4 left-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">{info.title}</h1>
            <p
              className={`text-sm font-medium ${
                isLive ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isLive ? "● Live agora!" : "● Offline"}
            </p>
          </div>
        </div>
      )}

      {/* Estatísticas + Redes */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-full md:w-1/2 border border-neutral-700 hover:scale-[1.02] transition">
          <h2 className="text-xl font-semibold mb-3 text-red-500">
            Canal YouTube
          </h2>
          <p className="text-gray-300">{info.description}</p>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
            <span>👥 {info.stats.subscriberCount} subs</span>
            <span>🎥 {info.stats.videoCount} vídeos</span>
            <span>👁 {info.stats.viewCount} views</span>
          </div>
          <a
            href="https://www.youtube.com/@FulLShoT"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FaYoutube className="mr-2" /> Ver Canal
          </a>
        </div>

        <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-full md:w-1/2 border border-neutral-700 hover:scale-[1.02] transition flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-3 text-red-500">
            Instagram
          </h2>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-4 py-2 rounded-lg transition hover:opacity-90"
          >
            <FaInstagram className="mr-2" /> Ver Perfil
          </a>
        </div>
      </div>

      {/* Últimos vídeos */}
      <div>
        <h2 className="text-2xl font-semibold text-red-500 mb-4">
          Últimos Vídeos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noreferrer"
              className="group block bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hover:scale-[1.03] transition-transform"
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-48 object-cover group-hover:opacity-90 transition"
              />
              <div className="p-3">
                <p className="text-sm text-gray-300 group-hover:text-white">
                  {v.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
