import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";
import Header from "./components/Header";
// import Sidebar from "./components/Sidebar"; // <--- 5. REMOVIDO
import Background from "./components/Background";

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
          {/* <Sidebar />  <--- 5. COMENTADO/REMOVIDO */}
          
          <div className="flex-1 flex flex-col w-full"> {/* Adicionei w-full para garantir largura total */}
            <Header />
            <main className="flex-1 pt-32 sm:pt-40 px-4"> {/* Adicionei px-4 para margem mobile */}
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
