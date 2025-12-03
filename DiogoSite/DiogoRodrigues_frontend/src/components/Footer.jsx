import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-red-900/30 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* GRID PRINCIPAL (3 Colunas no PC, 1 no Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">

          {/* COLUNA 1: SOBRE */}
          <div className="space-y-4">
            <h3 className="text-2xl text-white tracking-wide" style={{ fontFamily: "RushDriver, sans-serif" }}>
              FulLshoT <span className="text-red-600">Hub</span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              O centro de comando definitivo para SimRacing. Acompanha as livestreams, 
              vê as últimas notícias e consulta estatísticas de corrida em tempo real.
            </p>
          </div>

          {/* COLUNA 2: LINKS RÁPIDOS */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Navegação</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link to="/" className="hover:text-red-500 transition-colors">Início</Link>
              <Link to="/corridas" className="hover:text-red-500 transition-colors">Histórico de Corridas</Link>
              <Link to="/circuitos" className="hover:text-red-500 transition-colors">Circuitos</Link>
              <Link to="/definicoes" className="hover:text-red-500 transition-colors">Definições</Link>
            </div>
          </div>

          {/* COLUNA 3: SOCIAL & CONTACTOS */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Conectar</h4>
            <div className="flex flex-col gap-3">
              
              <a 
                href="https://www.youtube.com/@FulLshoT" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">YT</span>
                YouTube Channel
              </a>

              <a 
                href="https://instagram.com/fullshotz" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span className="bg-pink-600 text-white px-2 py-0.5 rounded text-xs font-bold">IG</span>
                Instagram
              </a>

              {/* DICA: Transformei o email num link clicável */}
              <p className="text-gray-500 pt-2">
                Contacto: <a href="mailto:diogo@fullshot.pt" className="text-gray-300 hover:text-red-500 transition-colors">diogo@fullshot.pt</a>
              </p>

            </div>
          </div>

        </div>

        {/* COPYRIGHT (Fundo do Rodapé) */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Diogo "FulLshoT" Rodrigues. Todos os direitos reservados.</p>
          <p className="mt-1">Powered by React & SimRacing Passion.</p>
        </div>

      </div>
    </footer>
  );
}
