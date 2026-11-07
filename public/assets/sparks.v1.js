/*!
 * Pearl sparks: hovering a link or button releases a few tiny iridescent
 * sparks from the cursor. They drift outward on a gentle wave, shift through
 * pearl, lilac, sea-glass and soft gold, and twinkle out.
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

  // pearl palette: hues sweep from rose through lilac, sea-glass and gold
  function emit(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;   // mostly upward, fanned
      var sp = 26 + Math.random() * 46;
      sparks.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: 0.75 + Math.random() * 0.55,
        hue: Math.random() * 360, spin: 160 + Math.random() * 220,
        wob: 6 + Math.random() * 10, freq: 5 + Math.random() * 5, ph: Math.random() * 6.28,
        r: 0.9 + Math.random() * 1.3
      });
    }
    if (sparks.length > 90) sparks.splice(0, sparks.length - 90);
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
      s.vx *= 0.985; s.vy = s.vy * 0.985 - 6 * dt;                    // slow down, float up a touch
      s.x += s.vx * dt; s.y += s.vy * dt;
      // wave sideways to the direction of travel
      var len = Math.hypot(s.vx, s.vy) || 1, nx = -s.vy / len, ny = s.vx / len;
      var w = Math.sin(s.life * s.freq + s.ph) * s.wob * (1 - t * 0.5);
      var px = s.x + nx * w, py = s.y + ny * w;
      var a = Math.sin(Math.PI * Math.min(1, t * 1.25)) * (0.75 + 0.25 * Math.sin(s.life * 22 + s.ph)); // twinkle
      var h = (s.hue + s.spin * s.life) % 360;
      var r = s.r * (1 - t * 0.4);
      // soft iridescent halo, then a pearly core
      var g = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
      g.addColorStop(0, "hsla(" + h + ",80%,70%," + (0.6 * a).toFixed(3) + ")");
      g.addColorStop(1, "hsla(" + h + ",85%,72%,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r * 4, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "hsla(" + ((h + 40) % 360) + ",65%,76%," + (0.95 * a).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(px, py, r, 0, 6.2832); ctx.fill();
      // a short trailing glint
      ctx.strokeStyle = "hsla(" + h + ",75%,66%," + (0.5 * a).toFixed(3) + ")";
      ctx.lineWidth = r * 0.8; ctx.beginPath(); ctx.moveTo(px, py);
      ctx.lineTo(px - s.vx * 0.06, py - s.vy * 0.06); ctx.stroke();
    }
    raf = sparks.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }

  document.addEventListener("pointerover", function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    if (!el || el === hot) return;
    hot = el; emit(e.clientX, e.clientY, 5);
  }, { passive: true });
  document.addEventListener("pointerout", function (e) {
    if (hot && !(e.relatedTarget && hot.contains(e.relatedTarget))) hot = null;
  }, { passive: true });
  document.addEventListener("pointermove", function (e) {
    if (!hot) return;
    var now = performance.now();
    if (now - lastEmit > 120) { lastEmit = now; emit(e.clientX, e.clientY, 1); }
  }, { passive: true });

  function init() { document.body.appendChild(cv); size(); addEventListener("resize", size); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
