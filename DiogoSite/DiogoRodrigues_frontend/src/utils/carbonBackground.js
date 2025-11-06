export function startCarbonBackground() {
  const canvas = document.getElementById("carbon-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  let t = 0;
  function draw() {
    const w = canvas.width;
    const h = canvas.height;

    // Fundo gradiente base
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#050505");
    grad.addColorStop(1, "#101010");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Linhas diagonais claras
    const spacing = 12;
    ctx.lineWidth = 1.5;

    // camada 1 - tons de cinzento mais visíveis
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    for (let x = -h; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + (t % spacing), 0);
      ctx.lineTo(x + h + (t % spacing), h);
      ctx.stroke();
    }

    // camada 2 - linhas pretas entre as claras
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    for (let x = -h + spacing / 2; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x - (t % spacing), 0);
      ctx.lineTo(x + h - (t % spacing), h);
      ctx.stroke();
    }

    // camada 3 - reflexo animado leve
    const shine = ctx.createLinearGradient(0, 0, w, h);
    shine.addColorStop(0, "rgba(255,255,255,0)");
    shine.addColorStop(0.5, "rgba(255,255,255,0.05)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, w, h);

    t += 0.5;
    requestAnimationFrame(draw);
  }

  draw();
}
