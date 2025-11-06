import React, { useEffect } from "react";

export default function Background() {
  useEffect(() => {
    const bg = document.createElement("div");
    bg.id = "carbon-bg";
    Object.assign(bg.style, {
      position: "fixed",
      inset: "0",
      zIndex: "-1",
      backgroundImage: `
        repeating-linear-gradient(45deg, #1b1b1b 0px, #1b1b1b 2px, #0b0b0b 2px, #0b0b0b 4px),
        repeating-linear-gradient(-45deg, #1b1b1b 0px, #1b1b1b 2px, #0b0b0b 2px, #0b0b0b 4px),
        radial-gradient(circle at 30% 30%, rgba(255, 0, 0, 0.15), rgba(0, 0, 0, 0.9) 80%)
      `,
      backgroundSize: "12px 12px, 12px 12px, 100% 100%",
      backgroundAttachment: "fixed",
      backgroundBlendMode: "overlay",
      animation: "carbonShift 12s linear infinite",
    });

    // cria keyframes dinamicamente
    const style = document.createElement("style");
    style.textContent = `
      @keyframes carbonShift {
        0% { background-position: 0 0, 0 0, 0 0; }
        50% { background-position: 12px 12px, -12px -12px, 0 0; }
        100% { background-position: 0 0, 0 0, 0 0; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(bg);

    return () => {
      bg.remove();
      style.remove();
    };
  }, []);

  return null;
}
