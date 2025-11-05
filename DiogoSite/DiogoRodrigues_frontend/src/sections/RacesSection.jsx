import React from "react";

export default function RacesSection() {
  const races = [
    {
      pos: "3º Lugar",
      track: "Spa-Francorchamps",
      date: "08/09/2024",
      car: "BMW M4 GT3",
      bestLap: "2:17.543",
      comment: "Corrida muito competitiva, consegui manter o ritmo durante toda a prova.",
    },
    {
      pos: "1º Lugar",
      track: "Monza",
      date: "05/09/2024",
      car: "Porsche 911 GT3 R",
      bestLap: "1:47.892",
      comment: "Vitória fantástica! Setup perfeito para as condições da pista.",
    },
    {
      pos: "2º Lugar",
      track: "Silverstone",
      date: "02/09/2024",
      car: "Oreca 07 LMP2",
      bestLap: "1:38.445",
      comment: "Corrida de endurance, boa gestão de combustível e pneus.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto text-white">
      <h3 className="flex items-center gap-2 text-red-500 font-bold text-lg mb-6">
        🏁 Últimas Corridas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {races.map((r, i) => (
          <div key={i} className="bg-neutral-900 border border-red-900 rounded-xl p-5 hover:border-red-600 hover:scale-105 transition-all">
            <p className="text-yellow-500 font-semibold mb-2">{r.pos}</p>
            <h4 className="font-bold text-lg mb-2">{r.track}</h4>
            <p className="text-sm text-gray-400">📅 {r.date}</p>
            <p className="text-sm text-gray-400">🚗 {r.car}</p>
            <p className="text-sm text-gray-400 mb-2">⏱ Melhor volta: {r.bestLap}</p>
            <p className="text-sm italic text-gray-300">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
