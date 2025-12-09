import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Início', path: '/' },
  { name: 'Treino & Análise', path: '/treino-analise' },
  { name: 'Definições', path: '/definicoes' },
];

export default function Navbar() {
  return (
    <nav className="flex justify-center gap-6 py-3 bg-black/70 border-b border-red-700">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `text-lg font-orbitron transition-colors ${
              isActive
                ? 'text-red-600 font-bold'
                : 'text-white hover:text-red-500'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}