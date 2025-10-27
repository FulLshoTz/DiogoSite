import React, { useState } from "react"

export default function Navbar() {
  const [active, setActive] = useState("Início")
  const items = ["Início", "Corridas", "Circuitos", "Definições"]

  return (
    <nav className="flex justify-center gap-6 py-3 bg-black/70 border-b border-red-700">
      {items.map(item => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`text-lg font-orbitron transition-colors ${
            active === item
              ? "text-red-600 font-bold"
              : "text-white hover:text-red-500"
          }`}
        >
          {item}
        </button>
      ))}
    </nav>
  )
}
