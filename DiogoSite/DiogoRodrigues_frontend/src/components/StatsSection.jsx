import React from 'react'

export default function StatsSection() {
  const stats = [
    { label: 'Corridas', value: '42' },
    { label: 'Pódios', value: '12' },
    { label: 'Vitórias', value: '6' },
  ]

  return (
    <section className="max-w-5xl w-full">
      <h3 className="text-xl font-semibold mb-4 text-red-500">Estatísticas</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center hover:border-red-700 transition"
          >
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
