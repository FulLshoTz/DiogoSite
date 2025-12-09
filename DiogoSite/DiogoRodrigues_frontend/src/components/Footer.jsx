/* 🔴 REGRAS DO FOOTER:
   1. ESTRUTURA: Manter 3 colunas em Desktop, 1 em Mobile.
   2. LINKS: A navegação deve ser gerada pelo array 'linksNavegacao' (não hardcodar links soltos).
   3. CRÉDITOS: Manter sempre o ano dinâmico (new Date) e a menção "Powered by SimRacing Passion".
*/
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  // 🛠️ CONFIGURAÇÃO: Adiciona ou remove páginas aqui!
  const linksNavegacao = [
    { nome: "Início", path: "/" },
    { nome: "Histórico de Corridas", path: "/corridas" },
    { nome: "Circuitos", path: "/circuitos" },
    { nome: "Definições", path: "/definicoes" },
  ];

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

          {/* COLUNA 2: NAVEGAÇÃO DINÂMICA */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Navegação rápida</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              {linksNavegacao.map((link, index) => (
                <Link key={index} to={link.path} className="hover:text-red-500 transition-colors">
                  {link.nome}
                </Link>
              ))}
            </div>
          </div>

          {/* COLUNA 3: SOCIAL & CONTACTOS */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Contactos</h4>
            <div className="flex flex-col gap-3">
              <a href="https://www.youtube.com/@FulLshoT" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-8 h-auto" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.52 3.09C27.18 1.87 26.13.82 24.91.48 22.73 0 14 0 14 0S5.27 0 3.09.48C1.87.82.82 1.87.48 3.09 0 5.27 0 10 0 10s0 4.73.48 6.91c.34 1.22 1.39 2.27 2.61 2.61C5.27 20 14 20 14 20s8.73 0 10.91-.48c1.22-.34 2.27-1.39 2.61-2.61C28 14.73 28 10 28 10s0-4.73-.48-6.91zM11.2 14V6l7.2 4-7.2 4z" fill="#FF0000"/>
                </svg>
                YouTube Channel
              </a>
              <a href="https://instagram.com/fullshotz" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 448 512" fill="#DB2777" xmlns="http://www.w3.org/2000/svg">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/>
                </svg>
                Instagram
              </a>
              <a href="https://tiktok.com/@simracingfullshot" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 285 330" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#00f2ea" d="M219.2,0H285V119.53a47.32,47.32,0,0,1-41,46.21,42.23,42.23,0,0,1-4.22.42,47.28,47.28,0,0,1-47.28-47.28V47.28H126.83a47.28,47.28,0,1,1,0-94.56h44.13A47.28,47.28,0,0,1,219.2,0Z"/>
                    <path fill="#ff0050" d="M219.2,0h65.79V119.53a47.32,47.32,0,0,1-41,46.21,42.23,42.23,0,0,1-4.22.42,47.28,47.28,0,0,1-47.28-47.28V47.28H126.83a47.28,47.28,0,1,1,0-94.56h44.13A47.28,47.28,0,0,1,219.2,0Z" transform="translate(-13.43 -20.6)"/>
                    <path fill="#000000" d="M219.2,0h65.79V119.53a47.32,47.32,0,0,1-41,46.21,42.23,42.23,0,0,1-4.22.42,47.28,47.28,0,0,1-47.28-47.28V0H126.83a47.28,47.28,0,1,1,0-94.56h44.13A47.28,47.28,0,0,1,219.2,0Z" transform="translate(6.57 9.4)"/>
                </svg>
                TikTok
              </a>
              <p className="text-gray-500 pt-2 text-xs sm:text-sm">
                Contacto: <br/>
                <a href="mailto:fullshotgameplay@gmail.com" className="text-gray-300 hover:text-red-500 transition-colors">
                  fullshotgameplay@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs text-gray-600">
          <p>© {anoAtual} Diogo "FulLshoT" Rodrigues. Todos os direitos reservados.</p>
          <p className="mt-1 font-medium text-gray-500">Powered by <span className="text-red-800">SimRacing Passion</span>.</p>
        </div>
      </div>
    </footer>
  );
}