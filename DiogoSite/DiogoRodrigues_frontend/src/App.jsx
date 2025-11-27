import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Background from "./components/Background";

function App() {
  // 🔁 Mantém backend acordado (Render FREE)
  useEffect(() => {
    const ping = () => {
      fetch("https://diogorodrigues-backend.onrender.com/api/ping")
        .then(() => console.log("Ping backend ok"))
        .catch(() => console.log("Backend ainda a acordar..."));
    };

    ping(); // ping ao abrir
    const interval = setInterval(ping, 30000); // a cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Fundo animado de fibra de carbono */}
      <Background />

      {/* Estrutura principal */}
      <Router>
        <div className="flex min-h-screen bg-black text-white">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            {/* padding-top = altura do header */}
            <main className="flex-1 pt-32 sm:pt-40">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/corridas" element={<Corridas />} />
                <Route path="/circuitos" element={<Circuitos />} />
                <Route path="/definicoes" element={<Definicoes />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
