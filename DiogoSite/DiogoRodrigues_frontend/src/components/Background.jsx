import React from "react";

export default function Background() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        // 1. Cor de fundo base (Cinzento escuro, já não é preto)
        backgroundColor: "#111111", 
      }}
    >
      {/* 2. TEXTURA DE FIBRA DE CARBONO REALISTA 
        Usamos um padrão "seamless" (sem costuras) que cria o efeito perfeito.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.6, // Aumenta isto se quiseres mais visível (0.4 a 0.8)
          // Esta imagem é um padrão minúsculo de carbono que se repete
          backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
        }}
      />

      {/* 3. SOMBRA NOS CANTOS (Vignette)
        Mantemos isto para dar aquele aspeto "premium" e focar no centro
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, transparent 50%, #000000 100%)",
        }}
      />
      
      {/* 4. Opcional: Um brilho vermelho muito subtil no topo para dar "vida" 
        Se não gostares, podes apagar este bloco div
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "300px",
          background: "linear-gradient(to bottom, rgba(220, 38, 38, 0.15), transparent)",
        }}
      />
    </div>
  );
}
