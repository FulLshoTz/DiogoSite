import React, { useState, useEffect } from "react";

export default function YoutubeSection() {
  const [videos, setVideos] = useState([]);
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1. PRIMEIRO: Verificar se estamos em LIVE (Via rápida)
        const liveRes = await fetch("https://diogorodrigues-backend.onrender.com/api/live-status");
        const liveData = await liveRes.json();

        // Se o servidor disser que é live E der um ID válido
        if (liveData.is_live && liveData.id) {
          console.log("Modo Live Ativado:", liveData.title);
          setLive({ id: liveData.id, title: liveData.title });
          setLoading(false);
          return; // 🛑 Pára aqui! Não carrega a lista de vídeos para não duplicar.
        }

        // 2. SE NÃO HOUVER LIVE: Carregar os últimos vídeos
        const videoRes = await fetch("https://diogorodrigues-backend.onrender.com/api/latest-videos?limit=3");
        const videoData = await videoRes.json();
        
        if (videoData.videos) {
          setVideos(videoData.videos);
        }

      } catch (err) {
        console.error("Erro ao buscar conteúdo YouTube:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Texto muda dependendo do estado
  const sectionTitle = live ? "🔴 A TRANSMITIR AGORA" : "Últimos Vídeos";

  return (
    <section className="max-w-7xl mx-auto text-white px-4 py-6 mt-2">
      
      {/* CABEÇALHO DA SECÇÃO */}
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-red-600 fill-current" viewBox="0 0 576 512">
          <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z"/>
        </svg>
        <h3
          className={`text-2xl font-bold tracking-wide ${live ? "text-red-500 animate-pulse" : ""}`}
          style={{ fontFamily: "RushDriver" }}
        >
          {sectionTitle}
        </h3>
        <div className="flex-1 h-[2px] bg-red-600"></div>
      </div>

      {loading && <p className="text-gray-500 text-center py-10">A atualizar...</p>}

      {/* --- CENÁRIO 1: MODO LIVE (PLAYER GIGANTE) --- */}
      {live ? (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
           {/* Player com borda brilhante */}
           <div className="aspect-video rounded-2xl overflow-hidden border-2 border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.4)] bg-black relative z-10">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${live.id}?autoplay=1&mute=0`}
              title="Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Info da Live */}
          <div className="mt-4 p-5 bg-gradient-to-r from-red-900/40 to-black border border-red-900/50 rounded-xl flex justify-between items-center">
             <div>
               <h2 className="text-xl font-bold text-white">{live.title}</h2>
               <p className="text-red-400 font-semibold text-sm mt-1 flex items-center gap-2">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"/>
                 Em direto • Clique no Play para assistir
               </p>
             </div>
             <a 
               href={`https://www.youtube.com/watch?v=${live.id}`} 
               target="_blank"
               rel="noreferrer"
               className="hidden sm:block px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition shadow-lg"
             >
               Ver no Chat
             </a>
          </div>
        </div>
      ) : (
        /* --- CENÁRIO 2: LISTA DE VÍDEOS NORMAL --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div key={v.id} className="bg-neutral-900 rounded-xl overflow-hidden border border-red-700/30 hover:border-red-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
              <div className="aspect-video relative">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
                  {v.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
