import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeMute, FaVolumeUp, FaAngleDoubleLeft, FaAngleDoubleRight, FaExpand, FaTimesCircle, FaCheckSquare, FaUndo } from 'react-icons/fa';

/*
 * =================================================================================================
 * DESCRIÇÃO COMPLETA DO COMPONENTE: LapComparison
 * =================================================================================================
 * 
 * OBJETIVO:
 * Este componente permite a comparação lado a lado de dois vídeos do YouTube, com controlos 
 * sincronizados e individuais, e um modo de tela cheia avançado. Foi desenhado para análise 
 * de voltas em corridas, mas pode ser usado para qualquer comparação de vídeo.
 * 
 * 
 * --- SECÇÕES E FUNCIONALIDADES ---
 * 
 * 1. ECRÃ DE CONFIGURAÇÃO INICIAL:
 *    - O utilizador insere os URLs de dois vídeos do YouTube.
 *    - Para cada vídeo, define um "Tempo de Início da Volta" (ex: "1:23"). Este é o ponto a 
 *      partir do qual o vídeo começará a tocar inicialmente.
 *    - Um seletor de "Qualidade" permite escolher a resolução preferida para os vídeos.
 *    - O botão "Carregar Vídeos" inicia a interface de comparação.
 * 
 * 2. VISTA DOS PLAYERS (MINIATURAS):
 *    - Após carregar, dois players de vídeo aparecem lado a lado.
 *    - A reprodução começa automaticamente assim que ambos os vídeos estão prontos.
 *    - CONTROLOS GLOBAIS (AO CENTRO):
 *      - Botão Play/Pause central: Inicia ou pausa AMBOS os vídeos em simultâneo para manter a sincronia.
 *      - Botões de avanço/recuo (1s, 5s): Aplicam o salto de tempo a AMBOS os vídeos.
 *    - CONTROLOS INDIVIDUAIS (POR BAIXO DE CADA VÍDEO):
 *      - Play/Pause individual: Controla apenas aquele vídeo específico, quebrando a sincronia geral.
 *      - Nudge (<< e >>): Ajusta o tempo de um vídeo em pequenos incrementos (0.1s) para uma sincronização fina.
 *      - Controlo de Volume: Ajusta o volume de cada vídeo independentemente. O volume é preservado ao entrar/sair da tela cheia.
 *      - Botão de Tela Cheia individual: Ativa o modo de tela cheia para apenas um vídeo.
 * 
 * 3. MODO DE TELA CHEIA (FUNCIONALIDADES ESPECIAIS):
 * 
 *    A. TELA CHEIA DE VÍDEO ÚNICO:
 *       - ATIVAÇÃO: Botão "Fullscreen" individual por baixo de cada miniatura.
 *       - COMPORTAMENTO CHAVE:
 *         - Mantém o Tempo: O vídeo em tela cheia começa a tocar EXATAMENTE do ponto em que a miniatura estava. Não reinicia.
 *         - Autoplay: A reprodução é iniciada automaticamente ao entrar em tela cheia.
 * 
 *    B. TELA CHEIA EM GRELHA (LADO A LADO):
 *       - ATIVAÇÃO: Botão com ícone de expansão na barra de controlos globais.
 *       - COMPORTAMENTO CHAVE:
 *         - Mantém o Tempo Individualmente: Cada um dos dois vídeos em tela cheia começa a tocar EXATAMENTE do ponto em que a sua respetiva miniatura estava. Isto preserva qualquer ajuste de sincronia fino feito anteriormente.
 *         - Autoplay: A reprodução é iniciada automaticamente para ambos os vídeos.
 *       - CONTROLOS NA TELA CHEIA EM GRELHA:
 *         - Uma nova barra de controlos aparece na parte inferior.
 *         - Controlos Individuais (Esquerda e Direita): Existem agora controlos individuais (play/pause, nudge, volume) para cada um dos vídeos em tela cheia.
 *         - Controlos Globais (Centro): Um botão Play/Pause central e botões de avanço/recuo permitem controlar ambos os vídeos em simultâneo.
 *         - Botões para Sair: Existem dois botões para sair da tela cheia: um ícone "X" no canto superior direito e um botão com texto e ícone no canto inferior direito.
 * 
 * 4. SINCRONIZAÇÃO AO SAIR DA TELA CHEIA:
 *    - Ao sair de QUALQUER modo de tela cheia (único ou grelha), o tempo de reprodução é capturado.
 *    - Os players em miniatura são então atualizados para esse mesmo tempo, garantindo que a reprodução possa continuar de forma transparente de onde parou na tela cheia.
 * 
 * 
 * --- DETALHES DE IMPLEMENTAÇÃO IMPORTANTES ---
 * 
 * - getYouTubeID() e timeToSeconds(): Funções utilitárias para extrair o ID do vídeo de um URL e converter o tempo de string para segundos.
 * - playerRefs e fsGridPlayerRefs: `useRef` é usado para manter referências diretas às instâncias dos players da API do YouTube, permitindo controlo imperativo (play, pause, seekTo).
 * - fullscreenTime (useState): Estado crucial. Guarda o tempo de reprodução antes de entrar em tela cheia. É um NÚMERO para o modo de vídeo único e um OBJETO ({ p1: time1, p2: time2 }) para o modo em grelha.
 * - onPlayerReady e onFsGridPlayerReady: Estes manipuladores são essenciais. Quando um player está pronto, eles usam o `fullscreenTime` (se aplicável) para fazer o `seekTo` para o tempo correto antes de iniciar a reprodução, garantindo que o vídeo não reinicie.
 * - modestbranding: 1 e controls: 0 (em playerOpts): Usados para minimizar a interface do YouTube e ter uma aparência mais "limpa", embora o YouTube não permita remover 100% da sua interface.
 * 
 * =================================================================================================
 */

// Utility functions
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

export default function LapComparison() {
  const [video1, setVideo1] = useState({ url: 'https://www.youtube.com/watch?v=iH0I0oaGMQA', time: '0:12' });
  const [video2, setVideo2] = useState({ url: 'https://www.youtube.com/watch?v=jcHqSfzHBS8', time: '0:06' });
  
  const playerRefs = useRef({ p1: null, p2: null });
  const fsGridPlayerRefs = useRef({});
  
  const [showPlayers, setShowPlayers] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState({ p1: 0, p2: 0 });
  const [playersReady, setPlayersReady] = useState({ p1: false, p2: false });
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState('hd720'); // Default quality

  // Fullscreen Grid State
  const fsGridRef = useRef(null);
  const [fsGridActive, setFsGridActive] = useState(false);
  const [fullscreenSource, setFullscreenSource] = useState(null); // 'grid', or 'p1', 'p2'
  const [fullscreenTime, setFullscreenTime] = useState(null); // Can be a number (single) or object (grid)
  const [fsGridIsPlaying, setFsGridIsPlaying] = useState(false);
  const [individualPlayState, setIndividualPlayState] = useState({ p1: true, p2: true });
  const [fsGridIndividualPlayState, setFsGridIndividualPlayState] = useState({ p1: true, p2: true });

  const videoId1 = getYouTubeID(video1.url);
  const videoId2 = getYouTubeID(video2.url);

  // Sync on fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = async () => {
        if (!document.fullscreenElement && fullscreenSource !== null) {
            // Exiting fullscreen
            let sourcePlayer = null;
            if (fullscreenSource === 'grid') {
                sourcePlayer = fsGridPlayerRefs.current['p1'] || fsGridPlayerRefs.current['p2'];
            } else {
                sourcePlayer = playerRefs.current[fullscreenSource];
            }

            if (sourcePlayer && typeof sourcePlayer.getCurrentTime === 'function') {
                const currentTime = await sourcePlayer.getCurrentTime();
                Object.values(playerRefs.current).forEach(p => p && typeof p.pauseVideo === 'function' && p.pauseVideo());
                Object.values(playerRefs.current).forEach(p => p && typeof p.seekTo === 'function' && p.seekTo(currentTime, true));
                if(isPlaying) {
                  setTimeout(() => Object.values(playerRefs.current).forEach(p => p && typeof p.playVideo === 'function' && p.playVideo()), 200);
                }
            }
            
            setFullscreenSource(null);
            setFsGridActive(false);
            setFullscreenTime(null);
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fullscreenSource, isPlaying]);


  useEffect(() => {
    if (playersReady.p1 && playersReady.p2) {
      setIsLoading(false);
      if (!isPlaying) {
        setIsPlaying(true);
        setIndividualPlayState({ p1: true, p2: true });
      }
    }
  }, [playersReady]);

  const handleLoadVideos = () => {
    if (videoId1 && videoId2) {
      setIsLoading(true);
      setPlayersReady({ p1: false, p2: false });
      setShowPlayers(true);
      setIsPlaying(false); // Reset for autoplay
    } else {
      alert('Por favor, insira URLs válidos para os dois vídeos.');
    }
  };

  const onPlayerReady = (event, playerKey) => {
    const player = event.target;
    playerRefs.current[playerKey] = player;

    let startTime = playerKey === 'p1' ? timeToSeconds(video1.time) : timeToSeconds(video2.time);

    // If entering single-video fullscreen, seek to the captured time and autoplay
    if (fullscreenSource === playerKey && typeof fullscreenTime === 'number') {
        startTime = fullscreenTime;
        player.playVideo();
    }
    
    player.seekTo(startTime, true);
    player.setPlaybackQuality(quality);
    
    const volume = volumes[playerKey];
    player.setVolume(volume);
    if (volume === 0) {
      player.mute();
    } else {
      player.unMute();
    }
    
    setPlayersReady(prev => ({ ...prev, [playerKey]: true }));
  };
  
  const handleVolumeChange = (playerKey, newVolume, refs = playerRefs) => {
    const player = refs.current[playerKey];
    if (!player) return;

    setVolumes(prev => ({ ...prev, [playerKey]: newVolume }));
    player.setVolume(newVolume);

    if (newVolume > 0 && player.isMuted()) {
        player.unMute();
    } else if (newVolume === 0 && !player.isMuted()) {
        player.mute();
    }
  };

  const handleFullscreen = async (playerKey) => {
    const player = playerRefs.current[playerKey];
    if (player && typeof player.getCurrentTime === 'function') {
        const currentTime = await player.getCurrentTime();
        setFullscreenTime(currentTime); // Store as a number
        setFullscreenSource(playerKey);

        const iframe = player.getIframe();
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            iframe.msRequestFullscreen();
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

  const syncAndExecute = (action, refs = playerRefs) => {
    Object.values(refs.current).forEach(player => {
      if (player && typeof player[action] === 'function') {
        player[action]();
      }
    });
    if(action.includes("play")){
      setIndividualPlayState({ p1: true, p2: true });
    }else if(action.includes("pause")){
      setIndividualPlayState({ p1: false, p2: false });
    }
  };

  const seek = (amount, refs = playerRefs) => {
    Object.values(refs.current).forEach(async player => {
        if (player && typeof player.getCurrentTime === 'function') {
            const currentTime = await player.getCurrentTime();
            player.seekTo(currentTime + amount);
        }
    });
  };

  const handlePlayPause = () => {
    if (isLoading) return;
    isPlaying ? syncAndExecute('pauseVideo') : syncAndExecute('playVideo');
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if(playerRefs.current.p1) {
      playerRefs.current.p1.seekTo(timeToSeconds(video1.time), true);
    }
    if(playerRefs.current.p2) {
      playerRefs.current.p2.seekTo(timeToSeconds(video2.time), true);
    }
    if(isPlaying){
      syncAndExecute('playVideo');
    }
  }
  
  const handleIndividualPlayPause = (playerKey) => {
    const player = playerRefs.current[playerKey];
    if (!player) return;

    const isCurrentlyPlaying = individualPlayState[playerKey];
    isCurrentlyPlaying ? player.pauseVideo() : player.playVideo();
    
    setIndividualPlayState(prev => ({...prev, [playerKey]: !isCurrentlyPlaying}));
  };

  const handleBack = () => {
    setShowPlayers(false);
    setPlayersReady({ p1: false, p2: false });
    setIsLoading(false);
    setIsPlaying(false);
  };
  
  // --- Fullscreen Grid ---
  const handleEnterFsGrid = async () => {
      const p1 = playerRefs.current['p1'];
      const p2 = playerRefs.current['p2'];
      if (p1 && p2 && typeof p1.getCurrentTime === 'function' && typeof p2.getCurrentTime === 'function') {
          const time1 = await p1.getCurrentTime();
          const time2 = await p2.getCurrentTime();
          setFullscreenTime({ p1: time1, p2: time2 }); // Store both times as an object
          
          fsGridPlayerRefs.current = {};
          setFsGridActive(true);
          setFullscreenSource('grid');
          setFsGridIsPlaying(true);
          setFsGridIndividualPlayState({ p1: true, p2: true });
          
          if (fsGridRef.current) {
              fsGridRef.current.requestFullscreen().catch(err => {
                  console.error("Error attempting to enable full-screen mode:", err);
              });
          }
      }
  };

  const handleExitFsGrid = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    setFsGridActive(false);
  };
  
  const onFsGridPlayerReady = (event, playerKey) => {
      const player = event.target;
      fsGridPlayerRefs.current[playerKey] = event.target;

      // On ready, seek to the captured time for grid mode
      if (fullscreenSource === 'grid' && fullscreenTime && typeof fullscreenTime === 'object') {
        const seekTime = fullscreenTime[playerKey];
        if (typeof seekTime === 'number') {
            player.seekTo(seekTime, true);
        }
      }

      // Set volume for the fullscreen player
      const volume = volumes[playerKey];
      player.setVolume(volume);
      if (volume === 0) {
          player.mute();
      } else {
          player.unMute();
      }

      // Sync playing state
      if (fsGridIsPlaying) {
          player.playVideo();
      } else {
          player.pauseVideo();
      }
  };

  const handleFsGridPlayPause = () => {
    const allPlaying = Object.values(fsGridIndividualPlayState).every(s => s);
    if (allPlaying) {
        syncAndExecute('pauseVideo', fsGridPlayerRefs);
        setFsGridIndividualPlayState({ p1: false, p2: false });
    } else {
        syncAndExecute('playVideo', fsGridPlayerRefs);
        setFsGridIndividualPlayState({ p1: true, p2: true });
    }
    setFsGridIsPlaying(!allPlaying);
  };

  const nudgeFsGridPlayer = async (playerKey, amount) => {
    const player = fsGridPlayerRefs.current[playerKey];
    if (player && typeof player.getCurrentTime === 'function') {
        const currentTime = await player.getCurrentTime();
        player.seekTo(currentTime + amount);
    }
  };
  
  const handleFsGridIndividualPlayPause = (playerKey) => {
    const player = fsGridPlayerRefs.current[playerKey];
    if (!player) return;

    const isCurrentlyPlaying = fsGridIndividualPlayState[playerKey];
    isCurrentlyPlaying ? player.pauseVideo() : player.playVideo();
    
    setFsGridIndividualPlayState(prev => {
        const newState = {...prev, [playerKey]: !isCurrentlyPlaying};
        // Also update the global FS play state if all are paused/playing
        const allPlaying = Object.values(newState).every(s => s);
        const anyPlaying = Object.values(newState).some(s => s);
        setFsGridIsPlaying(anyPlaying);
        return newState;
    });
  };
  
  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: { controls: 0, rel: 0, autoplay: 1, modestbranding: 1 },
  };

  return (
    <>
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
        <>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 animate-in fade-in duration-500">
                <div className={`flex items-center justify-between flex-wrap gap-2 sm:gap-4 bg-neutral-900 p-3 rounded-lg mb-4 ${isLoading ? 'cursor-not-allowed' : ''}`}>
                    <button onClick={handleBack} className="text-sm text-neutral-400 hover:text-white transition-colors">Voltar</button>
                    
                    <div className="flex items-center justify-center flex-grow gap-2 sm:gap-4">
                        <button onClick={() => seek(-5)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 5s</button>
                        <button onClick={() => seek(-1)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="text-sm"/></button>
                        <button onClick={handlePlayPause} disabled={isLoading} className="disabled:opacity-50 text-white bg-red-600 hover:bg-red-700 transition-colors p-4 rounded-full text-xl shadow-lg">
                            {isPlaying ? <FaPause/> : <FaPlay/>}
                        </button>
                        <button onClick={() => seek(1)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaForward className="text-sm"/></button>
                        <button onClick={() => seek(5)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full">5s <FaForward className="ml-1 inline-block"/></button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handleRestart} disabled={isLoading} className="text-white hover:text-red-500 transition-colors p-2 rounded-full" title="Restart"><FaUndo size={16} /></button>
                        <button onClick={handleEnterFsGrid} disabled={isLoading} className="text-white hover:text-red-500 transition-colors p-2 rounded-full" title="Fullscreen"><FaExpand size={16} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
                            <div className="flex flex-col items-center gap-2 text-white">
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>A carregar vídeos...</span>
                            </div>
                        </div>
                    )}
                    <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="relative aspect-video bg-black rounded-lg border border-neutral-700 overflow-hidden">
                          <YouTube videoId={videoId1} opts={{...playerOpts, playerVars: {...playerOpts.playerVars, start: timeToSeconds(video1.time)}}} onReady={(e) => onPlayerReady(e, 'p1')} className="w-full h-full"/>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-neutral-900 p-2 rounded-b-lg">
                            <button onClick={() => handleIndividualPlayPause('p1')} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title={individualPlayState.p1 ? "Pause" : "Play"}>{individualPlayState.p1 ? <FaPause size={12}/> : <FaPlay size={12}/>}</button>
                            <button onClick={() => nudgePlayer('p1', -5)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="-5s"><FaBackward size={12}/></button>
                            <button onClick={() => nudgePlayer('p1', -0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="-0.1s"><FaAngleDoubleLeft size={10}/></button>
                            <button onClick={() => nudgePlayer('p1', 0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="+0.1s"><FaAngleDoubleRight size={10}/></button>
                            <button onClick={() => nudgePlayer('p1', 5)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="+5s"><FaForward size={12}/></button>
                            <div className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors flex items-center gap-1">
                                {volumes.p1 > 0 ? <FaVolumeUp size={14}/> : <FaVolumeMute size={14}/>}
                                <input type="range" min="0" max="100" value={volumes.p1} onChange={(e) => handleVolumeChange('p1', parseInt(e.target.value, 10))} className="w-20 h-2 accent-red-600"/>
                            </div>
                            <button onClick={() => handleFullscreen('p1')} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="Fullscreen"><FaExpand size={12}/></button>
                        </div>
                    </div>
                    <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="relative aspect-video bg-black rounded-lg border border-neutral-700 overflow-hidden">
                          <YouTube videoId={videoId2} opts={{...playerOpts, playerVars: {...playerOpts.playerVars, start: timeToSeconds(video2.time)}}} onReady={(e) => onPlayerReady(e, 'p2')} className="w-full h-full"/>
                        </div>
                        <div className="flex items-center justify-center gap-2 bg-neutral-900 p-2 rounded-b-lg">
                            <button onClick={() => handleIndividualPlayPause('p2')} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title={individualPlayState.p2 ? "Pause" : "Play"}>{individualPlayState.p2 ? <FaPause size={12}/> : <FaPlay size={12}/>}</button>
                            <button onClick={() => nudgePlayer('p2', -5)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="-5s"><FaBackward size={12}/></button>
                            <button onClick={() => nudgePlayer('p2', -0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="-0.1s"><FaAngleDoubleLeft size={10}/></button>
                            <button onClick={() => nudgePlayer('p2', 0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="+0.1s"><FaAngleDoubleRight size={10}/></button>
                            <button onClick={() => nudgePlayer('p2', 5)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="+5s"><FaForward size={12}/></button>
                            <div className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors flex items-center gap-1">
                                {volumes.p2 > 0 ? <FaVolumeUp size={14}/> : <FaVolumeMute size={14}/>}
                                <input type="range" min="0" max="100" value={volumes.p2} onChange={(e) => handleVolumeChange('p2', parseInt(e.target.value, 10))} className="w-20 h-2 accent-red-600"/>
                            </div>
                            <button onClick={() => handleFullscreen('p2')} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="Fullscreen"><FaExpand size={12}/></button>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-4">
                </div>
            </div>

            {fsGridActive && (
                <div ref={fsGridRef} className="fixed inset-0 bg-black z-[100] flex flex-col">
                    <div className="grid grid-cols-2 gap-1 flex-grow">
                        <div className="relative w-full h-full">
                            <YouTube videoId={videoId1} opts={{...playerOpts, playerVars: {...playerOpts.playerVars, start: timeToSeconds(video1.time)}}} onReady={(e) => onFsGridPlayerReady(e, 'p1')} className="w-full h-full" />
                        </div>
                        <div className="relative w-full h-full">
                            <YouTube videoId={videoId2} opts={{...playerOpts, playerVars: {...playerOpts.playerVars, start: timeToSeconds(video2.time)}}} onReady={(e) => onFsGridPlayerReady(e, 'p2')} className="w-full h-full" />
                        </div>
                    </div>
                    <div className="bg-black/50 p-2 flex items-center justify-around gap-4 w-full">
                        {/* P1 Individual Controls */}
                        <div className="flex items-center justify-center gap-1 bg-neutral-800/50 p-2 rounded-lg">
                            <button onClick={() => handleFsGridIndividualPlayPause('p1')} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title={fsGridIndividualPlayState.p1 ? "Pause" : "Play"}>{fsGridIndividualPlayState.p1 ? <FaPause size={12}/> : <FaPlay size={12}/>}</button>
                            <button onClick={() => nudgeFsGridPlayer('p1', -5)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="-5s"><FaBackward size={12}/></button>
                            <button onClick={() => nudgeFsGridPlayer('p1', -0.1)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="-0.1s"><FaAngleDoubleLeft size={10}/></button>
                            <button onClick={() => nudgeFsGridPlayer('p1', 0.1)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="+0.1s"><FaAngleDoubleRight size={10}/></button>
                            <button onClick={() => nudgeFsGridPlayer('p1', 5)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="+5s"><FaForward size={12}/></button>
                            <div className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors flex items-center gap-1">
                                {volumes.p1 > 0 ? <FaVolumeUp size={14}/> : <FaVolumeMute size={14}/>}
                                <input type="range" min="0" max="100" value={volumes.p1} onChange={(e) => handleVolumeChange('p1', parseInt(e.target.value, 10), fsGridPlayerRefs)} className="w-20 h-2 accent-red-600"/>
                            </div>
                        </div>

                        {/* Central Global Controls */}
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => seek(-5, fsGridPlayerRefs)} className="text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 5s</button>
                            <button onClick={handleFsGridPlayPause} className="text-white bg-red-600 hover:bg-red-700 transition-colors p-4 rounded-full text-xl shadow-lg">{fsGridIsPlaying ? <FaPause/> : <FaPlay/>}</button>
                            <button onClick={() => seek(5, fsGridPlayerRefs)} className="text-white hover:text-red-500 transition-colors p-2 rounded-full">5s <FaForward className="ml-1 inline-block"/></button>
                        </div>

                        {/* P2 Individual Controls */}
                        <div className="flex items-center justify-center gap-1 bg-neutral-800/50 p-2 rounded-lg">
                            <button onClick={() => handleFsGridIndividualPlayPause('p2')} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title={fsGridIndividualPlayState.p2 ? "Pause" : "Play"}>{fsGridIndividualPlayState.p2 ? <FaPause size={12}/> : <FaPlay size={12}/>}</button>
                            <button onClick={() => nudgeFsGridPlayer('p2', -5)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="-5s"><FaBackward size={12}/></button>
                            <button onClick={() => nudgeFsGridPlayer('p2', -0.1)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="-0.1s"><FaAngleDoubleLeft size={10}/></button>
                            <button onClick={() => nudgeFsGridPlayer('p2', 0.1)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="+0.1s"><FaAngleDoubleRight size={10}/></button>
                            <button onClick={() => nudgeFsGridPlayer('p2', 5)} className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors" title="+5s"><FaForward size={12}/></button>
                            <div className="text-white p-2 rounded-full hover:bg-neutral-700 transition-colors flex items-center gap-1">
                                {volumes.p2 > 0 ? <FaVolumeUp size={14}/> : <FaVolumeMute size={14}/>}
                                <input type="range" min="0" max="100" value={volumes.p2} onChange={(e) => handleVolumeChange('p2', parseInt(e.target.value, 10), fsGridPlayerRefs)} className="w-20 h-2 accent-red-600"/>
                            </div>
                        </div>
                        
                        <button onClick={handleExitFsGrid} className="absolute right-4 top-4 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors"><FaTimesCircle size={24}/></button>
                    </div>
                    <button onClick={handleExitFsGrid} className="absolute bottom-4 right-4 border border-white text-white px-4 py-2 rounded-lg flex items-center hover:bg-white hover:text-black transition-colors">
                        <FaTimesCircle className="inline-block mr-2"/> Sair
                    </button>
                </div>
            )}
        </>
      )}
    </>
  );
}
