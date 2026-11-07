/*!
 * Water-swirl vine: as the cursor moves, a brush-stroke stem trails about half
 * an inch behind it. Its end winds into a round, open spiral, like the
 * traditional Japanese flowing-water motif; then a second and third swirl grow
 * off the stem in turn, with a few droplets beside them. Never more than three.
 * One colour, rose-mauve at the head fading to pearl. Strokes swell in the
 * middle and taper to points. When the cursor stops, the stem draws back in
 * and the swirls unwind and fade.
 * Mouse and trackpad only; off for touch screens and reduced motion.
 */
(function () {
  "use strict";
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || still) return;

  var HEAD = [168, 124, 142], TAIL = [226, 206, 220];
  var LAG = 48, STEM = 140, SAMPLE = 3, TAU = Math.PI * 2;
  var cv = document.createElement("canvas"), ctx = cv.getContext("2d");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:900";
  var dpr = 1, W = 0, H = 0, raf = 0, last = 0, moving = 0;
  var cx = -1, cy = -1, gx = -1, gy = -1, pts = [];
  // the three swirls: where they sprout (fraction of the stem from its tail), which way they wind, outer radius, growth
  var buds = [
    { at: 0, side: -1, R: 14, grow: 0, drops: [[1.25, 0.2, 1.1], [1.55, -0.5, 0.8]] },
    { at: 0.45, side: 1, R: 11, grow: 0, drops: [[1.35, 0.6, 0.9]] },
    { at: 0.74, side: -1, R: 8, grow: 0, drops: [[1.45, -0.3, 0.8], [1.8, 0.3, 0.6]] }
  ];
  // a round open spiral (r = r0 + b·θ), listed from the outer end in to the centre, unit scale
  var SPIRAL = (function () {
    var out = [], turns = 2.9, r0 = 0.12, n = 140;
    for (var i = n; i >= 0; i--) {
      var th = turns * TAU * i / n, r = r0 + (1 - r0) * i / n;
      out.push([r * Math.cos(th), r * Math.sin(th)]);
    }
    return out;
  })();

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function col(t, a) {
    var c = [0, 1, 2].map(function (i) { return Math.round(HEAD[i] + (TAIL[i] - HEAD[i]) * t); });
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + Math.max(0, a).toFixed(3) + ")";
  }
  function brush(f, wmax) { return 0.35 + wmax * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, f))), 0.7); }
  function stemLength() {
    var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L;
  }
  function along(d) {
    for (var i = pts.length - 1; i > 0; i--) {
      var a = pts[i], b = pts[i - 1], seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d <= seg || i === 1) {
        var f = seg ? Math.min(1, d / seg) : 0;
        return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
      }
      d -= seg;
    }
    return { x: pts[0][0], y: pts[0][1], ang: 0 };
  }

  // place the spiral so its outer end sits on (x, y) heading along `ang`, then draw the first `grow` of it
  function swirl(x, y, ang, bud, t0, alpha, lead) {
    if (bud.grow <= 0.01) return;
    var R = bud.R, side = bud.side, a = SPIRAL[0], b = SPIRAL[3];
    var start = Math.atan2((b[1] - a[1]) * side, b[0] - a[0]);
    var rot = ang - start, cs = Math.cos(rot), sn = Math.sin(rot);
    function at(p) {
      var lx = (p[0] - a[0]) * R, ly = (p[1] - a[1]) * R * side;
      return [x + lx * cs - ly * sn, y + lx * sn + ly * cs];
    }
    var n = Math.max(2, Math.floor((SPIRAL.length - 1) * bud.grow)), prev = [x, y], i, p, f;
    // a short sweep out of the stem before the coil, so the join flows
    if (lead) {
      var lx = x - Math.cos(ang) * lead, ly = y - Math.sin(ang) * lead;
      ctx.strokeStyle = col(t0, alpha * 0.9); ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.quadraticCurveTo(x - Math.cos(ang) * lead * 0.3, y - Math.sin(ang) * lead * 0.3, x, y); ctx.stroke();
    }
    for (i = 1; i <= n; i++) {
      p = at(SPIRAL[i]); f = i / (SPIRAL.length - 1);
      ctx.strokeStyle = col(t0 + (1 - t0) * f * 0.6, alpha * (1 - 0.25 * f));
      ctx.lineWidth = brush(0.12 + 0.88 * f * (0.6 + 0.4 * bud.grow), R / 6.5);
      ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      prev = p;
    }
    // droplets, placed relative to the swirl's centre
    var c = at([0, 0]), dk = Math.max(0, (bud.grow - 0.6) / 0.4);
    if (dk > 0) for (i = 0; i < bud.drops.length; i++) {
      var d = bud.drops[i], ang2 = rot + d[1];
      ctx.fillStyle = col(t0 + 0.2, alpha * dk * 0.85);
      ctx.beginPath(); ctx.arc(c[0] + Math.cos(ang2) * R * d[0], c[1] + Math.sin(ang2) * R * d[0], d[2], 0, TAU); ctx.fill();
    }
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    moving = Math.max(0, moving - dt);
    if (gx >= 0) {
      var k = 1 - Math.pow(0.0009, dt);
      gx += (cx - gx) * k; gy += (cy - gy) * k;
      var bx = cx - gx, by = cy - gy, bd = Math.hypot(bx, by);
      if (bd > LAG) { gx = cx - bx / bd * LAG; gy = cy - by / bd * LAG; }
      var head = pts[0];
      if (!head || Math.hypot(gx - head[0], gy - head[1]) >= SAMPLE) pts.unshift([gx, gy]);
    }
    var L = stemLength(), keep = moving > 0 ? STEM : Math.max(0, L - 220 * dt);
    while (pts.length > 2 && L > keep) {
      var a = pts[pts.length - 1], b = pts[pts.length - 2];
      var seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L - seg >= keep) { pts.pop(); L -= seg; }
      else { var f = (L - keep) / seg; a[0] += (b[0] - a[0]) * f; a[1] += (b[1] - a[1]) * f; L = keep; }
    }
    if (moving <= 0 && L < 2) pts.length = 0;
    for (var i = 0; i < buds.length; i++) {
      var bud = buds[i], ready = i === 0 ? L > 40 : buds[i - 1].grow > 0.6 && L > 60;
      bud.grow = moving > 0 && ready ? Math.min(1, bud.grow + dt * 1.5) : Math.max(0, bud.grow - dt * (moving > 0 ? 0.8 : 2.2));
    }

    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (pts.length > 1) {
      var fade = moving > 0 ? 1 : Math.min(1, L / 60), run = 0;
      // the stem: a brush stroke, pointed at the head, full as it reaches the first swirl
      for (var j = 1; j < pts.length; j++) {
        var p0 = pts[j - 1], p1 = pts[j];
        run += Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        var t = Math.min(1, run / Math.max(L, 1));
        ctx.strokeStyle = col(t * 0.7, 0.88 * fade * (1 - 0.25 * t));
        ctx.lineWidth = 0.35 + 1.9 * Math.pow(Math.sin(Math.PI / 2 * Math.min(1, t / 0.7)), 0.8);
        ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
      }
      var tail = pts[pts.length - 1], prev = pts[pts.length - 2];
      swirl(tail[0], tail[1], Math.atan2(tail[1] - prev[1], tail[0] - prev[0]), buds[0], 0.7, 0.85 * fade, 0);
      for (var q = 1; q < buds.length; q++) {
        var bq = buds[q]; if (bq.grow <= 0) continue;
        var spot = along(L * bq.at), out = spot.ang + Math.PI + bq.side * 0.55;
        var sx = spot.x + Math.cos(out) * 7, sy = spot.y + Math.sin(out) * 7;
        swirl(sx, sy, out, bq, 0.45 + 0.3 * bq.at, 0.8 * fade, 7);
      }
    }
    var alive = moving > 0 || pts.length > 1 || buds.some(function (b) { return b.grow > 0; });
    raf = alive ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }

  document.addEventListener("pointermove", function (e) {
    if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    cx = e.clientX; cy = e.clientY;
    if (gx < 0) { gx = cx; gy = cy; }
    moving = 0.12;
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", function () { moving = 0; }, { passive: true });

  function init() { document.body.appendChild(cv); size(); addEventListener("resize", size); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
