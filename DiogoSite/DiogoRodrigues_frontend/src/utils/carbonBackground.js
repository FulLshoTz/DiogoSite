export function startCarbonBackground() {
  const canvas = document.getElementById("carbon-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

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
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const spacing = 10;
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;

    for (let x = 0; x < w + h; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x - h, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    for (let x = 0; x < w + h; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x - h + 5 * Math.sin(t * 0.05), 0);
      ctx.lineTo(x + 5 * Math.cos(t * 0.05), h);
      ctx.stroke();
    }

    t += 1;
    requestAnimationFrame(draw);
  }

  draw();
}
