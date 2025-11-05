import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const baseClass =
    "text-white hover:text-red-500 transition-colors duration-300 font-medium";
  const activeClass = "text-red-500 font-bold";

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-90 backdrop-blur-md z-50 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO + NOME */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-white tracking-widest">
            Diogo Rodrigues
          </h1>
        </div>

        {/* MENU */}
        <nav className="flex space-x-8 text-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ""}`
            }
          >
            Início
          </NavLink>
          <NavLink
            to="/corridas"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ""}`
            }
          >
            Corridas
          </NavLink>
          <NavLink
            to="/circuitos"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ""}`
            }
          >
            Circuitos
          </NavLink>
          <NavLink
            to="/definicoes"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : ""}`
            }
          >
            Definições
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
