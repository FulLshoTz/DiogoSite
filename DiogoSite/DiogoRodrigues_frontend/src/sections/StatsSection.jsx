import React from "react";

export default function StatsSection() {
  const stats = [
    { value: 3, label: "Corridas" },
    { value: 3, label: "Circuitos" },
    { value: 1, label: "Vitórias" },
    { value: 3, label: "Pódios" },
  ];

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white mt-16">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-neutral-900 border border-red-800 hover:border-red-600 transition-all duration-300 rounded-xl p-6 shadow-md hover:shadow-red-900/20 transform hover:-translate-y-1 hover:scale-105"
        >
          <h4 className="text-4xl text-red-500 font-extrabold mb-1 drop-shadow-md">
            {s.value}
          </h4>
          <p className="text-sm tracking-wide text-gray-300 uppercase">
            {s.label}
          </p>
        </div>
      ))}
    </section>
  );
}
