import React, { useEffect, useState } from "react"
import { FaYoutube, FaInstagram } from "react-icons/fa"

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
    <section className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-orbitron text-red-600">YouTube</h2>
          <a
            href="https://www.youtube.com/@FulLshoT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            <FaYoutube /> Ver Canal
          </a>
        </div>
        <a
          href="https://www.instagram.com/diofdx"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-3 py-1 rounded text-white font-semibold hover:opacity-90 transition"
        >
          <FaInstagram /> Instagram
        </a>
      </div>

      {live ? (
        <div className="aspect-video mb-10">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/live_stream?channel=${info.channelId}`}
            title="YouTube Live"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl mb-4 font-orbitron">Últimos vídeos</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map(v => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="bg-black/70 rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:border-red-600 border-2 border-transparent transition-transform"
              >
                <img src={v.thumbnail} alt={v.title} className="w-full" />
                <div className="p-3">
                  <p className="font-semibold">{v.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
