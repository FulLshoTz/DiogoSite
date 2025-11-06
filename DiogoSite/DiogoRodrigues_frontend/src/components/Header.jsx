import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const links = [
    { to: "/", label: "INÍCIO" },
    { to: "/corridas", label: "CORRIDAS" },
    { to: "/circuitos", label: "CIRCUITOS" },
    { to: "/definicoes", label: "DEFINIÇÕES" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-black/20 backdrop-blur-md border-b border-red-700/50 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center gap-3">
          <img
            src="https://diogorodrigues-frontend.onrender.com/assets/logo-DdUCgk7j.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <h1 className="font-bold text-lg text-white">Diogo Rodrigues</h1>
        </div>
        <nav className="flex gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `uppercase text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-red-500 border-b-2 border-red-500 pb-1"
                    : "text-white hover:text-red-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
