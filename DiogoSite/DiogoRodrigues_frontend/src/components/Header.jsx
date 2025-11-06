import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation();
  const links = [
    { path: "/", label: "Início" },
    { path: "/corridas", label: "Corridas" },
    { path: "/circuitos", label: "Circuitos" },
    { path: "/definicoes", label: "Definições" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-red-700 text-white flex items-center justify-between px-8 py-4 z-50">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="font-bold text-lg">Diogo Rodrigues</h1>
      </div>
      <nav className="flex gap-8">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`uppercase text-sm font-semibold ${
              location.pathname === link.path
                ? "text-red-500 border-b-2 border-red-500 pb-1"
                : "hover:text-red-400"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
