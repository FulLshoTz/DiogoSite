/*
  🔴 REGRAS E FUNCIONALIDADES DA PÁGINA DE ANÁLISE 🔴

  Esta página serve como um hub para duas ferramentas principais de análise de vídeo, alternáveis através do componente `ModeSwitcher`.

  --- MODO 1: COMPARAÇÃO DE VOLTAS (LapComparison.jsx) ---
  1.  **Setup**: Permite ao utilizador inserir URLs e tempos de início para dois vídeos (ex: a sua volta vs. uma volta de referência).
  2.  **Sincronização**: Os dois vídeos são carregados e sincronizados. Um painel de controlo principal permite dar play/pause e fazer seek em ambos os vídeos em simultâneo.
  3.  **Controlos Individuais**: Cada vídeo tem controlos que aparecem com o rato (hover) para:
      -   Ajustar o tempo em +/- 5 segundos e +/- 0.1 segundos.
      -   Ativar o modo de ecrã cheio para aquele vídeo.
      -   Controlar o volume individualmente com um slider (começam em mute).
  4.  **Ecrã Cheio Duplo**: Um botão "Ver Ambos em Ecrã Cheio" permite ver os dois vídeos lado a lado, ocupando o ecrã inteiro, com os seus próprios controlos sincronizados.
  5.  **Sincronia ao Sair do Fullscreen**: Ao sair de qualquer modo de ecrã cheio (individual ou duplo), todos os vídeos na vista principal são automaticamente sincronizados para o tempo do vídeo que estava em foco, evitando desalinhamentos.

  --- MODO 2: ANÁLISE DE STINT (StintAnalysis.jsx) ---
  1.  **Setup**: Permite ao utilizador inserir a URL de um vídeo, o tempo de início do stint e uma lista de tempos de volta (um por linha).
  2.  **Geração da Grelha**: O sistema gera uma grelha vertical, onde cada linha contém:
      -   Um player de vídeo do YouTube, sincronizado para o início dessa volta específica.
      -   Controlos individuais (como no modo de comparação).
      -   Campos para ver/ajustar o tempo de início e a duração da volta.
  3.  **Recálculo Dinâmico**:
      -   Um botão "Recalcular Próximos" recalcula os tempos de início de todas as voltas seguintes com base na duração da volta atual.
      -   Um botão "Crosshairs" permite definir o tempo de início da volta a partir da posição atual do vídeo e recalcular as seguintes.
  4.  **Ecrã Cheio em Grelha (Multi-Seleção)**:
      -   O utilizador pode selecionar várias voltas através de checkboxes.
      -   Um botão "Ver Selecionados" ativa um modo de ecrã cheio que mostra apenas os vídeos selecionados, arrumados numa grelha.
      -   Este modo tem os seus próprios controlos sincronizados (play/pause, seek).
  5.  **Sincronia ao Sair do Fullscreen**: Tal como no modo de comparação, ao sair do ecrã cheio (individual ou em grelha), todos os vídeos da vista principal são ressincronizados.

  --- REGRAS GERAIS DE IMPLEMENTAÇÃO ---
  -   Todos os vídeos começam com volume a 0 (mute) para evitar cacofonia.
  -   Todos os vídeos começam a tocar automaticamente (autoplay) assim que são carregados, e o botão de controlo principal reflete este estado (mostrando "Pause").
*/
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