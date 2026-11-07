/*!
 * Patricia Mou sigil: draws itself downward, spine and circles together.
 * Drop-in: <div class="pm-sigil"></div><script src="sigil.js" defer></script>
 * Options (data attributes on the div):
 *   data-theme="light" | "dark"   light = graphite on white (default)
 *   data-loop="true"              redraw on a loop instead of drawing once
 * Starts drawing when it scrolls into view. No dependencies.
 * Pauses when off-screen. Shows the finished drawing under prefers-reduced-motion.
 */
(function () {
  "use strict";
  var DATA = {"s":[[-0.4486,-0.2103,-0.4617,-0.2178,-0.4747,-0.2298,-0.4882,-0.2449,-0.5003,-0.2611,-0.5109,-0.2783,-0.5203,-0.2962,-0.528,-0.3149,-0.5343,-0.3341,-0.5394,-0.3563,-0.5425,-0.3763,-0.5439,-0.3964,-0.5439,-0.4217,-0.5425,-0.4419,-0.5394,-0.4618,-0.5349,-0.4816,-0.5288,-0.5008,-0.5211,-0.5195,-0.5122,-0.5376,-0.5019,-0.555,-0.4889,-0.5738,-0.4779,-0.5876,-0.4642,-0.6024,-0.4494,-0.6162,-0.4336,-0.6289,-0.417,-0.6404,-0.3997,-0.6509,-0.3817,-0.6601,-0.3654,-0.667,-0.322,-0.6804,-0.302,-0.6837,-0.2819,-0.6858,-0.244,-0.6858,-0.2239,-0.6838,-0.2014,-0.6802,-0.1842,-0.6763,-0.1648,-0.6705,-0.1481,-0.6645,-0.1296,-0.6565,-0.1115,-0.6474,-0.0942,-0.6371,-0.0776,-0.6254,-0.0599,-0.6112,-0.0451,-0.5974,-0.0313,-0.5826,-0.0205,-0.5686,-0.005,-0.5455,0.0032,-0.5359,0.0149,-0.5263,0.0343,-0.5143,0.0637,-0.4998,0.0944,-0.4879,0.2152,-0.4511,0.2392,-0.4429,0.2694,-0.4301,0.3006,-0.4134,0.322,-0.3999,0.3443,-0.3833,0.3634,-0.3668,0.3811,-0.3488,0.3972,-0.3293,0.4117,-0.3086,0.4242,-0.2866,0.4326,-0.2682,0.4417,-0.242,0.4475,-0.2148,0.4465,-0.1997,0.4422,-0.1878,0.4258,-0.1594,0.4026,-0.1293,0.3762,-0.1021,0.3452,-0.0762,0.316,-0.0563,0.2785,-0.0352,0.244,-0.0195,0.206,-0.0058,0.1622,0.0064,0.1151,0.016,0.0726,0.0219,0.0021,0.0288,-0.0124,0.0333,-0.0307,0.0418,-0.0655,0.0624,-0.1078,0.09,-0.1342,0.1097,-0.1589,0.1312,-0.1833,0.1569,-0.2034,0.1829,-0.2189,0.209,-0.2301,0.2344,-0.2361,0.2537,-0.2415,0.2784,-0.2423,0.3264,-0.2398,0.349,-0.2346,0.3763,-0.2279,0.4033,-0.2196,0.4298,-0.206,0.4652,-0.1904,0.4998,-0.1654,0.5494,-0.0984,0.677,-0.0644,0.7476,-0.0374,0.8102,-0.0093,0.8861,-0.0063,0.8902,0.0,0.8943],[0.4486,-0.2103,0.4617,-0.2178,0.4747,-0.2298,0.4882,-0.2449,0.5003,-0.2611,0.5109,-0.2783,0.5203,-0.2962,0.528,-0.3149,0.5343,-0.3341,0.5394,-0.3563,0.5425,-0.3763,0.5439,-0.3964,0.5439,-0.4217,0.5425,-0.4419,0.5394,-0.4618,0.5349,-0.4816,0.5288,-0.5008,0.5211,-0.5195,0.5122,-0.5376,0.5019,-0.555,0.4889,-0.5738,0.4779,-0.5876,0.4642,-0.6024,0.4494,-0.6162,0.4336,-0.6289,0.417,-0.6404,0.3997,-0.6509,0.3817,-0.6601,0.3654,-0.667,0.322,-0.6804,0.302,-0.6837,0.2819,-0.6858,0.244,-0.6858,0.2239,-0.6838,0.2014,-0.6802,0.1842,-0.6763,0.1648,-0.6705,0.1481,-0.6645,0.1296,-0.6565,0.1115,-0.6474,0.0942,-0.6371,0.0776,-0.6254,0.0599,-0.6112,0.0451,-0.5974,0.0313,-0.5826,0.0205,-0.5686,0.005,-0.5455,-0.0032,-0.5359,-0.0149,-0.5263,-0.0343,-0.5143,-0.0637,-0.4998,-0.0944,-0.4879,-0.2152,-0.4511,-0.2392,-0.4429,-0.2694,-0.4301,-0.3006,-0.4134,-0.322,-0.3999,-0.3443,-0.3833,-0.3634,-0.3668,-0.3811,-0.3488,-0.3972,-0.3293,-0.4117,-0.3086,-0.4242,-0.2866,-0.4326,-0.2682,-0.4417,-0.242,-0.4475,-0.2148,-0.4465,-0.1997,-0.4422,-0.1878,-0.4258,-0.1594,-0.4026,-0.1293,-0.3762,-0.1021,-0.3452,-0.0762,-0.316,-0.0563,-0.2785,-0.0352,-0.244,-0.0195,-0.206,-0.0058,-0.1622,0.0064,-0.1151,0.016,-0.0726,0.0219,-0.0021,0.0288,0.0124,0.0333,0.0307,0.0418,0.0655,0.0624,0.1078,0.09,0.1342,0.1097,0.1589,0.1312,0.1833,0.1569,0.2034,0.1829,0.2189,0.209,0.2301,0.2344,0.2361,0.2537,0.2415,0.2784,0.2423,0.3264,0.2398,0.349,0.2346,0.3763,0.2279,0.4033,0.2196,0.4298,0.206,0.4652,0.1904,0.4998,0.1654,0.5494,0.0984,0.677,0.0644,0.7476,0.0374,0.8102,0.0093,0.8861,0.0063,0.8902,0.0,0.8943],[0.0,0.8131,-0.0069,0.81,-0.0094,0.8056,-0.0332,0.7203,-0.0556,0.6531,-0.0862,0.5755,-0.114,0.5131,-0.1447,0.452,-0.1808,0.3882,-0.2075,0.3452,-0.2302,0.3117,-0.2335,0.3079,-0.2402,0.3043],[0.0,0.8131,0.0069,0.81,0.0094,0.8056,0.0332,0.7203,0.0556,0.6531,0.0862,0.5755,0.114,0.5131,0.1447,0.452,0.1808,0.3882,0.2075,0.3452,0.2302,0.3117,0.2335,0.3079,0.2402,0.3043],[-0.2444,0.2784,-0.2531,0.2734,-0.2676,0.2558,-0.3188,0.1897,-0.3546,0.1405,-0.3816,0.1006,-0.4016,0.0683,-0.4188,0.0373,-0.4318,0.0098,-0.4427,-0.0186,-0.4513,-0.0478,-0.4575,-0.0775,-0.4605,-0.1027,-0.4613,-0.1331,-0.4588,-0.1634,-0.454,-0.1882,-0.4514,-0.1926,-0.4475,-0.1958],[0.2444,0.2784,0.2531,0.2734,0.2676,0.2558,0.3188,0.1897,0.3546,0.1405,0.3816,0.1006,0.4016,0.0683,0.4188,0.0373,0.4318,0.0098,0.4427,-0.0186,0.4513,-0.0478,0.4575,-0.0775,0.4605,-0.1027,0.4613,-0.1331,0.4588,-0.1634,0.454,-0.1882,0.4514,-0.1926,0.4475,-0.1958],[-0.2377,-0.4497,-0.2488,-0.458,-0.2663,-0.4796,-0.2853,-0.5064,-0.2995,-0.5303,-0.3098,-0.5506,-0.3184,-0.5717,-0.3254,-0.5933,-0.3308,-0.6155,-0.3344,-0.6379,-0.3361,-0.6606,-0.3359,-0.6884,-0.3341,-0.7111,-0.3303,-0.7361,-0.3246,-0.7608,-0.3172,-0.7849,-0.3097,-0.8037,-0.2987,-0.8265,-0.2873,-0.8462,-0.2744,-0.865,-0.2586,-0.8847,-0.2413,-0.9031,-0.2246,-0.9185,-0.2048,-0.9342,-0.1838,-0.9484,-0.1619,-0.9611,-0.1414,-0.971,-0.1179,-0.9802,-0.0962,-0.987,-0.0716,-0.993,-0.0442,-0.9975,-0.024,-0.9993,-0.0013,-1.0,0.024,-0.9993,0.0442,-0.9975,0.0716,-0.993,0.0962,-0.987,0.1179,-0.9802,0.1414,-0.971,0.1619,-0.9611,0.1838,-0.9484,0.2048,-0.9342,0.2246,-0.9185,0.2413,-0.9031,0.2586,-0.8847,0.2744,-0.865,0.2873,-0.8462,0.2987,-0.8265,0.3097,-0.8037,0.3172,-0.7849,0.3246,-0.7608,0.3303,-0.7361,0.3341,-0.7111,0.3359,-0.6884,0.3361,-0.6606,0.3344,-0.6379,0.3308,-0.6155,0.3254,-0.5933,0.3184,-0.5717,0.3098,-0.5506,0.2995,-0.5303,0.2853,-0.5064,0.2663,-0.4796,0.2488,-0.458,0.2377,-0.4497],[0.0,1.0,-0.0,0.3429,-0.0008,0.3227,-0.0038,0.3104,-0.0081,0.3013,-0.0162,0.2885,-0.0413,0.2536,-0.0616,0.2311,-0.0877,0.2072,-0.1096,0.1901,-0.1343,0.1725,-0.2581,0.094,-0.3063,0.0614,-0.3422,0.0335,-0.3717,0.0058,-0.3867,-0.0112,-0.399,-0.0272,-0.4115,-0.0462,-0.4223,-0.0662,-0.4303,-0.0848,-0.4374,-0.1064,-0.4439,-0.136,-0.4516,-0.1898],[0.0,0.3116,0.0301,0.2679,0.0442,0.25,0.0648,0.2278,0.0913,0.2043,0.1361,0.1713,0.2579,0.0941,0.3041,0.063,0.3421,0.0336,0.3716,0.0059,0.3867,-0.0111,0.4004,-0.0292,0.4115,-0.0462,0.4223,-0.0662,0.4303,-0.0848,0.4374,-0.1064,0.4439,-0.136,0.4516,-0.1898],[0.0,-0.9998,0.0,-0.0115,-0.0007,0.0163,-0.0027,0.0262,-0.0054,0.0333,-0.0158,0.0506,-0.03,0.0684,-0.0684,0.112,-0.0893,0.1374,-0.104,0.1579,-0.1183,0.1818,-0.128,0.2024,-0.1358,0.2264,-0.1405,0.2512,-0.1421,0.2765,-0.14,0.3042,-0.1331,0.3363,-0.124,0.3626,-0.1111,0.39,-0.0906,0.4248,-0.0619,0.4665,-0.027,0.513,0.0,0.5431],[0.0,0.0274,0.0234,0.0605,0.0699,0.1138,0.0908,0.1392,0.1026,0.1557,0.1144,0.1751,0.1269,0.1999,0.1351,0.2238,0.1405,0.2511,0.142,0.2764,0.1403,0.3016,0.1338,0.3338,0.124,0.3625,0.1111,0.39,0.0906,0.4248,0.0619,0.4665,0.027,0.513,0.0,0.5431],[0.2316,-0.4307,0.2223,-0.4268,0.1721,-0.3803,0.1284,-0.3458,0.0927,-0.3217,0.03,-0.2834,0.009,-0.2692,-0.036,-0.2283,-0.064,-0.2065,-0.083,-0.1939,-0.1029,-0.1828,-0.1257,-0.1718,-0.147,-0.1636,-0.1835,-0.1529,-0.2159,-0.1471,-0.2589,-0.1447,-0.2942,-0.1467,-0.3293,-0.1523,-0.3587,-0.16,-0.3919,-0.1724,-0.4328,-0.1926,-0.4399,-0.1952,-0.4475,-0.1958],[-0.2316,-0.4307,-0.2223,-0.4268,-0.1721,-0.3803,-0.1284,-0.3458,-0.0927,-0.3217,-0.03,-0.2834,-0.009,-0.2692,0.036,-0.2283,0.064,-0.2065,0.083,-0.1939,0.1029,-0.1828,0.1257,-0.1718,0.147,-0.1636,0.1835,-0.1529,0.2159,-0.1471,0.2589,-0.1447,0.2942,-0.1467,0.3293,-0.1523,0.3587,-0.16,0.3919,-0.1724,0.4328,-0.1926,0.4399,-0.1952,0.4475,-0.1958],[0.0,-0.536,-0.0105,-0.5216,-0.0185,-0.5086,-0.0254,-0.4949,-0.0319,-0.4783,-0.037,-0.4612,-0.0401,-0.4463,-0.0421,-0.4286,-0.0428,-0.4108,-0.042,-0.393,-0.0402,-0.3778,-0.0318,-0.3405,-0.0178,-0.2996,0.0,-0.2629],[0.0,-0.536,0.0105,-0.5216,0.0185,-0.5086,0.0254,-0.4949,0.0319,-0.4783,0.037,-0.4612,0.0401,-0.4463,0.0421,-0.4286,0.0428,-0.4108,0.042,-0.393,0.0402,-0.3778,0.0318,-0.3405,0.0178,-0.2996,0.0,-0.2629],[0.0,-0.7808,-0.0327,-0.7671,-0.0533,-0.7573,-0.0776,-0.7437,-0.1011,-0.7288,-0.1217,-0.714,-0.1413,-0.6979,-0.1769,-0.662,-0.1905,-0.6437,-0.2029,-0.6246,-0.2135,-0.6044,-0.2224,-0.5834,-0.2294,-0.5617,-0.2345,-0.5395,-0.2379,-0.5144,-0.2389,-0.4942,-0.237,-0.4537,-0.2294,-0.4088,-0.2254,-0.3915,-0.2193,-0.3722,-0.211,-0.3509,-0.2002,-0.3281,-0.188,-0.3059,-0.1722,-0.2799,-0.1536,-0.2527,-0.1355,-0.2283,-0.1087,-0.1946,-0.0743,-0.1574,-0.0351,-0.1179,-0.0202,-0.1006,-0.0081,-0.0844,0.0,-0.0783],[0.0,-0.7808,0.0327,-0.7671,0.0533,-0.7573,0.0776,-0.7437,0.1011,-0.7288,0.1217,-0.714,0.1413,-0.6979,0.1769,-0.662,0.1905,-0.6437,0.2029,-0.6246,0.2135,-0.6044,0.2224,-0.5834,0.2294,-0.5617,0.2345,-0.5395,0.2379,-0.5144,0.2389,-0.4942,0.237,-0.4537,0.2294,-0.4088,0.2254,-0.3915,0.2193,-0.3722,0.211,-0.3509,0.2002,-0.3281,0.188,-0.3059,0.1722,-0.2799,0.1536,-0.2527,0.1355,-0.2283,0.1087,-0.1946,0.0743,-0.1574,0.0351,-0.1179,0.0202,-0.1006,0.0081,-0.0844,0.0,-0.0783],[0.0,0.0274,0.0,0.3116]],"c":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"n":[-0.7808,-0.5359,-0.2629,0.0274,0.3116,0.5431],"nr":0.0212};
  var TAU = Math.PI * 2;

  // ---------- seeded random ----------
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(p) { return 0.5 - 0.5 * Math.cos(Math.PI * clamp01(p)); }
  function invEase(v) { return Math.acos(1 - 2 * clamp01(v)) / Math.PI; }
  function easeOut(p) { p = clamp01(p); return 1 - (1 - p) * (1 - p) * (1 - p); }

  // ---------- geometry ----------
  var strokes = [], NODES = DATA.n.slice().sort(function (a, b) { return a - b; }), NR = DATA.nr;
  var SPINE_TOP = 9, SPINE_BOT = -9;
  (function build() {
    DATA.s.forEach(function (f) {
      var p = [], i, k;
      for (i = 0; i < f.length; i += 2) p.push([f[i], f[i + 1]]);
      var q = [p[0]];
      for (i = 1; i < p.length; i++) {
        var a = p[i - 1], b = p[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.008));
        for (k = 1; k <= n; k++) q.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      // the spine is drawn on its own, so cut vertical runs on the axis out of every stroke
      var on = q.map(function (v) { return Math.abs(v[0]) < 1e-3; });
      q.forEach(function (v, j) { if (on[j]) { SPINE_TOP = Math.min(SPINE_TOP, v[1]); SPINE_BOT = Math.max(SPINE_BOT, v[1]); } });
      var pieces = [], cur = [], j = 0;
      while (j < q.length) {
        if (on[j]) {
          var e = j; while (e + 1 < q.length && on[e + 1]) e++;
          if (e - j >= 2) { cur.push(q[j]); if (cur.length > 1) pieces.push(cur); cur = [q[e]]; j = e + 1; continue; }
        }
        cur.push(q[j]); j++;
      }
      if (cur.length > 1) pieces.push(cur);
      pieces.forEach(function (pc) { if (!pc.every(function (v) { return Math.abs(v[0]) < 1e-3; })) addStroke(pc); });
    });
  })();
  function addStroke(p) {
    var n = p.length, L = [0], k;
    for (k = 1; k < n; k++) L.push(L[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
    var len = L[n - 1], closed = n > 20 && Math.hypot(p[0][0] - p[n - 1][0], p[0][1] - p[n - 1][1]) < 0.012;
    var k0 = 0; for (k = 1; k < n; k++) if (p[k][1] < p[k0][1]) k0 = k;
    var d = [], dmax = 0;
    for (k = 0; k < n; k++) { var dd = Math.abs(L[k] - L[k0]); if (closed) dd = Math.min(dd, len - dd); d.push(dd); dmax = Math.max(dmax, dd); }
    var xy = new Float32Array(n * 2), dn = new Float32Array(n);
    for (k = 0; k < n; k++) { xy[k * 2] = p[k][0]; xy[k * 2 + 1] = p[k][1]; dn[k] = d[k] / (dmax || 1); }
    strokes.push({ xy: xy, dn: dn, n: n, len: len, top: p[k0][1], k0: k0, L: L, d: d });
  }

  // ---------- timeline ----------
  var T_SPINE = 6.4, LEAD = 0.035;
  function spineY(t) { var u = clamp01(t / T_SPINE); return SPINE_TOP + (SPINE_BOT - SPINE_TOP) * (0.5 * u + 0.5 * ease(u)); }
  var SP_TAB = []; for (var i0 = 0; i0 <= 400; i0++) SP_TAB.push(spineY(T_SPINE * i0 / 400));
  function timeAtY(y) {
    if (y <= SP_TAB[0]) return 0;
    for (var i = 1; i < SP_TAB.length; i++) if (SP_TAB[i] >= y) { var f = (y - SP_TAB[i - 1]) / ((SP_TAB[i] - SP_TAB[i - 1]) || 1); return T_SPINE * (i - 1 + f) / 400; }
    return T_SPINE;
  }
  var END = T_SPINE;
  strokes.forEach(function (s) {
    s.ts = Math.max(0, timeAtY(s.top) - 0.08);
    s.dur = Math.min(2.6, Math.max(1.0, 0.8 + 0.9 * s.len));
    s.tr = new Float32Array(s.n);
    for (var k = 0; k < s.n; k++) {
      s.tr[k] = Math.max(s.ts + s.dur * invEase(s.dn[k]), timeAtY(s.xy[k * 2 + 1] - LEAD));
      END = Math.max(END, s.tr[k]);
    }
  });
  var CYCLE = END + 5.0;   // draw, rest, fade, breathe

  // ---------- dots: shed from the drawing tips as they travel down ----------
  var DOTS = [];
  function shed(x, y, te, k) {
    var ang = rnd() * TAU, sp = 0.012 + rnd() * 0.04;
    DOTS.push({ x: x, y: y, te: te, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.7 + 0.018 + rnd() * 0.02,
      life: 1.3 + rnd() * 1.9, r: 0.0035 + rnd() * 0.0065 * k, a: 0.35 + rnd() * 0.5 });
  }
  strokes.forEach(function (s) {
    var step = 0.034, next = step;
    for (var k = 0; k < s.n; k++) {
      if (s.d[k] >= next || (k === s.n - 1)) {
        var dn = s.dn[k];
        if (dn > 0.02) shed(s.xy[k * 2], s.xy[k * 2 + 1], s.tr[k], 1);
        next = s.d[k] + step * (0.6 + rnd() * 0.8);
      }
    }
  });
  for (var sy = SPINE_TOP + 0.02; sy < SPINE_BOT; sy += 0.028 + rnd() * 0.02) { shed(0, sy, timeAtY(sy), 1.2); }
  // a few dots that keep drifting once the drawing is complete
  var AMBIENT = [];
  for (var a0 = 0; a0 < 28; a0++) {
    var ay = -1 + rnd() * 2, aw = 0.62 * Math.sqrt(Math.max(0.05, 1 - ay * ay * 0.55));
    AMBIENT.push({ x: (rnd() * 2 - 1) * aw, y: ay, p1: rnd() * TAU, p2: rnd() * TAU, p3: rnd() * TAU, r: 0.003 + rnd() * 0.005, a: 0.2 + rnd() * 0.35 });
  }

  // ---------- themes ----------
  var THEMES = {
    light: { bg: null, ink: [30, 30, 30], inkA: 0.92, wisp: [120, 120, 120], wispA: [0.42, 0.30, 0.20, 0.13], haze: [70, 70, 70], hazeA: 0.10, dot: [70, 70, 70] },
    dark: { bg: [12, 12, 12], ink: [236, 236, 236], inkA: 0.94, wisp: [150, 150, 150], wispA: [0.45, 0.32, 0.21, 0.13], haze: [210, 210, 210], hazeA: 0.10, dot: [215, 215, 215] }
  };
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ")"; }
  var cache = {};
  function buf(w, h) {
    var b = cache.haze;
    if (!b || b.width !== w || b.height !== h) {
      if (typeof OffscreenCanvas !== "undefined") { try { b = new OffscreenCanvas(w, h); } catch (e) { b = null; } }
      if (!b) { b = document.createElement("canvas"); b.width = w; b.height = h; }
      cache.haze = b;
    }
    return b;
  }

  // wisp layers: soft, slowly drifting offsets of the line work
  var WISPS = [
    { amp: 0.009, f1: 4.3, f2: 3.1, sp: 0.24, ph: 1.1, lag: 0.10, w: 0.55 },
    { amp: 0.020, f1: 3.1, f2: 2.3, sp: 0.19, ph: 0.4, lag: 0.20, w: 0.7 },
    { amp: 0.034, f1: 2.2, f2: 3.4, sp: 0.14, ph: 2.1, lag: 0.38, w: 0.65 },
    { amp: 0.052, f1: 1.6, f2: 2.7, sp: 0.10, ph: 4.0, lag: 0.58, w: 0.6 }
  ];

  // Draw one frame. ctx: 2D context, W/H in device pixels, t in seconds.
  function frame(ctx, W, H, t, opts) {
    var o = { theme: "light", loop: false };
    for (var k in opts) o[k] = opts[k];
    var th = THEMES[o.theme] || THEMES.light;
    var g = 1, tt = t;
    if (o.loop) {
      tt = ((t % CYCLE) + CYCLE) % CYCLE;
      var fs = END + 2.9;
      g = 1 - ease((tt - fs) / 1.5);
    }
    var S = Math.min(W / 1.34, H / 2.3), cx = W / 2, cy = H / 2;
    var lw = Math.max(0.8, S * 0.0068);
    var tipY = spineY(tt), done = tt >= END;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (th.bg) { ctx.fillStyle = rgba(th.bg, 1); ctx.fillRect(0, 0, W, H); } else ctx.clearRect(0, 0, W, H);
    if (g <= 0.001) { ctx.restore(); return; }
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // trace every revealed stroke into ctx2 with an optional drifting offset
    function trace(c2, time, s, off, ox, oy) {
      var xy = s.xy, tr = s.tr, pen = -1;
      function P(j) {
        var x = xy[j * 2], y = xy[j * 2 + 1];
        if (off) { x += off.amp * Math.sin(off.f1 * y + tt * off.sp * TAU + off.ph); y += off.amp * 0.7 * Math.sin(off.f2 * x + tt * off.sp * 0.8 * TAU + off.ph * 1.7); }
        return [ox + x * S, oy + y * S];
      }
      for (var j = 1; j < s.n; j++) {
        var a = tr[j - 1], b = tr[j];
        if (a <= time && b <= time) {
          if (pen !== j - 1) { var pa = P(j - 1); c2.moveTo(pa[0], pa[1]); }
          var pb = P(j); c2.lineTo(pb[0], pb[1]); pen = j;
        } else if (a <= time || b <= time) {
          var lo = a <= time ? j - 1 : j, hi = a <= time ? j : j - 1, f = (time - tr[lo]) / ((tr[hi] - tr[lo]) || 1);
          var P0 = P(lo), P1 = P(hi), mx = P0[0] + (P1[0] - P0[0]) * f, my = P0[1] + (P1[1] - P0[1]) * f;
          if (lo === j - 1) { if (pen !== j - 1) c2.moveTo(P0[0], P0[1]); c2.lineTo(mx, my); pen = -1; }
          else { c2.moveTo(mx, my); c2.lineTo(P0[0], P0[1]); pen = j; }
        }
      }
    }
    function spinePath(c2, y1, off, ox, oy) {
      if (y1 <= SPINE_TOP) return;
      var n = 60;
      for (var i = 0; i <= n; i++) {
        var y = SPINE_TOP + (y1 - SPINE_TOP) * i / n, x = 0;
        if (off) { x += off.amp * Math.sin(off.f1 * y + tt * off.sp * TAU + off.ph); y += off.amp * 0.7 * Math.sin(tt * off.sp * 0.8 * TAU + off.ph * 1.7); }
        if (i) c2.lineTo(ox + x * S, oy + y * S); else c2.moveTo(ox + x * S, oy + y * S);
      }
    }

    // --- haze: a soft grey bloom under the drawing (low-res buffer = free blur)
    var hs = 5, hw = Math.ceil(W / hs), hh = Math.ceil(H / hs), HB = buf(hw, hh), hx = HB.getContext("2d");
    hx.setTransform(1, 0, 0, 1, 0, 0); hx.clearRect(0, 0, hw, hh);
    hx.setTransform(1 / hs, 0, 0, 1 / hs, 0, 0);
    hx.lineCap = "round"; hx.lineJoin = "round";
    hx.strokeStyle = rgba(th.haze, th.hazeA); hx.lineWidth = lw * 9; hx.beginPath();
    strokes.forEach(function (s) { trace(hx, tt - 0.3, s, WISPS[2], cx, cy); });
    spinePath(hx, spineY(tt - 0.3), WISPS[2], cx, cy);
    hx.stroke();
    ctx.globalAlpha = g; ctx.imageSmoothingEnabled = true;
    ctx.drawImage(HB, 0, 0, hw * hs, hh * hs);

    // --- wisps: lighter grey threads drifting behind the line work, trailing the pen
    WISPS.forEach(function (wp, wi) {
      ctx.strokeStyle = rgba(th.wisp, th.wispA[wi]); ctx.lineWidth = lw * wp.w; ctx.beginPath();
      strokes.forEach(function (s) { trace(ctx, tt - wp.lag, s, wp, cx, cy); });
      spinePath(ctx, spineY(tt - wp.lag), wp, cx, cy);
      ctx.stroke();
    });

    // --- dots shed by the drawing tips
    ctx.fillStyle = rgba(th.dot, 1);
    for (var di = 0; di < DOTS.length; di++) {
      var d = DOTS[di], age = tt - d.te;
      if (age < 0 || age > d.life) continue;
      var u = age / d.life, al = d.a * Math.min(1, age / 0.15) * Math.pow(1 - u, 1.6);
      var px = d.x + d.vx * age * (1 - 0.3 * u), py = d.y + d.vy * age * (1 - 0.3 * u);
      ctx.globalAlpha = g * al;
      ctx.beginPath(); ctx.arc(cx + px * S, cy + py * S, Math.max(0.6, d.r * S * (1 - 0.4 * u)), 0, TAU); ctx.fill();
    }
    // --- ambient dots once the drawing has settled
    var amb = clamp01((tt - END + 0.6) / 2.2);
    if (amb > 0) {
      AMBIENT.forEach(function (m) {
        var px = m.x + 0.025 * Math.sin(tt * 0.31 + m.p1), py = m.y + 0.035 * Math.sin(tt * 0.23 + m.p2);
        ctx.globalAlpha = g * amb * m.a * (0.55 + 0.45 * Math.sin(tt * 0.9 + m.p3));
        ctx.beginPath(); ctx.arc(cx + px * S, cy + py * S, Math.max(0.6, m.r * S), 0, TAU); ctx.fill();
      });
    }
    ctx.globalAlpha = g;

    // --- the sigil
    ctx.strokeStyle = rgba(th.ink, th.inkA); ctx.lineWidth = lw; ctx.beginPath();
    strokes.forEach(function (s) { trace(ctx, tt, s, null, cx, cy); });
    spinePath(ctx, tipY, null, cx, cy);
    ctx.stroke();

    // --- pearls pop as the spine reaches them, each with one soft ring
    NODES.forEach(function (ny) {
      var tp = timeAtY(ny), age = tt - tp;
      if (age < 0) return;
      var r = NR * S * easeOut(age / 0.45);
      ctx.fillStyle = rgba(th.ink, 1); ctx.beginPath(); ctx.arc(cx, cy + ny * S, r, 0, TAU); ctx.fill();
      if (age < 1.4) {
        var q = age / 1.4;
        ctx.strokeStyle = rgba(th.wisp, 0.45 * (1 - q)); ctx.lineWidth = lw * 0.7;
        ctx.beginPath(); ctx.arc(cx, cy + ny * S, NR * S * (1.2 + 3.2 * easeOut(q)), 0, TAU); ctx.stroke();
      }
    });
    ctx.restore();
  }

  // ---------- mounting ----------
  function mount(el, opts) {
    opts = opts || {};
    var theme = opts.theme || el.getAttribute("data-theme") || "light";
    var loop = opts.loop !== undefined ? opts.loop : el.getAttribute("data-loop") === "true";
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", el.getAttribute("aria-label") || "Patricia Mou's sigil");
    cv.style.cssText = "display:block;width:100%;height:100%";
    if (!el.style.aspectRatio && !el.style.height) el.style.aspectRatio = "0.66";
    el.appendChild(cv);
    var ctx = cv.getContext("2d"), W = 0, H = 0, t0 = null, visible = false, raf = 0;
    function size() {
      var r = el.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    }
    function draw(now) {
      raf = 0;
      if (reduce) { frame(ctx, W, H, END + 6, { theme: theme, loop: false }); return; }
      if (t0 === null) t0 = now;
      frame(ctx, W, H, (now - t0) / 1000, { theme: theme, loop: loop });
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
    var els = document.querySelectorAll(".pm-sigil:not([data-mounted])");
    for (var i = 0; i < els.length; i++) { els[i].setAttribute("data-mounted", ""); mount(els[i]); }
  }
  if (typeof window !== "undefined") {
    window.PMSigil = { frame: frame, mount: mount, END: END, CYCLE: CYCLE };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
  }
})();
