import React, { useEffect, useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";

export default function YoutubeSection() {
  const [videos, setVideos] = useState([
    { id: "ID_VIDEO1", title: "Título Vídeo 1" },
    { id: "ID_VIDEO2", title: "Título Vídeo 2" },
    { id: "ID_VIDEO3", title: "Título Vídeo 3" },
  ]);

  // Substitui os IDs acima pelos teus vídeos públicos

  return (
    <section className="max-w-7xl mx-auto text-center text-white px-4 py-16">
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
      <div className="mt-10">
        <a
          href="https://www.youtube.com/@FulLshoT"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
        >
          <FaYoutube /> Visitar Canal
        </a>
      </div>
    </section>
  );
}
