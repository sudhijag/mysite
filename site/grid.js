// Homepage background: falling sakura petals with the original dot field as the alternate.
(() => {
  const cv = document.getElementById('dots');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const toggle = document.getElementById('background-toggle');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const GAP = 22, PETAL = '241,151,181', GOLD = '212,168,90';
  const STORAGE_KEY = 'mysite-background-petals';
  const isHomepage = Boolean(toggle);
  const isGold = (i, j) => {
    const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return s - Math.floor(s) < 0.012;
  };

  let w = 0, h = 0, rafId = null, petals = [];
  let petalsOn = true;
  if (isHomepage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'false') petalsOn = false;
    } catch (_) {}
    syncToggle();
  }

  function syncToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(petalsOn));
    document.body.dataset.background = petalsOn ? 'petals' : 'dots';
  }

  const makePetals = () => {
    let seed = 7919;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const baseCount = Math.min(52, Math.max(22, Math.round((w * h) / 26000)));
    const count = Math.round(baseCount * 1.25);
    petals = Array.from({length: count}, () => ({
      x: random() * w,
      y: random() * h,
      size: 4.5 + random() * 5,
      speed: 8 + random() * 15,
      drift: 8 + random() * 22,
      phase: random() * Math.PI * 2,
      turn: random() * Math.PI * 2,
      spin: (random() - 0.5) * 0.18,
      alpha: 0.16 + random() * 0.2
    }));
  };

  const drawDots = (t) => {
    const cx = w * 0.5, cy = h * 0.28;
    const highlight = isHomepage && !petalsOn ? GOLD : PETAL;
    const ink = isHomepage && !petalsOn ? '236,230,212' : '243,232,238';
    for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) {
      const wave = Math.sin(Math.hypot(x - cx, y - cy) * 0.018 - t * 1.1) * 0.5 + 0.5;
      const drift = Math.sin(x * 0.006 + y * 0.004 + t * 0.6) * 0.5 + 0.5;
      const k = Math.pow(wave, 3) * 0.7 + drift * 0.3;
      const pink = isGold(Math.round(x / GAP), Math.round(y / GAP));
      ctx.fillStyle = pink ? `rgba(${highlight},${0.45 + k * 0.5})` : `rgba(${ink},${0.08 + k * 0.32})`;
      ctx.beginPath();
      ctx.arc(x, y, pink ? 1.2 + k * 0.6 : 0.7 + k * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawPetals = (t) => {
    for (const petal of petals) {
      const y = ((petal.y + t * petal.speed) % (h + 32)) - 16;
      const x = petal.x + Math.sin(t * 0.28 + petal.phase) * petal.drift;
      const angle = petal.turn + t * petal.spin + Math.sin(t * 0.2 + petal.phase) * 0.16;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgba(${PETAL},${petal.alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, -petal.size);
      ctx.bezierCurveTo(petal.size * 0.72, -petal.size * 0.72, petal.size * 0.68, petal.size * 0.12, 0, petal.size);
      ctx.bezierCurveTo(-petal.size * 0.68, petal.size * 0.12, -petal.size * 0.72, -petal.size * 0.72, 0, -petal.size);
      ctx.fill();
      ctx.strokeStyle = `rgba(${PETAL},${petal.alpha * 0.5})`;
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.moveTo(0, -petal.size * 0.65);
      ctx.quadraticCurveTo(petal.size * 0.08, 0, 0, petal.size * 0.65);
      ctx.stroke();
      ctx.restore();
    }
  };

  const draw = (ms = 0) => {
    const t = reduceMotion.matches ? 0 : ms / 1000;
    ctx.clearRect(0, 0, w, h);
    if (isHomepage && petalsOn) drawPetals(t);
    else drawDots(t);
    if (!reduceMotion.matches && !document.hidden) rafId = requestAnimationFrame(draw);
    else rafId = null;
  };

  const stop = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  };
  const render = () => {
    stop();
    draw(0);
  };

  const resize = () => {
    const dpr = devicePixelRatio || 1;
    w = cv.clientWidth;
    h = cv.clientHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makePetals();
    render();
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      petalsOn = !petalsOn;
      syncToggle();
      try { localStorage.setItem(STORAGE_KEY, String(petalsOn)); } catch (_) {}
      render();
    });
  }

  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : render());
  reduceMotion.addEventListener('change', render);
  resize();
})();
