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
        backgroundColor: "#050505", // Fundo base quase preto
      }}
    >
      {/* =================================================================
         ESCOLHA O TEU ESTILO AQUI (Comenta um e desconta o outro)
         =================================================================
      */}

      {/* --- OPÇÃO 1: FIBRA DE CARBONO (Atual) --- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15, // Controla a intensidade do carbono (0.1 a 0.3)
          backgroundImage: `
            linear-gradient(27deg, #151515 5px, transparent 5px),
            linear-gradient(207deg, #151515 5px, transparent 5px),
            linear-gradient(27deg, #222 5px, transparent 5px),
            linear-gradient(207deg, #222 5px, transparent 5px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 0, 0 10px, 10px 5px",
        }}
      />

      {/* --- OPÇÃO 2: TECH GRID (Moderno / SimRacing UI) --- 
          Para usar este, comenta o <div> de cima e desconta este:
      */}
      {/* <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      */}

      {/* ================================================================= */}
      
      {/* VIGNETTE (Sombra nos cantos para dar ar profissional) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, transparent 40%, #000000 100%)",
        }}
      />
    </div>
  );
}
