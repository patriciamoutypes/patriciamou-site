/*!
 * Spiral vine: as the cursor moves, a thin stem trails about half an inch
 * behind it. Its end curls into a spiral like an unfurling fern; then a second
 * tendril grows off the stem into a spiral, then a third. Never more than three.
 * One colour, fading from rose-mauve at the head to pearl at the tail.
 * When the cursor stops, the stem draws back in and the spirals uncurl and fade.
 * Mouse and trackpad only; off for touch screens and reduced motion.
 */
(function () {
  "use strict";
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || still) return;

  var HEAD = [168, 124, 142], TAIL = [232, 214, 224];   // rose-mauve to pearl
  var LAG = 48, STEM = 130, SAMPLE = 3;                  // px
  var cv = document.createElement("canvas"), ctx = cv.getContext("2d");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:900";
  var dpr = 1, W = 0, H = 0, raf = 0, last = 0, moving = 0;
  var cx = -1, cy = -1, gx = -1, gy = -1;
  var pts = [];                                          // stem points, newest first
  // the three spirals: where they sprout (fraction of the stem from its tail), side, size, growth
  var buds = [
    { at: 0, side: -1, len: 54, grow: 0 },               // the stem's own end, curling on
    { at: 0.42, side: 1, len: 40, grow: 0 },             // first tendril
    { at: 0.72, side: -1, len: 32, grow: 0 }             // second tendril
  ];

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function col(t, a) {                                   // t: 0 head .. 1 tail
    var c = [0, 1, 2].map(function (i) { return Math.round(HEAD[i] + (TAIL[i] - HEAD[i]) * t); });
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a.toFixed(3) + ")";
  }
  function stemLength() {
    var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L;
  }
  // point and direction at distance d from the tail end, walking toward the head
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
  // a fiddlehead: curvature rises along the length so it coils into a spiral
  function coil(x, y, ang, side, L, grow, t0, alpha, lead) {
    var s = 0, ds = 1, total = L * grow, turnK = 2 * 2.4 * Math.PI / (L * L);
    if (total < 1) return;
    var px = x, py = y;
    for (; s < total; s += ds) {
      var k = side * turnK * Math.max(0, s - lead);
      ang += k * ds;
      var nx = px + Math.cos(ang) * ds, ny = py + Math.sin(ang) * ds;
      var f = s / L;
      ctx.strokeStyle = col(Math.min(1, t0 + f * (1 - t0)), alpha * (1 - 0.35 * f));
      ctx.lineWidth = Math.max(0.4, 1.0 - 0.6 * f);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
      px = nx; py = ny;
    }
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    moving = Math.max(0, moving - dt);

    // the guide eases after the cursor, at most about half an inch behind
    if (gx >= 0) {
      var k = 1 - Math.pow(0.0009, dt);
      gx += (cx - gx) * k; gy += (cy - gy) * k;
      var bx = cx - gx, by = cy - gy, bd = Math.hypot(bx, by);
      if (bd > LAG) { gx = cx - bx / bd * LAG; gy = cy - by / bd * LAG; }
      var head = pts[0];
      if (!head || Math.hypot(gx - head[0], gy - head[1]) >= SAMPLE) pts.unshift([gx, gy]);
    }
    // trim the stem to its length; when the cursor rests, draw it back in
    var L = stemLength(), keep = moving > 0 ? STEM : Math.max(0, L - 220 * dt);
    while (pts.length > 2 && L > keep) {
      var a = pts[pts.length - 1], b = pts[pts.length - 2];
      var seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L - seg >= keep) { pts.pop(); L -= seg; }
      else { var f = (L - keep) / seg; a[0] += (b[0] - a[0]) * f; a[1] += (b[1] - a[1]) * f; L = keep; }
    }
    if (moving <= 0 && L < 2) pts.length = 0;

    // grow the spirals in order while moving; uncurl them while resting
    for (var i = 0; i < buds.length; i++) {
      var bud = buds[i], ready = i === 0 ? L > 40 : buds[i - 1].grow > 0.65 && L > 60;
      bud.grow = moving > 0 && ready ? Math.min(1, bud.grow + dt * 1.6) : Math.max(0, bud.grow - dt * (moving > 0 ? 0.8 : 2.2));
    }

    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (pts.length > 1) {
      var fadeAll = moving > 0 ? 1 : Math.min(1, L / 60);
      // the stem, head to tail
      var run = 0;
      for (var j = 1; j < pts.length; j++) {
        var p0 = pts[j - 1], p1 = pts[j];
        run += Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        var t = Math.min(1, run / Math.max(L, 1));
        ctx.strokeStyle = col(t * 0.75, 0.85 * fadeAll * (1 - 0.3 * t));
        ctx.lineWidth = 1.25 - 0.45 * t;
        ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
      }
      // spiral one carries on from the tail end; two and three sprout from the stem
      var tail = pts[pts.length - 1], prev = pts[pts.length - 2];
      coil(tail[0], tail[1], Math.atan2(tail[1] - prev[1], tail[0] - prev[0]), buds[0].side, buds[0].len, buds[0].grow, 0.75, 0.8 * fadeAll, 0);
      for (var b2 = 1; b2 < buds.length; b2++) {
        var bd2 = buds[b2]; if (bd2.grow <= 0) continue;
        var at = along(L * bd2.at), out = at.ang + Math.PI + bd2.side * 0.7;   // leans back along the stem
        coil(at.x, at.y, out, bd2.side, bd2.len, bd2.grow, 0.45 + 0.3 * bd2.at, 0.75 * fadeAll, 6);
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
    moving = 0.12;                                       // counts as moving for a beat after each event
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", function () { moving = 0; }, { passive: true });

  function init() { document.body.appendChild(cv); size(); addEventListener("resize", size); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
