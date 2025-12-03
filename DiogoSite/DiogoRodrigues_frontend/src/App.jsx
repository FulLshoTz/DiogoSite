import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";
import Header from "./components/Header";
// import Sidebar from "./components/Sidebar"; 
import Background from "./components/Background";
import Footer from "./components/Footer"; // <--- 1. IMPORTAR O FOOTER

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
        {/* O "bg-transparent" deixa ver o componente <Background /> que está por trás */}
        <div className="flex min-h-screen bg-transparent text-white">
          
          <div className="flex-1 flex flex-col w-full"> 
            <Header />
            
            <main className="flex-1 pt-32 sm:pt-40 px-4"> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/corridas" element={<Corridas />} />
                <Route path="/circuitos" element={<Circuitos />} />
                <Route path="/definicoes" element={<Definicoes />} />
              </Routes>
            </main>

            {/* <--- 2. ADICIONAR O FOOTER AQUI */}
            <Footer /> 

          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
