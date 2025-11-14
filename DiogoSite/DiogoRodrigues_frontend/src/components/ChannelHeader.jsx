import React, { useState, useEffect } from "react";

export default function ChannelHeader() {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  const BACKEND = "https://diogorodrigues-backend.onrender.com";

  // Dados fixos (tu nunca vais mudar o nome nem avatar no site)
  const channel = {
    title: "FulLshoT | Diogo Rodrigues",
    thumbnail:
      "https://yt3.ggpht.com/cg4Dfb7uuvYU48SCLabYtHJ8BZ5zRdeszrMJIN0Mm6MpVlH_PnHZPDEzE6PlvR4W6mbr-q2d=s800-c-k-c0x00ffffff-no-rj",
  };

  async function checkLive() {
    try {
      const res = await fetch(`${BACKEND}/api/live`);
      const data = await res.json();
      setIsLive(data.live === true);
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkLive();
    const id = setInterval(checkLive, 60000); // atualiza de minuto a minuto
    return () => clearInterval(id);
  }, []);

  const Wrapper = ({ children }) => (
    <section className="bg-gradient-to-r from-[#3b0000] via-[#220000] to-[#0b0000] 
                       text-white py-5 rounded-xl border border-red-900 shadow-md mx-4 mt-2 mb-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-6">
        {children}
      </div>
    </section>
  );

  if (loading) {
    return (
      <Wrapper>
        <p className="text-center w-full">A carregar estado do canal…</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* ESQUERDA */}
      <div className="flex items-center gap-4">
        <div className="rounded-full p-[1.5px] bg-gradient-to-r from-red-600 to-red-800">
          <img
            src={channel.thumbnail}
            alt={channel.title}
            className="w-20 h-20 rounded-full border border-red-600"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-red-400">
            {channel.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${isLive ? "bg-green-400" : "bg-gray-400"}`}
            />
            <span className="text-sm">{isLive ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* DIREITA */}
      <div className="flex gap-4">
        <a
          href="https://www.youtube.com/@FulLshoT"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg 
                     hover:bg-red-500 transition-transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
               className="w-5 h-5" fill="currentColor">
            <path d="M549.7 124.1c-6.3-23.6-24.8-42.3-48.3-48.6C458.8 64..."></path>
          </svg>
          YouTube
        </a>

        <a
          href="https://www.instagram.com/diofdx"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg 
                     transition-transform hover:scale-105"
          style={{
            background:
              "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 448 512"
               className="w-5 h-5" fill="currentColor">
            <path d="M224.1 141c-63.6 0-114.9 51.3..."></path>
          </svg>
          Instagram
        </a>
      </div>
    </Wrapper>
  );
}
