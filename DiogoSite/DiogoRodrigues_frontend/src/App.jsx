import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Header />
      <main className="flex-grow px-6 md:px-12 lg:px-20 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/corridas" element={<Corridas />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/definicoes" element={<Definicoes />} />
        </Routes>
      </main>
    </div>
  );
}
