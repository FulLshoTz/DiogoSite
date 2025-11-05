import React, { useState } from "react";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import thumb1 from "../assets/thumb1.jpg";
import thumb2 from "../assets/thumb2.jpg";
import thumb3 from "../assets/thumb3.jpg";

export default function YoutubeSection() {
  const [selected, setSelected] = useState(null);

  const videos = [
    { id: "bahrain", title: "8H Bahrain | TREINO | Diogo Rodrigues", thumb: thumb1 },
    { id: "analysis", title: "La Sarthe | Le Mans - Análise", thumb: thumb2 },
    { id: "treino11", title: "Treino 11 - La Sarthe | Diogo Rodrigues", thumb: thumb3 },
  ];

  return (
    <section className="max-w-7xl mx-auto text-center text-white">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Fullshot" className="w-20 h-20 rounded-full border-2 border-red-600" />
          <div className="text-left">
            <h2 className="text-xl font-bold text-white">FulLshoT | Diogo Rodrigues</h2>
            <p className="text-gray-400 text-sm">280 subs • 178.9K views</p>
            <p className="text-gray-400 mt-1"><span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>Offline</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://www.youtube.com/@FulLshoT" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105">
            <FaYoutube /> YouTube
          </a>
          <a href="https://www.instagram.com/diofdx" className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-yellow-400 hover:opacity-90 px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105">
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>

      <h3 className="flex items-center justify-center gap-2 text-red-500 font-bold text-lg mb-6">
        <span>🎬</span> ÚLTIMOS VÍDEOS
      </h3>

      {selected ? (
        <div className="relative w-full aspect-video mb-8">
          <iframe
            src={`https://www.youtube.com/embed/${selected}`}
            className="w-full h-full rounded-xl border border-red-700"
            allowFullScreen
          ></iframe>
          <button onClick={() => setSelected(null)} className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 px-3 py-1 rounded text-white text-sm">Fechar</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map(v => (
            <div
              key={v.id}
              onClick={() => setSelected(v.id)}
              className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-red-600 hover:scale-[1.03] transition-all rounded-xl overflow-hidden shadow-lg"
            >
              <img src={v.thumb} alt={v.title} className="w-full" />
              <p className="p-3 text-left text-sm font-semibold">{v.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
