import React, { useState, useEffect } from "react";

// 1. OS TEUS VÍDEOS DE SEGURANÇA (HARDCODED)
// Estes aparecem se o backend estiver a dormir, der erro ou demorar muito.
const FALLBACK_VIDEOS = [
  { id: "akkgj63j5rg", title: "PTracerz CUP 2025" },
  { id: "95r7yKBo-4w", title: "GT3 VS ORT - Corrida resistência" },
  { id: "gupDgHpu3DA", title: "Cacetada no Zurga (Renault Clio)" },
];

export default function YoutubeSection() {
  const [videos, setVideos] = useState([]);
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Cria um temporizador: Se passar de 5 segundos, cancela tudo e usa o backup
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 

      try {
        // 1. Tentar ver se há LIVE
        const liveRes = await fetch("https://diogorodrigues-backend.onrender.com/api/live-status", { 
          signal: controller.signal 
        });
        
        const liveData = await liveRes.json();

        // Se houver live, mostra a live e pára tudo o resto
        if (liveData.is_live && liveData.id) {
          setLive({ id: liveData.id, title: liveData.title });
          setLoading(false);
          clearTimeout(timeoutId); // Cancela o timeout porque já temos dados
          return; 
        }

        // 2. Tentar buscar VÍDEOS RECENTES da API
        const videosRes = await fetch("https://diogorodrigues-backend.onrender.com/api/latest-videos?limit=3", {
          signal: controller.signal
        });
        const videosData = await videosRes.json();
        
        clearTimeout(timeoutId); // Tudo correu bem, cancela o timeout

        if (videosData.videos && videosData.videos.length > 0) {
          setVideos(videosData.videos);
        } else {
          // Se a API responder mas vier vazia, usa os teus vídeos fixos
          setVideos(FALLBACK_VIDEOS);
        }

      } catch (err) {
        console.warn("Backend a dormir ou erro de rede. A carregar vídeos de backup.");
        // EM CASO DE ERRO (Backend a dormir/Timeout), MOSTRA OS VÍDEOS FIXOS IMEDIATAMENTE
        setVideos(FALLBACK_VIDEOS);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const sectionTitle = live ? "🔴 A TRANSMITIR AGORA" : "Últimos Vídeos";

  return (
    <section className="max-w-7xl mx-auto text-white px-4 py-6 mt-2">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-red-600 fill-current" viewBox="0 0 576 512">
          <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5C51.1 81.8 32.6 100.4 26.3 124c-11.4 42.8-11.4 132-11.4 132s0 89.2 11.4 132c6.3 23.6 24.8 42.3 48.3 48.6C117.2 448 288 448 288 448s170.8 0 213.4-11.4c23.5-6.3 42-25 48.3-48.6 11.4-42.8 11.4-132 11.4-132s0-89.2-11.4-132zM232.1 337.6V174.4l142.7 81.6-142.7 81.6z"/>
        </svg>
        <h3 className={`text-2xl font-bold tracking-wide ${live ? "text-red-500 animate-pulse" : ""}`} style={{ fontFamily: "RushDriver" }}>
          {sectionTitle}
        </h3>
        <div className="flex-1 h-[2px] bg-red-600"></div>
      </div>

      {/* === LOADING SKELETON (PLACEHOLDERS) === */}
      {/* Enquanto carrega, mostra retângulos cinzentos a piscar */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 animate-pulse">
              <div className="aspect-video bg-neutral-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
                <div className="h-4 bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : live ? (
        /* MODO LIVE */
        <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
           <div className="aspect-video rounded-2xl overflow-hidden border-2 border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.4)] bg-black relative z-10">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${live.id}?autoplay=1&mute=0`} allowFullScreen title="Live" />
          </div>
          <div className="mt-4 p-5 bg-gradient-to-r from-red-900/40 to-black border border-red-900/50 rounded-xl flex justify-between items-center">
             <div>
               <h2 className="text-xl font-bold text-white">{live.title}</h2>
               <p className="text-red-400 font-semibold text-sm mt-1 flex items-center gap-2">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"/>Em direto
               </p>
             </div>
          </div>
        </div>
      ) : (
        /* MODO VÍDEOS (Usa API ou Backup se falhar/demorar) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div key={v.id} className="bg-neutral-900 rounded-xl overflow-hidden border border-red-700/30 hover:border-red-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
              <div className="aspect-video relative">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${v.id}`} loading="lazy" allowFullScreen title={v.title} />
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
