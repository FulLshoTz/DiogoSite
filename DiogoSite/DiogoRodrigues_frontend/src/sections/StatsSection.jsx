import React from "react";

export default function StatsSection() {
  const stats = [
    { value: 3, label: "Corridas" },
    { value: 3, label: "Circuitos" },
    { value: 1, label: "Vitórias" },
    { value: 3, label: "Pódios" },
  ];

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
      {stats.map(s => (
        <div key={s.label} className="bg-neutral-900 border border-red-900 p-6 rounded-xl hover:scale-105 transition-transform">
          <h4 className="text-3xl text-red-500 font-bold mb-1">{s.value}</h4>
          <p className="text-sm">{s.label}</p>
        </div>
      ))}
    </section>
  );
}
