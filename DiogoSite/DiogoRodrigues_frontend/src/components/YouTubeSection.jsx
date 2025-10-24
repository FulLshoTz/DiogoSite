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
          fetch(`${API_BASE}/youtube/latest-videos?limit=6`)
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

  if (error) return <p>Erro: {error}</p>
  if (!info) return <p>A carregar dados do YouTube...</p>

  return (
    <section>
      <h2>{info.title}</h2>
      <p>{info.description}</p>
      {live && <p style={{ color: 'red' }}>🔴 Live agora!</p>}
      <h3>Últimos vídeos</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}
      >
        {videos.map(v => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <p>{v.title}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
