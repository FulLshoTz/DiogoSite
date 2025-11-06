import React, { useEffect } from "react";

export default function Background() {
  useEffect(() => {
    // Apaga fundos pretos automáticos do Tailwind/Vite
    document.body.style.background = "transparent";
    document.getElementById("root").style.background = "transparent";

    // Cria camada de fundo animada
    const bg = document.createElement("div");
    bg.id = "carbon-bg";
    Object.assign(bg.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "-9999", // atrás de tudo
      pointerEvents: "none",
      backgroundImage: `
        repeating-linear-gradient(45deg, #1b1b1b 0px, #1b1b1b 2px, #0b0b0b 2px, #0b0b0b 4px),
        repeating-linear-gradient(-45deg, #1b1b1b 0px, #1b1b1b 2px, #0b0b0b 2px, #0b0b0b 4px),
        radial-gradient(circle at 30% 30%, rgba(255,0,0,0.15), rgba(0,0,0,0.9) 80%)
      `,
      backgroundSize: "12px 12px, 12px 12px, 100% 100%",
      backgroundBlendMode: "overlay",
      backgroundAttachment: "fixed",
      animation: "carbonShift 12s linear infinite",
    });

    // Injeta keyframes diretamente no documento
    const style = document.createElement("style");
    style.textContent = `
      @keyframes carbonShift {
        0% { background-position: 0 0, 0 0, 0 0; }
        50% { background-position: 12px 12px, -12px -12px, 0 0; }
        100% { background-position: 0 0, 0 0, 0 0; }
      }
    `;

    // Garante que só há uma camada
    document.querySelectorAll("#carbon-bg").forEach(el => el.remove());
    document.head.appendChild(style);
    document.body.prepend(bg);

    console.log("✅ Fundo de carbono ativo");

    return () => {
      bg.remove();
      style.remove();
    };
  }, []);

  return null;
}
