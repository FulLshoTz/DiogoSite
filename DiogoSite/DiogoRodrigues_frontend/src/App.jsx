import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-carbon text-white font-fytyra">
        <Header />
        <main className="pt-20 px-4 sm:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/corridas" element={<Corridas />} />
            <Route path="/circuitos" element={<Circuitos />} />
            <Route path="/definicoes" element={<Definicoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
