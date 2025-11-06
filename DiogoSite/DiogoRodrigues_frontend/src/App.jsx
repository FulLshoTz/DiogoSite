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
  // 🔁 Mantém o backend acordado
  useEffect(() => {
    const ping = () => {
      fetch("https://diogorodrigues-backend.onrender.com/")
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
        <div
          className="flex min-h-screen text-white"
          style={{ background: "blue" }} // 🔵 TESTE 2 - cor do container principal
        >
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main
              className="flex-1 pt-20"
              style={{ background: "green" }} // 🟢 TESTE 3 - cor do main
            >
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
