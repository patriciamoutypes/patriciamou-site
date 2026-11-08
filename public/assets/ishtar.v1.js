/*!
 * Patricia Mou: the Star of Ishtar, drawn with the same pens as her sigil.
 * Its simplest form: a pearl lights at the centre, the eight rays draw outward in a
 * sweep from the top, then the ring closes around them.
 * Faint echoes trail the pens, small dots shed from the heads, and once it is
 * finished the echoes settle, motes drift and a soft glow breathes behind it.
 * Drop-in: <div class="pm-ishtar"></div><script src="ishtar.js" defer></script>
 * Options (data attributes on the div):
 *   data-theme="dusk" | "light"   dusk = pale gold for the night-teal end of the page (default)
 *   data-loop="true"              redraw on a loop instead of drawing once
 * Starts drawing when it scrolls into view. No dependencies.
 * Pauses when off-screen. Shows the finished drawing under prefers-reduced-motion.
 */
(function () {
  "use strict";
  var TAU = Math.PI * 2;

  var seed = 23;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(p) { return 0.5 - 0.5 * Math.cos(Math.PI * clamp01(p)); }
  function pace(p) { p = clamp01(p); return 0.35 * p + 0.65 * ease(p); }          // pen speed profile
  function invPace(v) { var lo = 0, hi = 1; for (var i = 0; i < 22; i++) { var m = (lo + hi) / 2; if (pace(m) < v) lo = m; else hi = m; } return (lo + hi) / 2; }
  function easeOut(p) { p = clamp01(p); return 1 - (1 - p) * (1 - p) * (1 - p); }

  // ---------- geometry (unit = the ring's radius, y down) ----------
  var SPEED = 0.52, END = 0, strokes = [];
  function subdivide(p) {
    var q = [p[0]];
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.008));
      for (var k = 1; k <= n; k++) q.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    return q;
  }
  function polar(r, a) { return [r * Math.cos(a), r * Math.sin(a)]; }
  // a full circle starting at the top; drawn by two pens that meet at the bottom
  function circle(r) {
    var p = [], n = Math.max(48, Math.ceil(TAU * r / 0.008));
    for (var i = 0; i <= n; i++) p.push(polar(r, -Math.PI / 2 + TAU * i / n));
    return p;
  }
  // every stroke is "ink": the drawing itself
  function addStroke(p, ts, kind, both, speed) {
    p = subdivide(p);
    var n = p.length, L = [0], k;
    for (k = 1; k < n; k++) L.push(L[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
    var len = L[n - 1], d = [], dmax = 0;
    for (k = 0; k < n; k++) { var dd = both ? Math.min(L[k], len - L[k]) : L[k]; d.push(dd); dmax = Math.max(dmax, dd); }
    var s = { xy: new Float32Array(n * 2), L: L, n: n, ts: ts, dur: 0.35 + dmax / (SPEED * (speed || 1)), tr: new Float32Array(n), kind: kind };
    for (k = 0; k < n; k++) {
      s.xy[k * 2] = p[k][0]; s.xy[k * 2 + 1] = p[k][1];
      s.tr[k] = s.ts + s.dur * invPace(d[k] / (dmax || 1));
      END = Math.max(END, s.tr[k]);
    }
    strokes.push(s);
    return s;
  }

  var VALLEY = 0.3, HALF = Math.PI / 8;
  var RAY_R = [1.0, 0.82, 1.0, 0.82, 1.0, 0.82, 1.0, 0.82];   // top, then clockwise; long rays touch the ring, short ones fall inside
  var PEARL_R = 0.035, PEARL_T = 0.1;

  // a ray's side bows gently in toward the ray's axis, so each ray tapers like a flame
  function side(v, tip, a) {
    var dx = Math.cos(a), dy = Math.sin(a), mx = (v[0] + tip[0]) / 2, my = (v[1] + tip[1]) / 2;
    var pr = mx * dx + my * dy, c = [mx + (pr * dx - mx) * 0.42, my + (pr * dy - my) * 0.42], p = [];
    for (var i = 0; i <= 32; i++) {
      var u = i / 32, w = 1 - u;
      p.push([w * w * v[0] + 2 * w * u * c[0] + u * u * tip[0], w * w * v[1] + 2 * w * u * c[1] + u * u * tip[1]]);
    }
    return p;
  }

  // the eight rays, sweeping clockwise from the top: both sides leave the valleys and meet at the tip
  var topTip = 0;
  RAY_R.forEach(function (R, k) {
    var a = -Math.PI / 2 + k * Math.PI / 4, t = 0.45 + k * 0.16, tip = polar(R, a);
    var s1 = addStroke(side(polar(VALLEY, a - HALF), tip, a), t, "ink", false);
    addStroke(side(polar(VALLEY, a + HALF), tip, a), t, "ink", false);
    if (k === 0) topTip = s1.ts + s1.dur;
  });

  // the ring: two pens leave the top ray's tip and meet at the bottom
  addStroke(circle(1), topTip, "ink", true, 1.5);
  var CYCLE = END + 5.0;
  var DRAW_SPEED = 1.6;

  // ---------- dots shed by the pen heads ----------
  var DOTS = [];
  function shed(x, y, te) {
    var ang = rnd() * TAU, sp = 0.01 + rnd() * 0.035;
    DOTS.push({ x: x, y: y, te: te, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.7 + 0.016 + rnd() * 0.02,
      life: 1.2 + rnd() * 1.8, r: 0.006 + rnd() * 0.011, a: 0.35 + rnd() * 0.5 });
  }
  strokes.forEach(function (s) {
    if (s.kind !== "ink") return;
    var step = 0.07, next = step;
    for (var k = 0; k < s.n; k++) if (s.L[k] >= next) { shed(s.xy[k * 2], s.xy[k * 2 + 1], s.tr[k]); next = s.L[k] + step * (0.6 + rnd() * 0.9); }
  });
  // motes that gather around the finished star
  var AMBIENT = [];
  for (var a0 = 0; a0 < 26; a0++) {
    var ar = 0.3 + Math.sqrt(rnd()) * 0.82, aa = rnd() * TAU;
    AMBIENT.push({ x: ar * Math.cos(aa), y: ar * Math.sin(aa), p1: rnd() * TAU, p2: rnd() * TAU, p3: rnd() * TAU, r: 0.005 + rnd() * 0.009, a: 0.2 + rnd() * 0.4 });
  }

  // ---------- themes ----------
  var THEMES = {
    dusk: { ink: [242, 229, 201], inkA: 0.95, wisp: [214, 198, 166], wispA: [0.30, 0.20, 0.12], dot: [240, 226, 196], glow: [238, 214, 164] },
    light: { ink: [74, 74, 74], inkA: 0.92, wisp: [150, 150, 150], wispA: [0.30, 0.20, 0.12], dot: [100, 100, 100], glow: null }
  };
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ")"; }

  // faint threads that trail the pen and keep drifting
  var WISPS = [
    { amp: 0.014, f1: 4.3, f2: 3.1, sp: 0.24, ph: 1.1, lag: 0.12, w: 0.55 },
    { amp: 0.03, f1: 3.1, f2: 2.3, sp: 0.18, ph: 0.4, lag: 0.28, w: 0.6 },
    { amp: 0.05, f1: 2.0, f2: 3.2, sp: 0.12, ph: 2.6, lag: 0.48, w: 0.55 }
  ];

  // drawing bounds in units: ±1.2 both ways
  var UW = 2.4, UTOP = 1.2, UH = 2.4;

  function frame(ctx, W, H, t, opts) {
    var o = { theme: "dusk", loop: false };
    for (var k in opts) o[k] = opts[k];
    var th = THEMES[o.theme] || THEMES.dusk;
    var g = 1, tt = t;
    if (o.loop) {
      tt = ((t % CYCLE) + CYCLE) % CYCLE;
      g = 1 - ease((tt - (END + 2.9)) / 1.5);
    }
    var S = Math.min(W / UW, H / UH), cx = W / 2, cy = (H - UH * S) / 2 + UTOP * S;
    var lw = Math.max(0.8, S * 0.0115);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (g <= 0.001) { ctx.restore(); return; }
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    var heads = [];

    function trace(time, s, off, collect) {
      var xy = s.xy, tr = s.tr, pen = -1, ox = cx, oy = cy;
      if (off) { ox += off.amp * S * Math.sin(tt * off.sp * TAU + off.ph); oy += off.amp * 0.7 * S * Math.cos(tt * off.sp * 0.8 * TAU + off.ph * 1.7); }
      function P(j) { return [ox + xy[j * 2] * S, oy + xy[j * 2 + 1] * S]; }
      for (var j = 1; j < s.n; j++) {
        var a = tr[j - 1], b = tr[j];
        if (a <= time && b <= time) {
          if (pen !== j - 1) { var pa = P(j - 1); ctx.moveTo(pa[0], pa[1]); }
          var pb = P(j); ctx.lineTo(pb[0], pb[1]); pen = j;
        } else if (a <= time || b <= time) {
          var lo = a <= time ? j - 1 : j, hi = a <= time ? j : j - 1, f = (time - tr[lo]) / ((tr[hi] - tr[lo]) || 1);
          var P0 = P(lo), P1 = P(hi), mx = P0[0] + (P1[0] - P0[0]) * f, my = P0[1] + (P1[1] - P0[1]) * f;
          if (lo === j - 1) { if (pen !== j - 1) ctx.moveTo(P0[0], P0[1]); ctx.lineTo(mx, my); pen = -1; }
          else { ctx.moveTo(mx, my); ctx.lineTo(P0[0], P0[1]); pen = j; }
          if (collect) heads.push(mx, my, clamp01((s.ts + s.dur - time) / 0.3));
        }
      }
    }

    // --- a soft glow that gathers behind the star and breathes
    if (th.glow) {
      var ga = g * clamp01((tt - 1.0) / 5) * (0.85 + 0.15 * Math.sin(tt * 0.6));
      if (ga > 0.002) {
        var gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1.2 * S);
        gr.addColorStop(0, rgba(th.glow, 0.16 * ga));
        gr.addColorStop(0.45, rgba(th.glow, 0.07 * ga));
        gr.addColorStop(1, rgba(th.glow, 0));
        ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      }
    }

    // --- echoes
    var settle = 1 - 0.8 * clamp01((tt - END) / 2.5);
    WISPS.forEach(function (wp, wi) {
      ctx.globalAlpha = g * settle;
      ctx.strokeStyle = rgba(th.wisp, th.wispA[wi]); ctx.lineWidth = lw * wp.w; ctx.beginPath();
      strokes.forEach(function (s) { if (s.kind === "ink") trace(tt - wp.lag, s, wp, false); });
      ctx.stroke();
    });

    // --- dots shed by the pen heads
    ctx.fillStyle = rgba(th.dot, 1);
    for (var di = 0; di < DOTS.length; di++) {
      var d = DOTS[di], age = tt - d.te;
      if (age < 0 || age > d.life) continue;
      var u = age / d.life, alp = d.a * Math.min(1, age / 0.15) * Math.pow(1 - u, 1.6);
      var px = d.x + d.vx * age * (1 - 0.3 * u), py = d.y + d.vy * age * (1 - 0.3 * u);
      ctx.globalAlpha = g * alp;
      ctx.beginPath(); ctx.arc(cx + px * S, cy + py * S, Math.max(0.6, d.r * S * (1 - 0.4 * u)), 0, TAU); ctx.fill();
    }
    var amb = clamp01((tt - END + 0.6) / 2.2);
    if (amb > 0) {
      AMBIENT.forEach(function (m) {
        var px = m.x + 0.03 * Math.sin(tt * 0.31 + m.p1), py = m.y + 0.04 * Math.sin(tt * 0.23 + m.p2);
        ctx.globalAlpha = g * amb * m.a * (0.55 + 0.45 * Math.sin(tt * 0.9 + m.p3));
        ctx.beginPath(); ctx.arc(cx + px * S, cy + py * S, Math.max(0.6, m.r * S), 0, TAU); ctx.fill();
      });
    }
    ctx.globalAlpha = g;

    // --- the star
    ctx.strokeStyle = rgba(th.ink, th.inkA); ctx.lineWidth = lw; ctx.beginPath();
    strokes.forEach(function (s) { if (s.kind === "ink") trace(tt, s, null, true); });
    ctx.stroke();

    // --- pen heads: a small bead leading each line
    ctx.fillStyle = rgba(th.ink, 1);
    for (var h = 0; h < heads.length; h += 3) {
      ctx.globalAlpha = g * heads[h + 2];
      ctx.beginPath(); ctx.arc(heads[h], heads[h + 1], lw * 1.35, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = g;

    // --- the pearl at the centre, with one soft ring
    var pa = tt - PEARL_T;
    if (pa >= 0) {
      ctx.fillStyle = rgba(th.ink, 1); ctx.beginPath(); ctx.arc(cx, cy, PEARL_R * S * easeOut(pa / 0.45), 0, TAU); ctx.fill();
      if (pa < 1.4) {
        var q = pa / 1.4;
        ctx.strokeStyle = rgba(th.wisp, 0.5 * (1 - q)); ctx.lineWidth = lw * 0.7;
        ctx.beginPath(); ctx.arc(cx, cy, PEARL_R * S * (1.2 + 3.2 * easeOut(q)), 0, TAU); ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ---------- mounting ----------
  function mount(el, opts) {
    opts = opts || {};
    var theme = opts.theme || el.getAttribute("data-theme") || "dusk";
    var loop = opts.loop !== undefined ? opts.loop : el.getAttribute("data-loop") === "true";
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", el.getAttribute("aria-label") || "the Star of Ishtar");
    cv.style.cssText = "display:block;width:100%;height:100%";
    if (!el.style.aspectRatio && !el.style.height) el.style.aspectRatio = String(UW / UH);
    el.appendChild(cv);
    var ctx = cv.getContext("2d"), W = 0, H = 0, t0 = null, visible = false, raf = 0;
    function size() {
      var r = el.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    }
    // the drawing runs DRAW_SPEED times faster; once it is finished, the drift keeps its own calm pace
    function clock(t) {
      if (loop) return t * DRAW_SPEED;
      var done = END / DRAW_SPEED;
      return t < done ? t * DRAW_SPEED : END + (t - done);
    }
    function draw(now) {
      raf = 0;
      if (reduce) { frame(ctx, W, H, END + 6, { theme: theme, loop: false }); return; }
      if (t0 === null) t0 = now;
      frame(ctx, W, H, clock((now - t0) / 1000), { theme: theme, loop: loop });
      if (visible) raf = requestAnimationFrame(draw);
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(function () { size(); if (reduce || !visible) draw(performance.now()); }).observe(el);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(draw);
      }, { threshold: 0.25 }).observe(el);
    } else { visible = true; raf = requestAnimationFrame(draw); }
    if (reduce) draw(0);
    return { canvas: cv };
  }
  function auto() {
    var els = document.querySelectorAll(".pm-ishtar:not([data-mounted])");
    for (var i = 0; i < els.length; i++) { els[i].setAttribute("data-mounted", ""); mount(els[i]); }
  }
  if (typeof window !== "undefined") {
    window.PMIshtar = { frame: frame, mount: mount, END: END, CYCLE: CYCLE };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
  }
})();
