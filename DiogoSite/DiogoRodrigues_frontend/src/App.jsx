import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import YoutubeSection from "./components/YoutubeSection";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";

export default function App() {
  return (
    <Router>
      <Header />
      <main className="pt-24 px-4">
        <Routes>
          <Route path="/" element={<YoutubeSection />} />
          <Route path="/corridas" element={<Corridas />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/definicoes" element={<Definicoes />} />
        </Routes>
      </main>
    </Router>
  );
}
