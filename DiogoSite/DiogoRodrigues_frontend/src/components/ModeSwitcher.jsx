import React from 'react';

const ModeSwitcher = ({ currentMode, onModeChange }) => {
  const baseClasses = "py-2 px-4 font-semibold rounded-md transition-colors text-sm sm:text-base";
  const activeClasses = "bg-red-600 text-white shadow-md";
  const inactiveClasses = "bg-neutral-800 hover:bg-neutral-700 text-neutral-300";

  return (
    <div className="flex justify-center bg-neutral-900 border border-neutral-800 p-2 rounded-xl mb-6 max-w-md mx-auto">
      <button
        onClick={() => onModeChange('comparison')}
        className={`${baseClasses} ${currentMode === 'comparison' ? activeClasses : inactiveClasses}`}
      >
        Comparação 1 vs 1
      </button>
      <button
        onClick={() => onModeChange('stint')}
        className={`${baseClasses} ml-2 ${currentMode === 'stint' ? activeClasses : inactiveClasses}`}
      >
        Análise de Stint
      </button>
    </div>
  );
};

export default ModeSwitcher;
