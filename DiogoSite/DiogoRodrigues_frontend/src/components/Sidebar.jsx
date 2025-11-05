import React from "react";
import { FaYoutube, FaChartLine, FaFlagCheckered, FaCogs } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const items = [
    { path: "/", icon: <FaYoutube />, label: "Vídeos" },
    { path: "/corridas", icon: <FaChartLine />, label: "Corridas" },
    { path: "/circuitos", icon: <FaFlagCheckered />, label: "Circuitos" },
    { path: "/definicoes", icon: <FaCogs />, label: "Definições" },
  ];

  return (
    <div className="fixed left-6 top-1/3 flex flex-col gap-6 z-40">
      {items.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center text-sm ${
            location.pathname === item.path
              ? "text-red-500 scale-110"
              : "text-gray-400 hover:text-red-500"
          } transition-transform duration-300`}
        >
          <div className="text-lg">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
