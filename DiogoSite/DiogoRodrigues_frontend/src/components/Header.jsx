import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFlagCheckered, FaMapMarkerAlt, FaCog } from "react-icons/fa";
import logo from "../assets/logo.png";

const Header = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Endpoint do backend que retorna o estado da live (true/false)
    fetch("https://diogorodrigues-backend.onrender.com/api/youtube/live-status")
      .then((res) => res.json())
      .then((data) => setIsLive(data.isLive))
      .catch(() => setIsLive(false));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* LOGO + NOME */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-wide">Diogo Rodrigues</span>
            <span
              className={`text-xs font-medium ${
                isLive ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isLive ? "● Online" : "● Offline"}
            </span>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex space-x-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-1 text-red-500"
                : "flex items-center space-x-1 text-white hover:text-red-500"
            }
          >
            <FaHome /> <span>Início</span>
          </NavLink>

          <NavLink
            to="/corridas"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-1 text-red-500"
                : "flex items-center space-x-1 text-white hover:text-red-500"
            }
          >
            <FaFlagCheckered /> <span>Corridas</span>
          </NavLink>

          <NavLink
            to="/circuitos"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-1 text-red-500"
                : "flex items-center space-x-1 text-white hover:text-red-500"
            }
          >
            <FaMapMarkerAlt /> <span>Circuitos</span>
          </NavLink>

          <NavLink
            to="/definicoes"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-1 text-red-500"
                : "flex items-center space-x-1 text-white hover:text-red-500"
            }
          >
            <FaCog /> <span>Definições</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
