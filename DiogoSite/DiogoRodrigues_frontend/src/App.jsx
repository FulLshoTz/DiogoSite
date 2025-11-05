import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Corridas from "./pages/Corridas";
import Circuitos from "./pages/Circuitos";
import Definicoes from "./pages/Definicoes";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <main className="pt-24 px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/corridas" element={<Corridas />} />
          <Route path="/circuitos" element={<Circuitos />} />
          <Route path="/definicoes" element={<Definicoes />} />
        </Routes>
      </main>
    </Router>
  );
}
