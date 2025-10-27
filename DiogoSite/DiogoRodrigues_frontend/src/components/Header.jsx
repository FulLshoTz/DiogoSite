import React from 'react'
import { FaYoutube, FaInstagram } from 'react-icons/fa'
import logo from '../assets/logo.png' // coloca aqui o ficheiro WbibHsjQ.png e renomeia para logo.png

export default function Header() {
  return (
    <header className="w-full bg-neutral-950 bg-opacity-90 backdrop-blur sticky top-0 z-50 shadow-lg border-b border-red-700">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full border border-red-600" />
          <h1 className="text-xl font-bold text-white">Diogo Rodrigues</h1>
        </div>

        <nav className="flex space-x-6">
          <a href="#" className="hover:text-red-500 transition">Início</a>
          <a
            href="https://www.youtube.com/@FulLShoT"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-red-500 transition"
          >
            <FaYoutube /> YouTube
          </a>
          <a
            href="https://www.instagram.com/diofdx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-red-500 transition"
          >
            <FaInstagram /> Instagram
          </a>
        </nav>
      </div>
    </header>
  )
}
