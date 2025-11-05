import React, { useEffect, useState } from "react"
import { FaYoutube, FaInstagram, FaUser, FaEye } from "react-icons/fa"

export default function YouTubeSection() {
  const [info, setInfo] = useState(null)
  const [videos, setVideos] = useState([])
  const [live, setLive] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE = "https://diogorodrigues-backend.onrender.com/api"

  useEffect(() => {
    const load = async () => {
      try {
        const [infoRes, liveRes, videosRes] = await Promise.all([
          fetch(`${API_BASE}/youtube/channel-info`),
          fetch(`${API_BASE}/youtube/live-status`),
          fetch(`${API_BASE}/youtube/latest-videos?limit=3`)
        ])

        if (!infoRes.ok || !liveRes.ok || !videosRes.ok)
          throw new Error("Erro ao carregar dados")

        const infoData = await infoRes.json()
        const liveData = await liveRes.json()
        const videosData = await videosRes.json()

        setInfo(infoData)
        setLive(liveData.is_live)
        setVideos(videosData.videos || [])
      } catch (e) {
        setError(e.message)
      }
    }

    load()
  }, [])

  if (error) return <p>Erro: {error}</p>
  if (!info) return <p className="text-center mt-10">A carregar dados do YouTube...</p>

  return (
    <section className="max-w-6xl mx-auto mt-10">
      {/* BARRA DO CANAL */}
      <div className="relative flex justify-between items-center bg-black/60 border border-red-900 rounded-xl p-4 mb-8 shadow-lg">
        {/* Esquerda: Logo + Nome + Stats */}
        <div className="flex items-center gap-4">
          <img
            src={info.thumbnail}
            alt="Logo"
            className="w-14 h-14 rounded-full border-2 border-red-700"
          />
          <div>
            <h2 className="text-xl font-bold text-red-500">{info.title}</h2>
            <div className="flex gap-4 text-sm text-gray-300 mt-1">
              <span className="flex items-center gap-1">
                <FaUser /> {info.subscriberCount} subscritores
              </span>
              <span className="flex items-center gap-1">
                <FaEye /> {info.viewCount} visualizações
              </span>
            </div>
          </div>
        </div>

        {/* Direita: Botões */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition"
          >
            <FaYoutube /> Ver Canal
          </a>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-3 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
          >
            <FaInstagram /> Instagram
          </a>
        </div>

        {/* Live Status por cima */}
        <div className="absolute -top-3 left-6 text-sm font-bold">
          <span
            className={`px-3 py-1 rounded ${
              live ? "bg-green-600 text-white" : "bg-gray-600 text-white"
            }`}
          >
            {live ? "🟢 Online" : "⚫ Offline"}
          </span>
        </div>
      </div>

      {/* SEÇÃO DE VÍDEOS OU LIVE */}
      {live ? (
        <div className="aspect-video mb-10">
          <iframe
            className="w-full h-full rounded-lg border-2 border-red-700"
            src={`https://www.youtube.com/embed/live_stream?channel=${info.channelId}`}
            title="YouTube Live"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl mb-4 font-bold text-white">
            <span className="text-red-500">▶</span> Últimos Vídeos
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map(v => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="bg-black/70 rounded-lg overflow-hidden shadow-md hover:shadow-red-600/50 hover:scale-105 border border-transparent hover:border-red-600 transition-all"
              >
                <img src={v.thumbnail} alt={v.title} className="w-full" />
                <div className="p-3">
                  <p className="font-semibold text-white">{v.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
