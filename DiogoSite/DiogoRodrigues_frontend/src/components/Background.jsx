import React, { useEffect } from "react";

export default function Background() {
  useEffect(() => {
    // remove camadas antigas
    document.querySelectorAll("#carbon-bg").forEach(el => el.remove());

    // cria o canvas
    const canvas = document.createElement("canvas");
    canvas.id = "carbon-bg";
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "-9999",
      pointerEvents: "none",
      background: "black",
    });
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let w, h, frame = 0;
    const size = 10;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function drawCarbon() {
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < h; y += size) {
        for (let x = 0; x < w; x += size) {
          const shade =
            ((x / size + y / size + frame) % 2 === 0)
              ? "rgba(30,30,30,0.9)"
              : "rgba(10,10,10,0.9)";
          ctx.fillStyle = shade;
          ctx.fillRect(x, y, size, size);
        }
      }

      // overlay vermelho suave
      const grad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.8);
      grad.addColorStop(0, "rgba(255,0,0,0.12)");
      grad.addColorStop(1, "rgba(0,0,0,0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function animate() {
      frame += 0.03;
      drawCarbon();
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();

    console.log("✅ Fundo de carbono ativo (canvas)");

    return () => {
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);

  return null;
}
