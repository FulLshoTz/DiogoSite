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
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Navegação</h4>
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
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Conectar</h4>
            <div className="flex flex-col gap-3">
              <a href="https://www.youtube.com/@FulLshoT" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold w-8 text-center">YT</span>
                YouTube Channel
              </a>
              <a href="https://instagram.com/fullshotz" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <span className="bg-pink-600 text-white px-2 py-0.5 rounded text-xs font-bold w-8 text-center">IG</span>
                Instagram
              </a>
              <a href="https://tiktok.com/@simracingfullshot" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <span className="bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded text-xs font-bold w-8 text-center border border-cyan-800">TK</span>
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