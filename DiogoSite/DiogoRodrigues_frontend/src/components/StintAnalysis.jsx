// StintAnalysis Component: In-Depth Functional & Architectural Overview
//
// This component is a comprehensive tool for motorsport race analysis, enabling users to synchronize and compare multiple laps from a single YouTube video. It transforms a list of lap times into a multi-video analysis dashboard.
//
// --- Component Architecture & State ---
//
// The component's logic is primarily managed by React hooks:
// - `useState`: Manages UI state (e.g., `isLoading`, `isPlaying`), user inputs (`videoUrl`, `lapTimesInput`), and derived data (`lapData`).
// - `useRef`: Holds persistent but non-re-rendering data, crucially the `react-youtube` player instances (`playerRefs`, `fsGridPlayerRefs`) for direct API control.
// - `useEffect`: Handles side effects, such as:
//   - Detecting when all players are ready (`onPlayerReady`) to enable UI controls.
//   - Listening for the browser's 'fullscreenchange' event to synchronize the main grid's time after exiting any fullscreen mode.
//
// --- Key State Variables ---
// - `lapData`: An array of objects, where each object represents a lap and stores its `id`, `duration`, and calculated `startTime` in the video. This is the central data structure for the analysis grid.
// - `playersReady`: An object that tracks the ready status of each individual YouTube player instance.
// - `selectedLaps`: An array of lap IDs chosen by the user for the fullscreen comparison grid.
// - `fullscreenSource`: A state variable that tracks what is currently in fullscreen ('grid' for the comparison grid, a lap `id` for a single player, or `null`). This is crucial for correctly synchronizing time on exit.
//
// --- Core Functional Flow ---
//
// 1. **Setup & Configuration (`return`'s initial view):**
//    - The user inputs a YouTube video URL, a master start time for the first lap (e.g., "1:04:21"), and a newline-separated list of lap times.
//    - The `handleGenerate` function is triggered on button click.
//
// 2. **Analysis Grid Generation (`handleGenerate`):**
//    - It parses the raw lap times.
//    - It calculates the absolute `startTime` for each lap by cumulatively adding lap durations to the master start time.
//    - This data populates the `lapData` state, which causes the main grid view to render.
//    - It resets player states (`playersReady`, `playerRefs`) to prepare for the new set of videos.
//
// 3. **Main Analysis Grid (Primary View):**
//    - A `map` over `lapData` renders a row for each lap.
//    - Each row contains a `<YouTube>` component. Its `opts` are configured with the lap's specific `startTime`.
//    - **Global Controls:** A sticky header has buttons that call `handlePlayPause` and `seek`. These functions iterate over all player instances in `playerRefs.current` and execute the corresponding action (e.g., `playVideo()`, `seekTo()`), ensuring synchronized playback.
//    - **Individual Lap Controls:**
//      - **Time Adjustment:** `nudgePlayer` allows for fine-grained seeking on an individual player.
//      - **Duration & Start Time Recalculation:**
//        - `handleLapDurationChange`: Updates a lap's duration in the `lapData` state.
//        - `recalculateFromLap`: Triggered after a duration change, this function recalculates the `startTime` for all subsequent laps and seeks their players to the new times.
//        - `handleSetStartTimeFromPlayer`: Gets the current time from a player and uses it as a new anchor point, calling `recalculateFromLap` to update subsequent laps.
//      - **Selection:** `handleLapSelect` adds/removes a lap's ID from the `selectedLaps` array.
//
// 4. **Fullscreen Comparison Grid (`handleEnterFsGrid` & `fsGridActive` view):**
//    - `handleEnterFsGrid` is called when the "Ver (X)" button is clicked.
//    - It captures the current playback time of each selected lap from the main grid and stores it in the `fullscreenTime` state.
//    - It sets `fsGridActive` to true, which renders the fullscreen modal (`<div ref={fsGridRef} ...>`).
//    - The browser's `requestFullscreen()` API is called on this modal.
//    - Inside the modal, a new grid of `<YouTube>` players is rendered based on `selectedLaps`. The `onFsGridPlayerReady` function ensures each new player seeks to its captured time from the main grid.
//    - This view has its own independent but synchronized controls (`handleFsGridPlayPause`, `seek` with `fsGridPlayerRefs`).
//
// 5. **Fullscreen Exit Synchronization (`useEffect` with `fullscreenchange`):**
//    - An event listener on the `document` detects when the browser exits fullscreen mode.
//    - If it detects an exit (`!document.fullscreenElement`), it identifies which video was the source (`fullscreenSource`).
//    - It captures the final playback time from that source video.
//    - It then programmatically seeks *all* players in the *main grid* to this captured time.
//    - This ensures a seamless and synchronized transition back from any fullscreen view (single player or comparison grid) to the main analysis grid.
//
// --- Utility Functions ---
// - `getYouTubeID`: Extracts the unique video ID from various YouTube URL formats.
// - `timeToSeconds`, `lapTimeToSeconds`, `secondsToTime`: A suite of functions to handle conversions between "M:SS.ms" time formats and total seconds, which are necessary for all time calculations.

import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeMute, FaVolumeUp, FaAngleDoubleLeft, FaAngleDoubleRight, FaSyncAlt, FaCrosshairs, FaExpand, FaCheckSquare, FaTimesCircle } from 'react-icons/fa';

// --- Utility Functions ---
function getYouTubeID(url) {
  if (!url) return '';
  const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/live\/)/);
  return undefined !== arr[2] ? arr[2].split(/[?&]/)[0] : arr[0];
}

function timeToSeconds(time) {
  if (!time) return 0;
  const parts = String(time).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

function lapTimeToSeconds(time) {
    if (!time) return 0;
    const parts = String(time).split(':');
    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return (parseInt(minutes, 10) * 60) + parseFloat(seconds);
    }
    const parsed = parseFloat(time);
    return isNaN(parsed) ? 0 : parsed;
}

function secondsToTime(totalSeconds) {
    if (isNaN(totalSeconds)) return '0:00.000';
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60);
    
    let timeString = '';
    if (hours > 0) {
        timeString += `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
    } else {
        timeString += `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`;
    }
    return timeString;
}

// --- Component ---
const StintAnalysis = () => {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/live/vOGHaAc_ims?si=t0pCtvRks6xuZm0x');
  const [masterStartTime, setMasterStartTime] = useState('1:04:21');
  const [lapTimesInput, setLapTimesInput] = useState('1:40.500\n1:37.100\n1:37.500\n1:38.200');
  const [quality, setQuality] = useState('hd720');
  
  const [showGrid, setShowGrid] = useState(false);
  const [lapData, setLapData] = useState([]);
  const [videoId, setVideoId] = useState('');
  
  const playerRefs = useRef({});
  const fsGridPlayerRefs = useRef({});
  const [playersReady, setPlayersReady] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState({});

  // Fullscreen Grid State
  const fsGridRef = useRef(null);
  const [selectedLaps, setSelectedLaps] = useState([]);
  const [fsGridActive, setFsGridActive] = useState(false);
  const [fullscreenSource, setFullscreenSource] = useState(null); // 'grid', or lapId
  const [fullscreenTime, setFullscreenTime] = useState(null);
  const [fsGridIsPlaying, setFsGridIsPlaying] = useState(false);
  const [fsGridIndividualPlayState, setFsGridIndividualPlayState] = useState({});


  // Sync on fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = async () => {
        if (!document.fullscreenElement && fullscreenSource !== null) {
            // Exiting fullscreen
            let sourcePlayer = null;
            if (fullscreenSource === 'grid') {
                const firstSelectedId = selectedLaps[0];
                sourcePlayer = fsGridPlayerRefs.current[firstSelectedId];
            } else {
                sourcePlayer = playerRefs.current[fullscreenSource];
            }

            if (sourcePlayer && typeof sourcePlayer.getCurrentTime === 'function') {
                const currentTime = await sourcePlayer.getCurrentTime();
                // Pause main grid players before seeking
                Object.values(playerRefs.current).forEach(p => p && typeof p.pauseVideo === 'function' && p.pauseVideo());
                // Seek all main grid players to the time of the fullscreen video
                Object.values(playerRefs.current).forEach(p => p && typeof p.seekTo === 'function' && p.seekTo(currentTime, true));
                // If the main grid was playing, resume playback
                if(isPlaying) {
                  setTimeout(() => Object.values(playerRefs.current).forEach(p => p && typeof p.playVideo === 'function' && p.playVideo()), 200);
                }
            }
            
            setFullscreenSource(null);
            setFsGridActive(false); // Ensure grid is hidden
            setFullscreenTime(null);
        }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fullscreenSource, isPlaying, selectedLaps]);

  useEffect(() => {
    if (showGrid && lapData.length > 0) {
        const readyCount = Object.values(playersReady).filter(Boolean).length;
        if (readyCount === lapData.length) {
            setIsLoading(false);
            // Videos are set to autoplay, so update the UI to show the pause button
            if (!isPlaying) {
                setIsPlaying(true);
            }
        }
    }
  }, [playersReady, lapData, showGrid]);

  const handleGenerate = () => {
    const rawTimes = lapTimesInput.split('\n').filter(t => t.trim() !== '');
    if (!videoUrl || rawTimes.length === 0) return alert("URL e tempos de volta são necessários.");

    setIsLoading(true);
    setVideoId(getYouTubeID(videoUrl));

    let cumulativeTime = timeToSeconds(masterStartTime);
    const newLapData = rawTimes.map((time, index) => {
      const lapStart = cumulativeTime;
      cumulativeTime += lapTimeToSeconds(time);
      return { id: index, duration: time, startTime: lapStart };
    });

    setLapData(newLapData);
    
    const initialVolumeState = newLapData.reduce((acc, lap) => {
        acc[lap.id] = 0; // Start muted
        return acc;
    }, {});
    setVolumes(initialVolumeState);

    setPlayersReady({});
    playerRefs.current = {};
    setShowGrid(true);
    setIsPlaying(false); // Reset playing state so the useEffect can correctly set it
    setSelectedLaps([]);
  };
  
  const handleLapDurationChange = (id, newDuration) => {
      setLapData(prevData => prevData.map(lap => lap.id === id ? { ...lap, duration: newDuration } : lap));
  };

  const recalculateFromLap = (lapId, isNewStartTime = false, newStartTimeValue = 0) => {
    setIsLoading(true);
    setLapData(prevData => {
        const newData = [...prevData];
        let cumulativeTime;
        let loopStartIndex;

        if (isNewStartTime) {
            // Came from "Set start time" button
            newData[lapId].startTime = newStartTimeValue;
            cumulativeTime = newStartTimeValue + lapTimeToSeconds(newData[lapId].duration);
            loopStartIndex = lapId + 1;
        } else {
            // Came from "Recalculate next laps" button (after a duration change)
            cumulativeTime = newData[lapId].startTime + lapTimeToSeconds(newData[lapId].duration);
            loopStartIndex = lapId + 1;
        }

        // Recalculate subsequent laps
        for (let i = loopStartIndex; i < newData.length; i++) {
            newData[i].startTime = cumulativeTime;
            cumulativeTime += lapTimeToSeconds(newData[i].duration);
        }

        // Give React time to re-render before seeking players
        setTimeout(() => {
            for (let i = loopStartIndex; i < newData.length; i++) {
                const player = playerRefs.current[newData[i].id];
                if(player && typeof player.seekTo === 'function') {
                    player.seekTo(newData[i].startTime, true);
                }
            }
            setIsLoading(false);
        }, 100);

        return newData;
    });
  };

  const handleSetStartTimeFromPlayer = async (lapId) => {
      const player = playerRefs.current[lapId];
      if (!player || typeof player.getCurrentTime !== 'function') return;
      
      const newStartTime = await player.getCurrentTime();
      recalculateFromLap(lapId, true, newStartTime);
  };

  const onPlayerReady = (event, lapId, startTime) => {
    const player = event.target;
    playerRefs.current[lapId] = player;
    
    let effectiveStartTime = startTime;
    // If entering single-lap fullscreen, use the captured time and autoplay
    if (fullscreenSource === lapId && typeof fullscreenTime === 'number') {
        effectiveStartTime = fullscreenTime;
        player.playVideo();
    }

    player.seekTo(effectiveStartTime, true);
    player.setPlaybackQuality(quality);
    
    const volume = volumes[lapId];
    player.setVolume(volume);
    if (volume === 0) {
        player.mute();
    } else {
        player.unMute();
    }

    setPlayersReady(prev => ({ ...prev, [lapId]: true }));
  };

  const handleVolumeChange = (lapId, newVolume, refs = playerRefs) => {
    const player = refs.current[lapId];
    if (!player) return;

    setVolumes(prev => ({ ...prev, [lapId]: newVolume }));
    player.setVolume(newVolume);

    if (newVolume > 0 && player.isMuted()) {
        player.unMute();
    } else if (newVolume === 0 && !player.isMuted()) {
        player.mute();
    }
  };

  const handleFullscreen = async (lapId) => {
    const player = playerRefs.current[lapId];
    if (player && typeof player.getCurrentTime === 'function') {
        const currentTime = await player.getCurrentTime();
        setFullscreenTime(currentTime);
        setFullscreenSource(lapId); // Track which video entered fullscreen
        
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

  const nudgePlayer = async (lapId, amount, refs = playerRefs) => {
    const player = refs.current[lapId];
    if (player && typeof player.getCurrentTime === 'function') {
      const currentTime = await player.getCurrentTime();
      player.seekTo(currentTime + amount, true);
    }
  };

  // --- Main Grid Controls ---
  const syncAndExecute = (action, refs = playerRefs) => Object.values(refs.current).forEach(p => p && typeof p[action] === 'function' && p[action]());
  const seek = (amount, refs = playerRefs) => Object.values(refs.current).forEach(async p => {
    if (p && typeof p.getCurrentTime === 'function') {
        const currentTime = await p.getCurrentTime();
        p.seekTo(currentTime + amount, true);
    }
  });
  
  const handlePlayPause = () => {
    if (isLoading) return;
    isPlaying ? syncAndExecute('pauseVideo') : syncAndExecute('playVideo');
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => {
    setShowGrid(false);
    setIsLoading(false);
    setIsPlaying(false);
    setLapData([]);
    setSelectedLaps([]);
  };

  // --- Fullscreen Grid ---
  const handleLapSelect = (lapId) => {
    setSelectedLaps(prev => 
        prev.includes(lapId) 
            ? prev.filter(id => id !== lapId) 
            : [...prev, lapId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLaps.length === lapData.length) {
      setSelectedLaps([]); // Deselect all
    } else {
      setSelectedLaps(lapData.map(lap => lap.id)); // Select all
    }
  };

  const handleEnterFsGrid = async () => {
    if (selectedLaps.length === 0) return;

    const timeCapturePromises = selectedLaps.map(async (lapId) => {
        const player = playerRefs.current[lapId];
        if (player && typeof player.getCurrentTime === 'function') {
            const time = await player.getCurrentTime();
            return { id: lapId, time: time };
        }
        return { id: lapId, time: null };
    });

    const capturedTimes = await Promise.all(timeCapturePromises);
    const timeMap = capturedTimes.reduce((acc, curr) => {
        if (curr.time !== null) {
            acc[curr.id] = curr.time;
        }
        return acc;
    }, {});
      
    const initialFsPlayState = selectedLaps.reduce((acc, lapId) => {
        acc[lapId] = true; // Start as playing
        return acc;
    }, {});
    setFsGridIndividualPlayState(initialFsPlayState);

    setFullscreenTime(timeMap);
    fsGridPlayerRefs.current = {};

    setFsGridActive(true);
    setFullscreenSource('grid');
    setFsGridIsPlaying(true); // Autoplay on entry
    
    if (fsGridRef.current) {
        fsGridRef.current.requestFullscreen().catch(err => {
            console.error("Error attempting to enable full-screen mode:", err);
        });
    }
  };

  const handleExitFsGrid = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    setFsGridActive(false);
  };
  
  const onFsGridPlayerReady = (event, lapId) => {
      const player = event.target;
      fsGridPlayerRefs.current[lapId] = player;

      // On ready, seek to the captured time
      if (fullscreenSource === 'grid' && fullscreenTime && typeof fullscreenTime === 'object') {
          const seekTime = fullscreenTime[lapId];
          if (typeof seekTime === 'number') {
              player.seekTo(seekTime, true);
          }
      }

      // Set volume for the fullscreen player
      const volume = volumes[lapId];
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
        const newPlayState = Object.keys(fsGridIndividualPlayState).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        setFsGridIndividualPlayState(newPlayState);
    } else {
        syncAndExecute('playVideo', fsGridPlayerRefs);
        const newPlayState = Object.keys(fsGridIndividualPlayState).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setFsGridIndividualPlayState(newPlayState);
    }
    setFsGridIsPlaying(!allPlaying);
  };

  const handleFsGridIndividualPlayPause = (lapId) => {
    const player = fsGridPlayerRefs.current[lapId];
    if (!player) return;

    const isCurrentlyPlaying = fsGridIndividualPlayState[lapId];
    isCurrentlyPlaying ? player.pauseVideo() : player.playVideo();

    setFsGridIndividualPlayState(prev => {
        const newState = { ...prev, [lapId]: !isCurrentlyPlaying };
        const anyPlaying = Object.values(newState).some(s => s);
        setFsGridIsPlaying(anyPlaying);
        return newState;
    });
  };


  const playerOpts = { height: '100%', width: '100%', playerVars: { controls: 0, rel: 0, autoplay: 1, modestbranding: 1 }};

  if (showGrid) {
    return (
      <>
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 animate-in fade-in duration-500">
            <div className="sticky top-0 z-50 bg-neutral-950 py-3 mb-4">
                <div className={`flex items-center justify-between flex-wrap gap-1 sm:gap-3 bg-neutral-900 p-3 rounded-lg ${isLoading ? 'cursor-not-allowed' : ''}`}>
                    <button onClick={handleBack} className="text-sm text-neutral-400 hover:text-white transition-colors">« Voltar</button>
                    
                    <div className="flex items-center justify-center flex-grow">
                        <button onClick={() => seek(-15)} disabled={isLoading} className="hidden sm:inline-block disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 15s</button>
                        <button onClick={() => seek(-5)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 5s</button>
                        <button onClick={() => seek(-1)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="text-sm"/></button>
                        <button onClick={handlePlayPause} disabled={isLoading} className="disabled:opacity-50 text-white bg-red-600 hover:bg-red-700 transition-colors p-4 rounded-full text-xl shadow-lg">{isPlaying ? <FaPause/> : <FaPlay/>}</button>
                        <button onClick={() => seek(1)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaForward className="text-sm"/></button>
                        <button onClick={() => seek(5)} disabled={isLoading} className="disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full">5s <FaForward className="ml-1 inline-block"/></button>
                        <button onClick={() => seek(15)} disabled={isLoading} className="hidden sm:inline-block disabled:opacity-50 text-white hover:text-red-500 transition-colors p-2 rounded-full">15s <FaForward className="ml-1 inline-block"/></button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleSelectAll} className="text-sm bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-3 rounded-md">
                            {selectedLaps.length === lapData.length ? 'Limpar' : 'Todos'}
                        </button>
                        <button onClick={handleEnterFsGrid} disabled={selectedLaps.length === 0} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg disabled:bg-neutral-600 disabled:cursor-not-allowed">
                            <FaCheckSquare className="inline-block mr-2"/> Ver ({selectedLaps.length})
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative">
            {isLoading && ( <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"><div className="flex flex-col items-center gap-2 text-white"><svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>A carregar...</span></div></div>)}
            <div className="grid grid-cols-1 gap-6">
                {lapData.map((lap) => (
                <div key={lap.id} className="flex flex-col sm:flex-row items-start gap-4 p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className={`w-full sm:w-2/3 relative aspect-video bg-black rounded-lg border border-neutral-700 overflow-hidden group transition-opacity duration-500`}>
                        <div className="absolute top-1 left-2 z-10 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">Volta {lap.id + 1}</div>
                        <YouTube videoId={videoId} opts={{...playerOpts, playerVars: {...playerOpts.playerVars, start: lap.startTime}}} onReady={(e) => onPlayerReady(e, lap.id, lap.startTime)} className="w-full h-full" />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={() => nudgePlayer(lap.id, -5)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="-5s"><FaBackward size={12}/></button>
                            <button onClick={() => nudgePlayer(lap.id, -0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="-0.1s"><FaAngleDoubleLeft size={10}/></button>
                            <button onClick={() => nudgePlayer(lap.id, 0.1)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="+0.1s"><FaAngleDoubleRight size={10}/></button>
                            <button onClick={() => nudgePlayer(lap.id, 5)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="+5s"><FaForward size={12}/></button>
                            <div className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors flex items-center gap-1">
                                {volumes[lap.id] > 0 ? <FaVolumeUp size={14}/> : <FaVolumeMute size={14}/>}
                                <input type="range" min="0" max="100" value={volumes[lap.id]} onChange={(e) => handleVolumeChange(lap.id, parseInt(e.target.value, 10))} className="w-20 h-2 accent-red-600"/>
                            </div>
                            <button onClick={() => handleFullscreen(lap.id)} className="bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors" title="Fullscreen"><FaExpand size={12}/></button>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/3 space-y-2 p-2">
                        <div className="flex justify-end">
                            <input type="checkbox" checked={selectedLaps.includes(lap.id)} onChange={() => handleLapSelect(lap.id)} className="form-checkbox h-6 w-6 bg-neutral-700 border-neutral-600 text-red-600 focus:ring-red-500 rounded-md" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div>
                                <label className="text-sm font-semibold text-neutral-400 block">Início no Vídeo</label>
                                <span className="text-lg font-mono text-white">{secondsToTime(lap.startTime)}</span>
                            </div>
                            <button onClick={() => handleSetStartTimeFromPlayer(lap.id)} className="p-2 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/40" title="Definir Início a partir do tempo atual do vídeo"><FaCrosshairs/></button>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-neutral-400 block">Duração da Volta</label>
                            <input type="text" value={lap.duration} onChange={(e) => handleLapDurationChange(lap.id, e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"/>
                            <button onClick={() => recalculateFromLap(lap.id, false)} className="mt-2 w-full text-sm bg-red-600/80 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">Recalcular Próximos</button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            <div className="text-center mt-4"><button onClick={handleBack} className="text-sm text-neutral-400 hover:text-white">Voltar</button></div>
        </div>

        {fsGridActive && (
            <div ref={fsGridRef} className="fixed inset-0 bg-black z-[100] flex flex-col">
                <div className={`grid gap-1 flex-grow grid-cols-${Math.ceil(Math.sqrt(selectedLaps.length))}`}>
                    {lapData.filter(lap => selectedLaps.includes(lap.id)).map(lap => (
                        <div key={`fs-${lap.id}`} className="relative w-full h-full group">
                            <div className="absolute top-1 left-2 z-20 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">Volta {lap.id + 1}</div>
                            <YouTube videoId={videoId} opts={{...playerOpts, playerVars: {...playerOpts.playerVars, start: lap.startTime}}} onReady={(e) => onFsGridPlayerReady(e, lap.id)} className="w-full h-full" />
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 bg-black/50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <button onClick={() => handleFsGridIndividualPlayPause(lap.id)} className="text-white p-2 rounded-full hover:bg-neutral-700" title={fsGridIndividualPlayState[lap.id] ? "Pause" : "Play"}>{fsGridIndividualPlayState[lap.id] ? <FaPause size={12}/> : <FaPlay size={12}/>}</button>
                                <button onClick={() => nudgePlayer(lap.id, -5, fsGridPlayerRefs)} className="text-white p-2 rounded-full hover:bg-neutral-700" title="-5s"><FaBackward size={12}/></button>
                                <button onClick={() => nudgePlayer(lap.id, -0.1, fsGridPlayerRefs)} className="text-white p-2 rounded-full hover:bg-neutral-700" title="-0.1s"><FaAngleDoubleLeft size={10}/></button>
                                <button onClick={() => nudgePlayer(lap.id, 0.1, fsGridPlayerRefs)} className="text-white p-2 rounded-full hover:bg-neutral-700" title="+0.1s"><FaAngleDoubleRight size={10}/></button>
                                <button onClick={() => nudgePlayer(lap.id, 5, fsGridPlayerRefs)} className="text-white p-2 rounded-full hover:bg-neutral-700" title="+5s"><FaForward size={12}/></button>
                                <div className="text-white p-2 rounded-full hover:bg-neutral-700 flex items-center gap-1">
                                    {volumes[lap.id] > 0 ? <FaVolumeUp size={14}/> : <FaVolumeMute size={14}/>}
                                    <input type="range" min="0" max="100" value={volumes[lap.id]} onChange={(e) => handleVolumeChange(lap.id, parseInt(e.target.value, 10), fsGridPlayerRefs)} className="w-20 h-2 accent-red-600"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-black/50 p-2 flex items-center justify-center gap-4">
                    <button onClick={() => seek(-15, fsGridPlayerRefs)} className="text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 15s</button>
                    <button onClick={() => seek(-5, fsGridPlayerRefs)} className="text-white hover:text-red-500 transition-colors p-2 rounded-full"><FaBackward className="mr-1 inline-block"/> 5s</button>
                    <button onClick={handleFsGridPlayPause} className="text-white bg-red-600 hover:bg-red-700 transition-colors p-4 rounded-full text-xl shadow-lg">{fsGridIsPlaying ? <FaPause/> : <FaPlay/>}</button>
                    <button onClick={() => seek(5, fsGridPlayerRefs)} className="text-white hover:text-red-500 transition-colors p-2 rounded-full">5s <FaForward className="ml-1 inline-block"/></button>
                    <button onClick={() => seek(15, fsGridPlayerRefs)} className="text-white hover:text-red-500 transition-colors p-2 rounded-full">15s <FaForward className="ml-1 inline-block"/></button>
                </div>
                <button onClick={handleExitFsGrid} className="absolute bottom-4 right-4 border border-white text-white px-4 py-2 rounded-lg flex items-center hover:bg-white hover:text-black transition-colors">
                    <FaTimesCircle className="inline-block mr-2"/> Sair
                </button>
            </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg animate-in fade-in duration-500">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-red-400 mb-2">Configuração da Análise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold mb-1 block">URL do Vídeo</label><input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              <div><label className="text-sm font-semibold mb-1 block">Início da Análise (HH:MM:SS)</label><input type="text" value={masterStartTime} onChange={(e) => setMasterStartTime(e.target.value)} placeholder="0:00:00" className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-400 mb-2">Tempos de Volta</h3>
          <label className="text-sm font-semibold mb-1 block">Cole os tempos, um por linha (ex: 1:45.123)</label>
          <textarea value={lapTimesInput} onChange={(e) => setLapTimesInput(e.target.value)} placeholder="1:45.123&#10;1:45.567&#10;1:46.012" rows="8" className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div><label htmlFor="quality-select" className="mr-2 text-sm font-semibold text-neutral-300">Qualidade:</label><select id="quality-select" value={quality} onChange={(e) => setQuality(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"><option value="hd1080">1080p</option><option value="hd720">720p</option><option value="large">480p</option><option value="medium">360p</option></select></div>
        <button onClick={handleGenerate} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg disabled:bg-red-800 disabled:cursor-not-allowed" disabled={!videoUrl || !lapTimesInput}>Gerar Análise</button>
      </div>
    </div>
  );
};
export default StintAnalysis;
