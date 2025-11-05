import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Início" },
    { path: "/corridas", label: "Corridas" },
    { path: "/circuitos", label: "Circuitos" },
    { path: "/definicoes", label: "Definições" }
  ];

  return (
    <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-red-600 z-50">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Diogo Rodrigues
          </h1>
        </div>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm uppercase tracking-widest font-semibold ${
                location.pathname === item.path
                  ? "text-red-600"
                  : "text-gray-300 hover:text-red-500"
              } transition-colors duration-300`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
