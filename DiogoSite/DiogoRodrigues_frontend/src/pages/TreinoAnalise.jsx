/*
  PÁGINA DE TREINO E ANÁLISE DE VOLTAS - DOCUMENTAÇÃO DE FUNCIONALIDADES

  1. OBJETIVO DA PÁGINA:
     - Esta página serve como uma ferramenta de análise de vídeo para comparar duas voltas (ou secções) de vídeos do YouTube lado a lado.
     - O caso de uso principal é para sim-racing, permitindo a um piloto comparar a sua volta com uma volta de referência para analisar trajectórias, pontos de travagem e aceleração.

  2. FUNCIONALIDADES IMPLEMENTADAS:
     - CARREGAMENTO DE VÍDEOS: Permite ao utilizador inserir dois URLs de vídeos do YouTube e especificar um tempo de início para cada um (formato MM:SS ou HH:MM:SS).
     - SELEÇÃO DE QUALIDADE: O utilizador pode escolher a qualidade do vídeo (1080p, 720p, etc.) antes de carregar, para otimizar o desempenho em diferentes ligações à internet.
     - CONTROLOS SINCRONIZADOS: Um painel de controlo central permite:
       - Reproduzir (Play) e Pausar (Pause) ambos os vídeos em simultâneo.
       - Avançar/Recuar 1 segundo e 5 segundos em ambos os vídeos.
     - AJUSTE FINO (NUDGE): Cada vídeo tem controlos individuais para avançar ou recuar 0.1 segundos. Isto é crucial para corrigir pequenos desalinhamentos e garantir uma sincronização perfeita.
     - CONTROLO DE VOLUME: Cada vídeo possui um botão individual para Mute/Unmute, permitindo ouvir o áudio de apenas um dos vídeos.
     - ESTADO DE CARREGAMENTO (LOADING): Uma sobreposição (overlay) de "A carregar..." é mostrada enquanto os vídeos estão a ser preparados. Os controlos só se tornam ativos quando ambos os vídeos estão prontos para reprodução, garantindo que a sincronização funcione corretamente desde o início.
     - INTERFACE DINÂMICA: A interface muda entre a configuração dos vídeos e a visualização dos players.

  3. REGRAS TÉCNICAS E ARQUITETURA (A MANTER):
     - YOUTUBE IFrame API: A biblioteca 'react-youtube' é o núcleo desta funcionalidade. Toda a interação com os vídeos (play, pause, seek, mute) deve ser feita através das referências dos players (playerRefs) e da API do YouTube.
     - SINCRONIZAÇÃO: A função `syncAndExecute` e a função `seek` são a base para os controlos globais. Qualquer novo controlo global deve seguir este padrão.
     - GESTÃO DE ESTADO: O estado da aplicação (URLs, tempos, estado de reprodução, estado de carregamento) é gerido com React Hooks (`useState`, `useRef`, `useEffect`).
*/
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeMute, FaVolumeUp, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

// ... (utility functions getYouTubeID and timeToSeconds remain the same)
function getYouTubeID(url) {
  if (!url) return '';
  const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return undefined !== arr[2] ? arr[2].split(/[?&]/)[0] : arr[0];
}
function timeToSeconds(time) {
  if (!time) return 0;
  const parts = time.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

export default function TreinoAnalise() {
  const [video1, setVideo1] = useState({ url: 'https://www.youtube.com/watch?v=iH0I0oaGMQA', time: '0:12' });
  const [video2, setVideo2] = useState({ url: 'https://www.youtube.com/watch?v=jcHqSfzHBS8', time: '0:06' });
  
  const playerRefs = useRef({ p1: null, p2: null });
  
  const [showPlayers, setShowPlayers] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState({ p1: true, p2: true });
  const [playersReady, setPlayersReady] = useState({ p1: false, p2: false });
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState('hd720'); // Default quality

  const videoId1 = getYouTubeID(video1.url);
  const videoId2 = getYouTubeID(video2.url);

  // Effect to check if both players are ready
  useEffect(() => {
    if (playersReady.p1 && playersReady.p2) {
      setIsLoading(false);
    }
  }, [playersReady]);

  const handleLoadVideos = () => {
    if (videoId1 && videoId2) {
      setIsLoading(true);
      setPlayersReady({ p1: false, p2: false }); // Reset readiness
      setShowPlayers(true);
    } else {
      alert('Por favor, insira URLs válidos para os dois vídeos.');
    }
  };

  const onPlayerReady = (event, playerKey) => {
    playerRefs.current[playerKey] = event.target;
    const startTime = playerKey === 'p1' ? timeToSeconds(video1.time) : timeToSeconds(video2.time);
    event.target.setPlaybackQuality(quality);
    event.target.seekTo(startTime);
    event.target.mute();
    setPlayersReady(prev => ({ ...prev, [playerKey]: true }));
  };
  
  const handleToggleMute = (playerKey) => {
    const player = playerRefs.current[playerKey];
    if (player) {
      if (player.isMuted()) {
        player.unMute();
        setIsMuted(prev => ({ ...prev, [playerKey]: false }));
      } else {
        player.mute();
        setIsMuted(prev => ({ ...prev, [playerKey]: true }));
      }
    }
  };

  const nudgePlayer = async (playerKey, amount) => {
    const player = playerRefs.current[playerKey];
    if (player && typeof player.getCurrentTime === 'function') {
      const currentTime = await player.getCurrentTime();
      player.seekTo(currentTime + amount);
    }
  };

  const syncAndExecute = (action) => {
    Object.values(playerRefs.current).forEach(player => {
      if (player && typeof player[action] === 'function') {
        player[action]();
      }
    });
  };

  const seek = (amount) => {
    Object.values(playerRefs.current).forEach(async player => {
        if (player && typeof player.getCurrentTime === 'function') {
            const currentTime = await player.getCurrentTime();
            player.seekTo(currentTime + amount);
        }
    });
  };

  const handlePlayPause = () => {
    if (isLoading) return;
    if (isPlaying) {
      syncAndExecute('pauseVideo');
    } else {
      syncAndExecute('playVideo');
    }
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => {
    setShowPlayers(false);
    setPlayersReady({ p1: false, p2: false });
    setIsLoading(false);
    setIsPlaying(false);
  }
  
  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: { controls: 0, rel: 0 },
  };

  return (
    <div className="text-white max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "RushDriver" }}>
        Treino & Análise de Voltas
      </h1>

      {!showPlayers && (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg mb-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-3">
                  <h3 className="text-lg font-bold text-red-400">Vídeo Principal (Sua Volta)</h3>
                  <div><label className="text-sm font-semibold mb-1 block">URL do Vídeo</label><input type="text" value={video1.url} onChange={(e) => setVideo1({ ...video1, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Tempo de Início da Volta</label><input type="text" value={video1.time} onChange={(e) => setVideo1({ ...video1, time: e.target.value })} placeholder="MM:SS ou HH:MM:SS" className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              </div>
              <div className="space-y-3">
                  <h3 className="text-lg font-bold text-red-400">Vídeo de Comparação (Volta Rápida)</h3>
                  <div><label className="text-sm font-semibold mb-1 block">URL do Vídeo</label><input type="text" value={video2.url} onChange={(e) => setVideo2({ ...video2, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
                  <div><label className="text-sm font-semibold mb-1 block">Tempo de Início da Volta</label><input type="text" value={video2.time} onChange={(e) => setVideo2({ ...video2, time: e.target.value })} placeholder="MM:SS ou HH:MM:SS" className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div>
                    <label htmlFor="quality-select" className="mr-2 text-sm font-semibold text-neutral-300">Qualidade:</label>
                    <select
                        id="quality-select"
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="hd1080">1080p</option>
                        <option value="hd720">720p</option>
                        <option value="large">480p</option>
                        <option value="medium">360p</option>
                    </select>
                </div>
                <button onClick={handleLoadVideos} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">Carregar Vídeos</button>
            </div>
        </div>
      )}
      
      {showPlayers && (
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 animate-in fade-in duration-500">
            <div className={`flex items-center justify-center gap-2 sm:gap-4 bg-neutral-900 p-3 rounded-lg mb-4 ${isLoading ? 'cursor-not-allowed' : ''}`}>
                <button onClick={() => seek(-5)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 5s</button>
                <button onClick={() => seek(-1)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="text-sm"/></button>
                <button onClick={handlePlayPause} disabled={isLoading} className="disabled:opacity-50 text-white bg-red-600 hover:bg-red-700 transition-colors p-4 rounded-full text-xl shadow-lg">
                    {isPlaying ? <FaPause/> : <FaPlay/>}
                </button>
                <button onClick={() => seek(1)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaForward className="text-sm"/></button>
                <button onClick={() => seek(5)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full">5s <FaForward className="ml-1 inline-block"/></button>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
                        <div className="flex flex-col items-center gap-2 text-white">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>A carregar vídeos...</span>
                        </div>
                    </div>
                )}
                <div className={`relative aspect-video bg-black rounded-lg border border-neutral-700 overflow-hidden group transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <YouTube videoId={videoId1} opts={playerOpts} onReady={(e) => onPlayerReady(e, 'p1')} className="w-full h-full"/>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => nudgePlayer('p1', -0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"><FaAngleDoubleLeft size={12}/></button>
                        <button onClick={() => nudgePlayer('p1', 0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"><FaAngleDoubleRight size={12}/></button>
                        <button onClick={() => handleToggleMute('p1')} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors">{isMuted.p1 ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                    </div>
                </div>
                <div className={`relative aspect-video bg-black rounded-lg border border-neutral-700 overflow-hidden group transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <YouTube videoId={videoId2} opts={playerOpts} onReady={(e) => onPlayerReady(e, 'p2')} className="w-full h-full"/>
                     <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={() => nudgePlayer('p2', -0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"><FaAngleDoubleLeft size={12}/></button>
                        <button onClick={() => nudgePlayer('p2', 0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"><FaAngleDoubleRight size={12}/></button>
                        <button onClick={() => handleToggleMute('p2')} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors">{isMuted.p2 ? <FaVolumeMute /> : <FaVolumeUp />}</button>
                    </div>
                </div>
            </div>
            <div className="text-center mt-4">
                <button onClick={handleBack} className="text-sm text-neutral-400 hover:text-white">Voltar</button>
            </div>
        </div>
      )}
    </div>
  );
}

/*
Resumo do Projeto: Ferramenta de Análise de Vídeo para Sim-Racing
Módulo Atual: Treino & Análise de Voltas
O que foi feito e qual o seu propósito?

Foi desenvolvida uma nova página chamada "Treino & Análise", concebida como uma ferramenta de vídeo-análise de alta precisão para pilotos de simulação (e outras aplicações de análise de performance). O objetivo principal é permitir uma comparação detalhada e sincronizada entre duas performances gravadas em vídeo.

As funcionalidades implementadas incluem:

Comparação Lado a Lado: A interface carrega dois vídeos do YouTube, exibindo-os lado a lado para uma comparação visual direta.
Configuração Dinâmica: O utilizador pode inserir o URL de qualquer vídeo do YouTube e especificar o ponto exato de início (no formato MM:SS ou HH:MM:SS) para cada um. Isto permite focar a análise num segmento específico, como uma volta completa ou uma sequência de curvas.
Controlos de Reprodução Sincronizados: Um painel de controlo central gere a reprodução de ambos os vídeos em simultâneo. As ações de Play/Pause e de avanço/recuo (+/- 1 segundo e +/- 5 segundos) são aplicadas a ambos os vídeos, mantendo-os perfeitamente alinhados durante a análise.
Ajuste Fino (Nudge) e Controlo de Som: Para garantir uma sincronização perfeita ao nível do frame, cada vídeo possui controlos individuais para fazer micro-ajustes de tempo (+/- 0.1 segundos). Adicionalmente, cada leitor de vídeo tem um botão de Mute/Unmute independente, permitindo isolar o áudio de um dos vídeos.
Otimização de Carregamento: O utilizador pode selecionar a qualidade do vídeo antes de o carregar. Para garantir que a reprodução sincronizada não falha, a interface exibe um estado de "A carregar..." e só ativa os controlos quando ambos os vídeos estão prontos, evitando problemas de dessincronização.
Sugestões para Desenvolvimento Futuro (Roadmap)
A base atual é robusta e abre portas para várias evoluções que podem transformar esta página numa ferramenta ainda mais poderosa:

Análise de Múltiplas Voltas (Stint Analysis):

Funcionalidade: Permitir que o utilizador cole uma lista de tempos de volta (lap times). A ferramenta poderia criar dinamicamente uma grelha de vídeos, cada um posicionado no início de uma volta específica.
Benefício: Isto seria extremamente útil para analisar a consistência, a degradação de pneus ou a evolução da pilotagem ao longo de um stint (sequência de voltas), comparando a mesma curva em 10 ou 15 voltas diferentes.
Gestão de Sessões e Configurações:

Funcionalidade: Implementar uma forma de "Guardar Sessão" que armazene os links dos vídeos, os tempos de início e os ajustes finos.
Benefício: O utilizador poderia facilmente recarregar uma análise anterior sem ter de reintroduzir todos os dados. Inicialmente, isto pode ser feito usando o localStorage do navegador e, no futuro, através de contas de utilizador com armazenamento na nuvem.
Integração com Telemetria (Funcionalidade Avançada):

Funcionalidade: Permitir o upload de um ficheiro de dados de telemetria (exportado por softwares como MoTeC, AIM, etc.). A ferramenta poderia sincronizar esses dados com o vídeo e exibir gráficos de velocidade, aceleração, travagem e input do volante sobrepostos.
Benefício: Isto elevaria a análise a um nível profissional, combinando o feedback visual do vídeo com dados quantitativos.
Melhorias de Usabilidade (Quality of Life):

Anotações e Marcadores: Permitir que o utilizador adicione notas de texto em pontos específicos da linha do tempo do vídeo (ex: "ponto de travagem atrasado aqui").
Zoom e Panorâmica: Dar a possibilidade de ampliar uma zona específica do vídeo para observar detalhes minuciosos, como o movimento das mãos no volante ou a posição do carro na zebra.
O projeto está numa fase excelente, com uma funcionalidade central sólida e um enorme potencial de crescimento para se tornar uma referência para a comunidade de sim-racing.
*/

