import React, { useEffect, useState } from "react"

export default function Header() {
  const [live, setLive] = useState(false)

  useEffect(() => {
    fetch("https://diogorodrigues-backend.onrender.com/api/youtube/live-status")
      .then(res => res.json())
      .then(data => setLive(data.is_live))
      .catch(() => setLive(false))
  }, [])

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-red-700 bg-black/80">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
        <h1 className="text-2xl font-orbitron">Diogo Rodrigues</h1>
      </div>
      <div className="text-sm font-bold">
        <span
          className={`px-3 py-1 rounded ${
            live ? "bg-green-600 text-white" : "bg-gray-600 text-white"
          }`}
        >
          {live ? "🟢 Online" : "⚫ Offline"}
        </span>
      </div>
    </header>
  )
}
