import React, { useState } from 'react';
import ModeSwitcher from '../components/ModeSwitcher';
import LapComparison from '../components/LapComparison';
import StintAnalysis from '../components/StintAnalysis';

export default function TreinoAnalise() {
  const [mode, setMode] = useState('comparison'); // 'comparison' or 'stint'

  return (
    <div className="text-white max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "RushDriver" }}>
        Treino & Análise de Voltas
      </h1>

      <ModeSwitcher currentMode={mode} onModeChange={setMode} />

      {mode === 'comparison' && <LapComparison />}
      {mode === 'stint' && <StintAnalysis />}
      
    </div>
  );
}

