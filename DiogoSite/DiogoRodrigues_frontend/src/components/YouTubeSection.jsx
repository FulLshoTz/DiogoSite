import React, { useEffect, useState } from 'react'

export default function YouTubeSection() {
  const [info, setInfo] = useState(null)
  const [videos, setVideos] = useState([])
  const [live, setLive] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE = import.meta.env.VITE_API_BASE || '/api'

  useEffect(() => {
    const load = async () => {
      try {
        const [infoRes, liveRes, videosRes] = await Promise.all([
          fetch(`${API_BASE}/youtube/channel-info`),
          fetch(`${API_BASE}/youtube/live-status`),
          fetch(`${API_BASE}/youtube/latest-videos?limit=3`)
        ])

        if (!infoRes.ok || !liveRes.ok || !videosRes.ok)
          throw new Error('Erro ao carregar dados')

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

  if (error) return <p className="text-red-500">{error}</p>
  if (!info) return <p className="text-gray-400">A carregar dados do YouTube...</p>

  return (
    <section className="max-w-5xl w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={info.thumbnails?.high?.url}
            alt={info.title}
            className="w-20 h-20 rounded-full border border-red-700"
          />
          <div>
            <h2 className="text-2xl font-bold">{info.title}</h2>
            <p className="text-gray-400">
              {info.stats.subscriberCount} subs • {info.stats.viewCount} views
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              live ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            {live ? '🔴 Live agora' : '⚪ Offline'}
          </span>
        </div>
      </div>

      {live ? (
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-red-700">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/live_stream?channel=${info.id}`}
            title="Live Stream"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4 text-red-500">Últimos vídeos</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map(v => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-900 p-2 rounded-lg hover:scale-105 transition border border-neutral-800"
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="rounded-md mb-2 w-full"
                />
                <p className="text-sm font-medium">{v.title}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
