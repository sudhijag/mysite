// Animated dot grid: a slow radial ripple from the top-centre plus a gentle diagonal drift.
// About 1 in 80 dots is gold (deterministic, so positions are stable across loads).
(() => {
  const cv = document.getElementById('dots'), ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAP = 22, INK = '236,230,212', GOLD = '212,168,90';
  const isGold = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s) < 0.012; };
  let w, h;
  const resize = () => {
    const dpr = devicePixelRatio || 1;
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) draw(0);
  };
  const draw = (ms) => {
    const t = reduce ? 0 : ms / 1000, cx = w * 0.5, cy = h * 0.28;
    ctx.clearRect(0, 0, w, h);
    for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) {
      const wave = Math.sin(Math.hypot(x - cx, y - cy) * 0.018 - t * 1.1) * 0.5 + 0.5;
      const drift = Math.sin(x * 0.006 + y * 0.004 + t * 0.6) * 0.5 + 0.5;
      const k = Math.pow(wave, 3) * 0.7 + drift * 0.3;
      const g = isGold(Math.round(x / GAP), Math.round(y / GAP));
      ctx.fillStyle = g ? `rgba(${GOLD},${0.45 + k * 0.5})` : `rgba(${INK},${0.08 + k * 0.32})`;
      ctx.beginPath(); ctx.arc(x, y, g ? 1.2 + k * 0.6 : 0.7 + k * 0.7, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) rafId = requestAnimationFrame(draw);
  };
  let rafId;
  const start = () => { if (!reduce) rafId = requestAnimationFrame(draw); };
  const stop = () => cancelAnimationFrame(rafId);
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  resize();
  start();
})();
