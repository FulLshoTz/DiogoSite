/* 🔴 REGRAS DA APP (NÃO APAGAR):
   1. LAYOUT: O Footer deve estar sempre APÓS o <main> e dentro da div flex-col para garantir "Sticky Footer".
   2. BACKEND PING: NUNCA remover o useEffect que faz o 'ping' ao Render a cada 30s.
      Isto impede que o backend "adormeça" na versão gratuita.
*/
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TreinoAnalise from "./pages/TreinoAnalise";
import Definicoes from "./pages/Definicoes";
import Header from "./components/Header";
import Background from "./components/Background";
import Footer from "./components/Footer";

function App() {
  //  🔁  Mantém backend acordado (Render FREE)
  useEffect(() => {
    const ping = () => {
      fetch("https://diogorodrigues-backend.onrender.com/api/ping")
        .then(() => console.log("Ping backend ok"))
        .catch(() => console.log("Backend ainda a acordar..."));
    };
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Background />
      <Router>
        <div className="flex min-h-screen bg-transparent text-white">
          <div className="flex-1 flex flex-col w-full"> 
            <Header />
            <main className="flex-1 pt-32 sm:pt-40 px-4"> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/treino-analise" element={<TreinoAnalise />} />
                <Route path="/definicoes" element={<Definicoes />} />
              </Routes>
            </main>
            <Footer /> 
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;