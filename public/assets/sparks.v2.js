/*!
 * Pearl sparks: hovering a link or button releases tiny, delicate glints.
 * Each is a pearly white point with a hairline four-ray star whose rays
 * carry the faintest iridescent tint, drifting on a soft wave and twinkling out.
 * Mouse and trackpad only; off for touch screens and reduced motion.
 */
(function () {
  "use strict";
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || still) return;

  var SEL = "a, button, [role=button], [role=tab]";
  var cv = document.createElement("canvas"), ctx = cv.getContext("2d");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:900";
  var dpr = 1, W = 0, H = 0, sparks = [], raf = 0, last = 0, hot = null, lastEmit = 0;

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function emit(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6;
      var sp = 14 + Math.random() * 34;
      sparks.push({
        x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: 0.6 + Math.random() * 0.6,
        hue: Math.random() * 360, spin: 120 + Math.random() * 180,
        wob: 2 + Math.random() * 4, freq: 6 + Math.random() * 6, ph: Math.random() * 6.28,
        r: 0.35 + Math.random() * 0.45,           // core radius in px: tiny
        ray: 2 + Math.random() * 3.5,             // star ray length in px
        rot: Math.random() * 0.8
      });
    }
    if (sparks.length > 140) sparks.splice(0, sparks.length - 140);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, W, H);
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.life += dt;
      var t = s.life / s.max;
      if (t >= 1) { sparks.splice(i, 1); continue; }
      s.vx *= 0.98; s.vy = s.vy * 0.98 - 5 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      var len = Math.hypot(s.vx, s.vy) || 1, nx = -s.vy / len, ny = s.vx / len;
      var w = Math.sin(s.life * s.freq + s.ph) * s.wob;
      var px = s.x + nx * w, py = s.y + ny * w;
      var tw = 0.6 + 0.4 * Math.sin(s.life * 26 + s.ph);                 // twinkle
      var a = Math.sin(Math.PI * Math.min(1, t * 1.2)) * tw;
      var h = (s.hue + s.spin * s.life) % 360;
      var ray = s.ray * (0.6 + 0.4 * tw) * (1 - t * 0.3), rot = s.rot + s.life * 1.5;

      // the faintest pastel bloom
      ctx.fillStyle = "hsla(" + h + ",90%,86%," + (0.22 * a).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(px, py, s.r * 3.2, 0, 6.2832); ctx.fill();

      // hairline four-ray star; each ray its own iridescent tint
      ctx.lineCap = "round"; ctx.lineWidth = 0.45;
      for (var k = 0; k < 4; k++) {
        var ang = rot + k * Math.PI / 2, rl = ray * (k % 2 ? 0.7 : 1);
        ctx.strokeStyle = "hsla(" + ((h + k * 70) % 360) + ",85%,80%," + (0.7 * a).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(ang) * rl, py + Math.sin(ang) * rl); ctx.stroke();
      }

      // a hairline pastel rim so the white core still reads on light paper, then the pearl
      ctx.fillStyle = "hsla(" + ((h + 180) % 360) + ",55%,74%," + (0.45 * a).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(px, py, s.r + 0.35, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(255,255,253," + Math.min(1, a * 1.1).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(px, py, s.r, 0, 6.2832); ctx.fill();
    }
    raf = sparks.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }

  document.addEventListener("pointerover", function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    if (!el || el === hot) return;
    hot = el; emit(e.clientX, e.clientY, 9);
  }, { passive: true });
  document.addEventListener("pointerout", function (e) {
    if (hot && !(e.relatedTarget && hot.contains(e.relatedTarget))) hot = null;
  }, { passive: true });
  document.addEventListener("pointermove", function (e) {
    if (!hot) return;
    var now = performance.now();
    if (now - lastEmit > 70) { lastEmit = now; emit(e.clientX, e.clientY, 2); }
  }, { passive: true });

  function init() { document.body.appendChild(cv); size(); addEventListener("resize", size); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
