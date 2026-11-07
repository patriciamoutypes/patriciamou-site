/*!
 * Spiral trail: as the cursor moves, a guide point follows about half an inch
 * behind it and leaves tiny hairline spirals that furl in, curling in turn to
 * the left, back and right, then fade. When the cursor stops, the guide glides
 * back into it and the trail settles; a still cursor makes nothing.
 * Pearly pastel with a faint iridescent shift along the stroke.
 * Mouse and trackpad only; off for touch screens and reduced motion.
 */
(function () {
  "use strict";
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || still) return;

  var TAU = Math.PI * 2, SEG = 30;
  var cv = document.createElement("canvas"), ctx = cv.getContext("2d");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:900";
  var dpr = 1, W = 0, H = 0, coils = [], raf = 0, last = 0;
  var cx = -1, cy = -1, gx = -1, gy = -1, mx = 1, my = 0, travel = 0, turn = 0, LAG = 48;

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // one spiral, starting at the cursor and coiling toward its own centre
  function spawn(x, y) {
    var side = turn % 3; turn++;                         // 0 left, 1 back, 2 right
    var len = Math.hypot(mx, my) || 1, ux = mx / len, uy = my / len;
    var dx, dy, chir;
    if (side === 0) { dx = uy; dy = -ux; chir = -1; }        // to the left of travel
    else if (side === 1) { dx = -ux; dy = -uy; chir = (turn & 2) ? 1 : -1; } // behind
    else { dx = -uy; dy = ux; chir = 1; }                    // to the right
    var R = 3.5 + Math.random() * 3.5;
    coils.push({
      cx: x + dx * R, cy: y + dy * R, dx: dx, dy: dy, R: R,
      a0: Math.atan2(-dy, -dx), chir: chir, turns: 1.6 + Math.random() * 0.8,
      life: 0, furl: 0.42 + Math.random() * 0.18, max: 1.15 + Math.random() * 0.45,
      hue: Math.random() * 360
    });
    if (coils.length > 60) coils.splice(0, coils.length - 60);
  }

  function point(c, s) {                                 // s: 0 outer end (at the cursor) .. 1 centre
    var ang = c.a0 + c.chir * c.turns * TAU * s;
    var rho = c.R * Math.pow(1 - s, 1.15);
    return [c.cx + rho * Math.cos(ang), c.cy + rho * Math.sin(ang)];
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    // the guide eases toward the cursor, never more than about half an inch behind
    var settling = false;
    if (gx >= 0) {
      var ox = gx, oy = gy, k = 1 - Math.pow(0.0009, dt);          // ~6.9/s ease
      gx += (cx - gx) * k; gy += (cy - gy) * k;
      var bx = cx - gx, by = cy - gy, bd = Math.hypot(bx, by);
      if (bd > LAG) { gx = cx - bx / bd * LAG; gy = cy - by / bd * LAG; bd = LAG; }
      var step = Math.hypot(gx - ox, gy - oy);
      if (step > 0.05) { mx = mx * 0.7 + (gx - ox) * 0.3; my = my * 0.7 + (gy - oy) * 0.3; }
      travel += step;
      if (travel > 15) { travel = 0; spawn(gx, gy); }
      settling = bd > 0.6;
      if (!settling) { gx = cx; gy = cy; }
    }
    for (var i = coils.length - 1; i >= 0; i--) {
      var c = coils[i];
      c.life += dt;
      if (c.life >= c.max) { coils.splice(i, 1); continue; }
      // drift gently away along the curl direction and a touch upward
      c.cx += c.dx * 6 * dt; c.cy += c.dy * 6 * dt - 3 * dt;
      var drawn = Math.min(1, c.life / c.furl);
      drawn = 1 - Math.pow(1 - drawn, 3);                // ease out
      var fade = c.life < c.furl ? 1 : 1 - (c.life - c.furl) / (c.max - c.furl);
      var a = Math.max(0, fade);
      var n = Math.max(2, Math.round(SEG * drawn)), prev = point(c, 0), k, p, h;

      // faint rim underneath so the pale stroke still reads on light paper
      ctx.strokeStyle = "hsla(" + ((c.hue + 200) % 360) + ",35%,62%," + (0.22 * a).toFixed(3) + ")";
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]);
      for (k = 1; k <= n; k++) { p = point(c, drawn * k / n); ctx.lineTo(p[0], p[1]); }
      ctx.stroke();

      // pearly iridescent hairline, hue shifting along the stroke
      ctx.lineWidth = 0.7;
      for (k = 1; k <= n; k++) {
        p = point(c, drawn * k / n);
        h = (c.hue + 140 * (k / SEG) + 60 * c.life) % 360;
        ctx.strokeStyle = "hsla(" + h + ",80%,84%," + (0.95 * a).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
        prev = p;
      }
      // a pearl where the coil is furling in
      ctx.fillStyle = "rgba(255,255,253," + (0.9 * a).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(prev[0], prev[1], 0.7, 0, TAU); ctx.fill();
    }
    raf = (coils.length || settling) ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }

  document.addEventListener("pointermove", function (e) {
    if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    cx = e.clientX; cy = e.clientY;
    if (gx < 0) { gx = cx; gy = cy; return; }             // first sighting: no trail yet
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }, { passive: true });
  document.addEventListener("pointerleave", function () { gx = gy = -1; }, { passive: true });

  function init() { document.body.appendChild(cv); size(); addEventListener("resize", size); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
