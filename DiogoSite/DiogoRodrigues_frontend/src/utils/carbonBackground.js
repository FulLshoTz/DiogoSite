export function startCarbonBackground() {
  const canvas = document.getElementById("carbon-bg");
  if (!canvas) {
    console.warn("⚠️ Canvas 'carbon-bg' não encontrado!");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("❌ Erro: não foi possível obter contexto 2D!");
    return;
  }

  console.log("✅ Canvas encontrado, iniciando animação...");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`📏 Canvas redimensionado: ${canvas.width}x${canvas.height}`);
  }

  window.addEventListener("resize", resize);
  resize();

  let t = 0;
  function draw() {
    const w = canvas.width;
    const h = canvas.height;

    // fundo preto
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // gradiente leve
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // linhas diagonais claras
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    const spacing = 15;

    for (let x = -h; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + (t % spacing), 0);
      ctx.lineTo(x + h + (t % spacing), h);
      ctx.stroke();
    }

    t += 0.3;
    requestAnimationFrame(draw);
  }

  draw();
}
