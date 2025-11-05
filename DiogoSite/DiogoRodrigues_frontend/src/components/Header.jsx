import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const links = [
    { name: "Início", path: "/" },
    { name: "Corridas", path: "/corridas" },
    { name: "Circuitos", path: "/circuitos" },
    { name: "Definições", path: "/definicoes" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-neutral-950/95 backdrop-blur-md z-50 shadow-lg border-b border-neutral-800">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Nome */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Diogo Rodrigues
          </h1>
        </div>

        {/* Links */}
        <ul className="hidden md:flex gap-8">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `font-semibold transition ${
                    isActive
                      ? "text-red-600 border-b-2 border-red-600 pb-1"
                      : "text-gray-300 hover:text-red-500 hover:font-bold"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
