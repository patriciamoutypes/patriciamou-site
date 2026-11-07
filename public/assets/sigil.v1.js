/*!
 * Patricia Mou sigil: a slowly turning lantern of light.
 * Drop-in: <div class="pm-sigil"></div><script src="sigil.js" defer></script>
 * Options (data attributes on the div):
 *   data-theme="light" | "dark"   light = ink + amber glow for white pages (default)
 *   data-intro="false"            skip the opening draw-in
 *   data-period="12"              seconds per sway cycle
 * No dependencies. Pauses when off-screen. Honors prefers-reduced-motion.
 */
(function () {
  "use strict";
  var DATA = {"s":[[-0.4486,-0.2103,-0.4617,-0.2178,-0.4747,-0.2298,-0.4882,-0.2449,-0.5003,-0.2611,-0.5109,-0.2783,-0.5203,-0.2962,-0.528,-0.3149,-0.5343,-0.3341,-0.5394,-0.3563,-0.5425,-0.3763,-0.5439,-0.3964,-0.5439,-0.4217,-0.5425,-0.4419,-0.5394,-0.4618,-0.5349,-0.4816,-0.5288,-0.5008,-0.5211,-0.5195,-0.5122,-0.5376,-0.5019,-0.555,-0.4889,-0.5738,-0.4779,-0.5876,-0.4642,-0.6024,-0.4494,-0.6162,-0.4336,-0.6289,-0.417,-0.6404,-0.3997,-0.6509,-0.3817,-0.6601,-0.3654,-0.667,-0.322,-0.6804,-0.302,-0.6837,-0.2819,-0.6858,-0.244,-0.6858,-0.2239,-0.6838,-0.2014,-0.6802,-0.1842,-0.6763,-0.1648,-0.6705,-0.1481,-0.6645,-0.1296,-0.6565,-0.1115,-0.6474,-0.0942,-0.6371,-0.0776,-0.6254,-0.0599,-0.6112,-0.0451,-0.5974,-0.0313,-0.5826,-0.0205,-0.5686,-0.005,-0.5455,0.0032,-0.5359,0.0149,-0.5263,0.0343,-0.5143,0.0637,-0.4998,0.0944,-0.4879,0.2152,-0.4511,0.2392,-0.4429,0.2694,-0.4301,0.3006,-0.4134,0.322,-0.3999,0.3443,-0.3833,0.3634,-0.3668,0.3811,-0.3488,0.3972,-0.3293,0.4117,-0.3086,0.4242,-0.2866,0.4326,-0.2682,0.4417,-0.242,0.4475,-0.2148,0.4465,-0.1997,0.4422,-0.1878,0.4258,-0.1594,0.4026,-0.1293,0.3762,-0.1021,0.3452,-0.0762,0.316,-0.0563,0.2785,-0.0352,0.244,-0.0195,0.206,-0.0058,0.1622,0.0064,0.1151,0.016,0.0726,0.0219,0.0021,0.0288,-0.0124,0.0333,-0.0307,0.0418,-0.0655,0.0624,-0.1078,0.09,-0.1342,0.1097,-0.1589,0.1312,-0.1833,0.1569,-0.2034,0.1829,-0.2189,0.209,-0.2301,0.2344,-0.2361,0.2537,-0.2415,0.2784,-0.2423,0.3264,-0.2398,0.349,-0.2346,0.3763,-0.2279,0.4033,-0.2196,0.4298,-0.206,0.4652,-0.1904,0.4998,-0.1654,0.5494,-0.0984,0.677,-0.0644,0.7476,-0.0374,0.8102,-0.0093,0.8861,-0.0063,0.8902,0.0,0.8943],[0.4486,-0.2103,0.4617,-0.2178,0.4747,-0.2298,0.4882,-0.2449,0.5003,-0.2611,0.5109,-0.2783,0.5203,-0.2962,0.528,-0.3149,0.5343,-0.3341,0.5394,-0.3563,0.5425,-0.3763,0.5439,-0.3964,0.5439,-0.4217,0.5425,-0.4419,0.5394,-0.4618,0.5349,-0.4816,0.5288,-0.5008,0.5211,-0.5195,0.5122,-0.5376,0.5019,-0.555,0.4889,-0.5738,0.4779,-0.5876,0.4642,-0.6024,0.4494,-0.6162,0.4336,-0.6289,0.417,-0.6404,0.3997,-0.6509,0.3817,-0.6601,0.3654,-0.667,0.322,-0.6804,0.302,-0.6837,0.2819,-0.6858,0.244,-0.6858,0.2239,-0.6838,0.2014,-0.6802,0.1842,-0.6763,0.1648,-0.6705,0.1481,-0.6645,0.1296,-0.6565,0.1115,-0.6474,0.0942,-0.6371,0.0776,-0.6254,0.0599,-0.6112,0.0451,-0.5974,0.0313,-0.5826,0.0205,-0.5686,0.005,-0.5455,-0.0032,-0.5359,-0.0149,-0.5263,-0.0343,-0.5143,-0.0637,-0.4998,-0.0944,-0.4879,-0.2152,-0.4511,-0.2392,-0.4429,-0.2694,-0.4301,-0.3006,-0.4134,-0.322,-0.3999,-0.3443,-0.3833,-0.3634,-0.3668,-0.3811,-0.3488,-0.3972,-0.3293,-0.4117,-0.3086,-0.4242,-0.2866,-0.4326,-0.2682,-0.4417,-0.242,-0.4475,-0.2148,-0.4465,-0.1997,-0.4422,-0.1878,-0.4258,-0.1594,-0.4026,-0.1293,-0.3762,-0.1021,-0.3452,-0.0762,-0.316,-0.0563,-0.2785,-0.0352,-0.244,-0.0195,-0.206,-0.0058,-0.1622,0.0064,-0.1151,0.016,-0.0726,0.0219,-0.0021,0.0288,0.0124,0.0333,0.0307,0.0418,0.0655,0.0624,0.1078,0.09,0.1342,0.1097,0.1589,0.1312,0.1833,0.1569,0.2034,0.1829,0.2189,0.209,0.2301,0.2344,0.2361,0.2537,0.2415,0.2784,0.2423,0.3264,0.2398,0.349,0.2346,0.3763,0.2279,0.4033,0.2196,0.4298,0.206,0.4652,0.1904,0.4998,0.1654,0.5494,0.0984,0.677,0.0644,0.7476,0.0374,0.8102,0.0093,0.8861,0.0063,0.8902,0.0,0.8943],[0.0,0.8131,-0.0069,0.81,-0.0094,0.8056,-0.0332,0.7203,-0.0556,0.6531,-0.0862,0.5755,-0.114,0.5131,-0.1447,0.452,-0.1808,0.3882,-0.2075,0.3452,-0.2302,0.3117,-0.2335,0.3079,-0.2402,0.3043],[0.0,0.8131,0.0069,0.81,0.0094,0.8056,0.0332,0.7203,0.0556,0.6531,0.0862,0.5755,0.114,0.5131,0.1447,0.452,0.1808,0.3882,0.2075,0.3452,0.2302,0.3117,0.2335,0.3079,0.2402,0.3043],[-0.2444,0.2784,-0.2531,0.2734,-0.2676,0.2558,-0.3188,0.1897,-0.3546,0.1405,-0.3816,0.1006,-0.4016,0.0683,-0.4188,0.0373,-0.4318,0.0098,-0.4427,-0.0186,-0.4513,-0.0478,-0.4575,-0.0775,-0.4605,-0.1027,-0.4613,-0.1331,-0.4588,-0.1634,-0.454,-0.1882,-0.4514,-0.1926,-0.4475,-0.1958],[0.2444,0.2784,0.2531,0.2734,0.2676,0.2558,0.3188,0.1897,0.3546,0.1405,0.3816,0.1006,0.4016,0.0683,0.4188,0.0373,0.4318,0.0098,0.4427,-0.0186,0.4513,-0.0478,0.4575,-0.0775,0.4605,-0.1027,0.4613,-0.1331,0.4588,-0.1634,0.454,-0.1882,0.4514,-0.1926,0.4475,-0.1958],[-0.2377,-0.4497,-0.2488,-0.458,-0.2663,-0.4796,-0.2853,-0.5064,-0.2995,-0.5303,-0.3098,-0.5506,-0.3184,-0.5717,-0.3254,-0.5933,-0.3308,-0.6155,-0.3344,-0.6379,-0.3361,-0.6606,-0.3359,-0.6884,-0.3341,-0.7111,-0.3303,-0.7361,-0.3246,-0.7608,-0.3172,-0.7849,-0.3097,-0.8037,-0.2987,-0.8265,-0.2873,-0.8462,-0.2744,-0.865,-0.2586,-0.8847,-0.2413,-0.9031,-0.2246,-0.9185,-0.2048,-0.9342,-0.1838,-0.9484,-0.1619,-0.9611,-0.1414,-0.971,-0.1179,-0.9802,-0.0962,-0.987,-0.0716,-0.993,-0.0442,-0.9975,-0.024,-0.9993,-0.0013,-1.0,0.024,-0.9993,0.0442,-0.9975,0.0716,-0.993,0.0962,-0.987,0.1179,-0.9802,0.1414,-0.971,0.1619,-0.9611,0.1838,-0.9484,0.2048,-0.9342,0.2246,-0.9185,0.2413,-0.9031,0.2586,-0.8847,0.2744,-0.865,0.2873,-0.8462,0.2987,-0.8265,0.3097,-0.8037,0.3172,-0.7849,0.3246,-0.7608,0.3303,-0.7361,0.3341,-0.7111,0.3359,-0.6884,0.3361,-0.6606,0.3344,-0.6379,0.3308,-0.6155,0.3254,-0.5933,0.3184,-0.5717,0.3098,-0.5506,0.2995,-0.5303,0.2853,-0.5064,0.2663,-0.4796,0.2488,-0.458,0.2377,-0.4497],[0.0,1.0,-0.0,0.3429,-0.0008,0.3227,-0.0038,0.3104,-0.0081,0.3013,-0.0162,0.2885,-0.0413,0.2536,-0.0616,0.2311,-0.0877,0.2072,-0.1096,0.1901,-0.1343,0.1725,-0.2581,0.094,-0.3063,0.0614,-0.3422,0.0335,-0.3717,0.0058,-0.3867,-0.0112,-0.399,-0.0272,-0.4115,-0.0462,-0.4223,-0.0662,-0.4303,-0.0848,-0.4374,-0.1064,-0.4439,-0.136,-0.4516,-0.1898],[0.0,0.3116,0.0301,0.2679,0.0442,0.25,0.0648,0.2278,0.0913,0.2043,0.1361,0.1713,0.2579,0.0941,0.3041,0.063,0.3421,0.0336,0.3716,0.0059,0.3867,-0.0111,0.4004,-0.0292,0.4115,-0.0462,0.4223,-0.0662,0.4303,-0.0848,0.4374,-0.1064,0.4439,-0.136,0.4516,-0.1898],[0.0,-0.9998,0.0,-0.0115,-0.0007,0.0163,-0.0027,0.0262,-0.0054,0.0333,-0.0158,0.0506,-0.03,0.0684,-0.0684,0.112,-0.0893,0.1374,-0.104,0.1579,-0.1183,0.1818,-0.128,0.2024,-0.1358,0.2264,-0.1405,0.2512,-0.1421,0.2765,-0.14,0.3042,-0.1331,0.3363,-0.124,0.3626,-0.1111,0.39,-0.0906,0.4248,-0.0619,0.4665,-0.027,0.513,0.0,0.5431],[0.0,0.0274,0.0234,0.0605,0.0699,0.1138,0.0908,0.1392,0.1026,0.1557,0.1144,0.1751,0.1269,0.1999,0.1351,0.2238,0.1405,0.2511,0.142,0.2764,0.1403,0.3016,0.1338,0.3338,0.124,0.3625,0.1111,0.39,0.0906,0.4248,0.0619,0.4665,0.027,0.513,0.0,0.5431],[0.2316,-0.4307,0.2223,-0.4268,0.1721,-0.3803,0.1284,-0.3458,0.0927,-0.3217,0.03,-0.2834,0.009,-0.2692,-0.036,-0.2283,-0.064,-0.2065,-0.083,-0.1939,-0.1029,-0.1828,-0.1257,-0.1718,-0.147,-0.1636,-0.1835,-0.1529,-0.2159,-0.1471,-0.2589,-0.1447,-0.2942,-0.1467,-0.3293,-0.1523,-0.3587,-0.16,-0.3919,-0.1724,-0.4328,-0.1926,-0.4399,-0.1952,-0.4475,-0.1958],[-0.2316,-0.4307,-0.2223,-0.4268,-0.1721,-0.3803,-0.1284,-0.3458,-0.0927,-0.3217,-0.03,-0.2834,-0.009,-0.2692,0.036,-0.2283,0.064,-0.2065,0.083,-0.1939,0.1029,-0.1828,0.1257,-0.1718,0.147,-0.1636,0.1835,-0.1529,0.2159,-0.1471,0.2589,-0.1447,0.2942,-0.1467,0.3293,-0.1523,0.3587,-0.16,0.3919,-0.1724,0.4328,-0.1926,0.4399,-0.1952,0.4475,-0.1958],[0.0,-0.536,-0.0105,-0.5216,-0.0185,-0.5086,-0.0254,-0.4949,-0.0319,-0.4783,-0.037,-0.4612,-0.0401,-0.4463,-0.0421,-0.4286,-0.0428,-0.4108,-0.042,-0.393,-0.0402,-0.3778,-0.0318,-0.3405,-0.0178,-0.2996,0.0,-0.2629],[0.0,-0.536,0.0105,-0.5216,0.0185,-0.5086,0.0254,-0.4949,0.0319,-0.4783,0.037,-0.4612,0.0401,-0.4463,0.0421,-0.4286,0.0428,-0.4108,0.042,-0.393,0.0402,-0.3778,0.0318,-0.3405,0.0178,-0.2996,0.0,-0.2629],[0.0,-0.7808,-0.0327,-0.7671,-0.0533,-0.7573,-0.0776,-0.7437,-0.1011,-0.7288,-0.1217,-0.714,-0.1413,-0.6979,-0.1769,-0.662,-0.1905,-0.6437,-0.2029,-0.6246,-0.2135,-0.6044,-0.2224,-0.5834,-0.2294,-0.5617,-0.2345,-0.5395,-0.2379,-0.5144,-0.2389,-0.4942,-0.237,-0.4537,-0.2294,-0.4088,-0.2254,-0.3915,-0.2193,-0.3722,-0.211,-0.3509,-0.2002,-0.3281,-0.188,-0.3059,-0.1722,-0.2799,-0.1536,-0.2527,-0.1355,-0.2283,-0.1087,-0.1946,-0.0743,-0.1574,-0.0351,-0.1179,-0.0202,-0.1006,-0.0081,-0.0844,0.0,-0.0783],[0.0,-0.7808,0.0327,-0.7671,0.0533,-0.7573,0.0776,-0.7437,0.1011,-0.7288,0.1217,-0.714,0.1413,-0.6979,0.1769,-0.662,0.1905,-0.6437,0.2029,-0.6246,0.2135,-0.6044,0.2224,-0.5834,0.2294,-0.5617,0.2345,-0.5395,0.2379,-0.5144,0.2389,-0.4942,0.237,-0.4537,0.2294,-0.4088,0.2254,-0.3915,0.2193,-0.3722,0.211,-0.3509,0.2002,-0.3281,0.188,-0.3059,0.1722,-0.2799,0.1536,-0.2527,0.1355,-0.2283,0.1087,-0.1946,0.0743,-0.1574,0.0351,-0.1179,0.0202,-0.1006,0.0081,-0.0844,0.0,-0.0783],[0.0,0.0274,0.0,0.3116]],"c":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"n":[-0.7808,-0.5359,-0.2629,0.0274,0.3116,0.5431],"nr":0.0212};

  // ---------- geometry ----------
  var TAU = Math.PI * 2;
  var shell = [], axis = [], NODES = DATA.n, NR = DATA.nr;
  var PROF_N = 96, PROF_Y0 = -1.06, PROF_Y1 = 1.06, prof = new Float32Array(PROF_N);

  (function build() {
    var raw = DATA.s.map(function (f) {
      var p = [];
      for (var i = 0; i < f.length; i += 2) p.push([f[i], f[i + 1]]);
      return p;
    });
    // subdivide long segments so the curve survives rotation on the curved shell
    raw = raw.map(function (p) {
      var o = [p[0]];
      for (var i = 1; i < p.length; i++) {
        var a = p[i - 1], b = p[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
        var n = Math.max(1, Math.ceil(d / 0.009));
        for (var k = 1; k <= n; k++) o.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      return o;
    });
    // silhouette profile: half-width of the drawing at each height
    var i, j;
    for (i = 0; i < PROF_N; i++) prof[i] = 0;
    raw.forEach(function (p) {
      p.forEach(function (q) {
        var b = Math.round((q[1] - PROF_Y0) / (PROF_Y1 - PROF_Y0) * (PROF_N - 1));
        if (b >= 0 && b < PROF_N) prof[b] = Math.max(prof[b], Math.abs(q[0]));
      });
    });
    var tmp = new Float32Array(PROF_N);
    for (i = 0; i < PROF_N; i++) { var m = 0; for (j = -3; j <= 3; j++) { var k2 = i + j; if (k2 >= 0 && k2 < PROF_N) m = Math.max(m, prof[k2]); } tmp[i] = m; }
    for (i = 0; i < PROF_N; i++) { var s = 0, ws = 0; for (j = -3; j <= 3; j++) { var k3 = Math.min(PROF_N - 1, Math.max(0, i + j)); var w = Math.exp(-j * j / 4); s += tmp[k3] * w; ws += w; } prof[i] = s / ws + 0.012; }

    raw.forEach(function (p, si) {
      var isAxis = p.every(function (q) { return Math.abs(q[0]) < 1e-3; });
      var L = [0];
      for (var k = 1; k < p.length; k++) L.push(L[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
      var tot = L[L.length - 1] || 1;
      var pts = new Float32Array(p.length * 4); // x, y, z, arclength fraction
      for (k = 0; k < p.length; k++) {
        var x = p[k][0], y = p[k][1], w2 = profAt(y);
        pts[k * 4] = x; pts[k * 4 + 1] = y;
        pts[k * 4 + 2] = isAxis ? 0 : Math.sqrt(Math.max(0, w2 * w2 - x * x));
        pts[k * 4 + 3] = L[k] / tot;
      }
      var meanY = 0; for (k = 0; k < p.length; k++) meanY += p[k][1]; meanY /= p.length;
      var st = { pts: pts, n: p.length, len: tot, meanY: meanY, idx: si, phase: (si * 0.6180339) % 1 };
      (isAxis ? axis : shell).push(st);
    });
    // draw-in order: top to bottom
    shell.sort(function (a, b) { return a.meanY - b.meanY; });
    shell.forEach(function (s, k) { s.order = k / Math.max(1, shell.length - 1); });
  })();

  function profAt(y) {
    var f = (y - PROF_Y0) / (PROF_Y1 - PROF_Y0) * (PROF_N - 1);
    var i = Math.max(0, Math.min(PROF_N - 2, Math.floor(f))), t = Math.max(0, Math.min(1, f - i));
    return prof[i] * (1 - t) + prof[i + 1] * t;
  }
  var WMAX = 0; for (var q = 0; q < PROF_N; q++) WMAX = Math.max(WMAX, prof[q]);

  // ---------- themes ----------
  var THEMES = {
    light: {
      bg: null, ink: [30, 30, 30], inkA: 0.92, echoA: 0.10,
      glow: [110, 110, 110], glowA: 0.07, body: [0, 0, 0], bodyA: 0.025,
      pearl: [30, 30, 30], pearlLit: [170, 170, 170], spark: [150, 150, 150], sparkCore: [90, 90, 90], sparkA: 0.5,
      mote: [120, 120, 120], moteA: 0.30, haloA: 0.18, blend: "source-over"
    },
    dark: {
      bg: [12, 12, 12], ink: [236, 236, 236], inkA: 0.92, echoA: 0.12,
      glow: [200, 200, 200], glowA: 0.10, body: [255, 255, 255], bodyA: 0.05,
      pearl: [240, 240, 240], pearlLit: [255, 255, 255], spark: [210, 210, 210], sparkCore: [255, 255, 255], sparkA: 0.6,
      mote: [210, 210, 210], moteA: 0.6, haloA: 1, blend: "lighter"
    }
  };

  // ---------- timeline ----------
  var INTRO = 3.4, SWAY = 0.52, CAM = 4.2, ECHO_Z = -0.32;
  function ease(p) { return 0.5 - 0.5 * Math.cos(Math.PI * p); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function timeline(t, o) {
    var T = o.period, intro = o.intro ? INTRO : 0;
    var r = { theta: 0, tilt: 0, pulse: -1, u: -1, introT: t, inIntro: t < intro, ramp: 1 };
    if (r.inIntro) return r;
    var u = t - intro, ph = ((u % T) + T) % T / T; r.u = u;
    if (o.intro) r.ramp = ease(clamp01(u / 2.5));
    r.theta = SWAY * Math.sin(TAU * ph) * r.ramp;
    r.tilt = 0.07 * Math.sin(TAU * ph * 2 + 0.6) * r.ramp;
    // a bead of light climbs the spine once per cycle
    var a = ((ph - 0.04 + 1) % 1) / 0.30;
    if (a <= 1.25) r.pulse = a;
    return r;
  }
  function strokeReveal(s, tl) {
    if (!tl.inIntro) return 1;
    return ease(clamp01((tl.introT - 0.5 - s.order * 1.4) / 1.4));
  }

  // ---------- drawing ----------
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ")"; }
  function makeCanvas(w, h) {
    if (typeof OffscreenCanvas !== "undefined") { try { return new OffscreenCanvas(w, h); } catch (e) {} }
    var c = document.createElement("canvas"); c.width = w; c.height = h; return c;
  }
  var cache = {};
  function buf(name, w, h) {
    var b = cache[name];
    if (!b || b.width !== w || b.height !== h) b = cache[name] = makeCanvas(Math.max(1, w), Math.max(1, h));
    return b;
  }
  // deterministic motes of light
  var MOTES = [];
  (function () {
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 46; i++) MOTES.push({ x: (rnd() - 0.5) * 1.5, z: (rnd() - 0.5) * 1.1, y0: rnd(), sp: 1 + Math.floor(rnd() * 2), r: 0.004 + rnd() * 0.007, tw: rnd() * TAU });
  })();

  // Draw one frame. ctx: 2D context, W/H in device pixels, t in seconds.
  function frame(ctx, W, H, t, opts) {
    var o = { theme: "light", period: 12, intro: false };
    for (var k in opts) o[k] = opts[k];
    var th = THEMES[o.theme] || THEMES.light;
    var tl = timeline(t, o), T = o.period;
    var ph = tl.u < 0 ? 0 : tl.u / T;

    var S = Math.min(W / 1.42, H / 2.32);
    var cx = W / 2, cy = H / 2 + Math.sin(TAU * ph) * 0.010 * S;
    var lw = Math.max(0.8, S * 0.0068);
    var ct = Math.cos(tl.theta), sn = Math.sin(tl.theta), cp = Math.cos(tl.tilt), sp = Math.sin(tl.tilt);
    var breathe = 0.5 + 0.5 * Math.sin(TAU * ph * 2);
    var introFade = tl.inIntro ? ease(clamp01(tl.introT / 2)) : 1;

    var P3 = [0, 0, 0];
    function proj(x, y, z) {
      var X = x * ct + z * sn, Z = -x * sn + z * ct;
      var Y = y * cp - Z * sp, Z2 = y * sp + Z * cp;
      var f = CAM / (CAM - Z2);
      P3[0] = cx + X * S * f; P3[1] = cy + Y * S * f; P3[2] = f;
      return P3;
    }
    function zAt(x, y) { var w = profAt(y); return DOME * Math.sqrt(Math.max(0, w * w - x * x)); }
    function zFor(x, y) { return zAt(x, y) - DOME * 0.5 * WMAX; } // keep the sheet centred on the pivot

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (th.bg) { ctx.fillStyle = rgba(th.bg, 1); ctx.fillRect(0, 0, W, H); } else ctx.clearRect(0, 0, W, H);

    // --- lantern body glow (tiny buffer, upscaled = free blur)
    var bs = 12, bw = Math.ceil(W / bs), bh = Math.ceil(H / bs), Bc = buf("body", bw, bh), bx = Bc.getContext("2d");
    bx.setTransform(1, 0, 0, 1, 0, 0); bx.clearRect(0, 0, bw, bh);
    bx.setTransform(S / bs, 0, 0, S / bs, (cx + sn * 0.05 * S) / bs, cy / bs);
    var g = bx.createRadialGradient(0, -0.2, 0.05, 0, 0.0, 1.05);
    g.addColorStop(0, rgba(th.body, th.bodyA * (0.85 + 0.15 * breathe)));
    g.addColorStop(0.6, rgba(th.body, th.bodyA * 0.5));
    g.addColorStop(1, rgba(th.body, 0));
    bx.fillStyle = g; bx.beginPath();
    var i, yy, sx = ct * 0.9 + 0.1;
    for (i = 0; i < PROF_N; i++) { yy = PROF_Y0 + (PROF_Y1 - PROF_Y0) * i / (PROF_N - 1); bx.lineTo(prof[i] * 1.06 * sx, yy); }
    for (i = PROF_N - 1; i >= 0; i--) { yy = PROF_Y0 + (PROF_Y1 - PROF_Y0) * i / (PROF_N - 1); bx.lineTo(-prof[i] * 1.06 * sx, yy); }
    bx.closePath(); bx.fill();
    ctx.globalAlpha = introFade; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(Bc, 0, 0, bw * bs, bh * bs);
    ctx.globalAlpha = 1;

    // --- build projected polylines
    var sheet = [], echo = [], sparks = [];
    var spineTop = axisTopY, spineBot = axisBotY;
    var pulseY = tl.pulse >= 0 ? spineBot + (spineTop - spineBot) * ease(Math.min(1, tl.pulse)) : null;
    for (var si = 0; si < shell.length; si++) {
      var s = shell[si], P = s.pts, rev = strokeReveal(s, tl);
      if (rev <= 0) continue;
      var n = Math.max(2, Math.floor(s.n * rev)), line = new Float32Array(n * 2), eline = new Float32Array(n * 2);
      var bandC = ((ph + s.phase) % 1) * 1.8 - 0.4;
      for (var j = 0; j < n; j++) {
        var x = P[j * 4], y = P[j * 4 + 1], z = zFor(x, y);
        proj(x, y, z); line[j * 2] = P3[0]; line[j * 2 + 1] = P3[1];
        proj(x * 1.02, y * 1.02, z + ECHO_Z); eline[j * 2] = P3[0]; eline[j * 2 + 1] = P3[1];
        if (!tl.inIntro && j > 0) {
          var dd = P[j * 4 + 3] - bandC;
          var it = Math.exp(-(dd * dd) / 0.0012);
          if (it > 0.05) sparks.push(line[j * 2 - 2], line[j * 2 - 1], line[j * 2], line[j * 2 + 1], it);
        }
      }
      sheet.push(line); echo.push(eline);
    }
    // spine + pearls sit on the same curved sheet so every junction holds
    var spine = [], SPN = 90;
    var rTop = tl.inIntro ? spineBot + (spineTop - spineBot) * ease(clamp01(tl.introT / 1.3)) : spineTop;
    for (i = 0; i <= SPN; i++) { var sy = spineBot + (rTop - spineBot) * i / SPN; proj(0, sy, zFor(0, sy)); spine.push(P3[0], P3[1]); }
    function sparkPass(c2, color, aMax, width) {
      var NB = 6, bins = []; for (var b = 0; b < NB; b++) bins.push([]);
      for (var q = 0; q < sparks.length; q += 5) bins[Math.min(NB - 1, Math.floor(sparks[q + 4] * NB))].push(q);
      for (b = 0; b < NB; b++) {
        if (!bins[b].length) continue;
        c2.strokeStyle = rgba(color, aMax * (b + 0.5) / NB); c2.lineWidth = width; c2.beginPath();
        bins[b].forEach(function (q) { c2.moveTo(sparks[q], sparks[q + 1]); c2.lineTo(sparks[q + 2], sparks[q + 3]); });
        c2.stroke();
      }
    }
    function polyPath(c2, arr) { c2.moveTo(arr[0], arr[1]); for (var m = 2; m < arr.length; m += 2) c2.lineTo(arr[m], arr[m + 1]); }

    // --- echo layer: a faint second sigil deeper in the space
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = rgba(th.ink, th.echoA * introFade * (0.35 + 0.65 * Math.min(1, Math.abs(sn) * 2.2 + 0.15)));
    ctx.lineWidth = lw * 0.7; ctx.beginPath();
    echo.forEach(function (l) { polyPath(ctx, l); }); ctx.stroke();

    // --- motes behind the sheet
    function drawMotes(front) {
      MOTES.forEach(function (m) {
        if ((m.z > 0) !== front) return;
        var yv = ((m.y0 - ph * m.sp) % 1 + 1) % 1;       // drift upward, loops each period
        var y = 1.0 - yv * 2.1, a = Math.sin(Math.PI * yv);
        var p = proj(m.x, y, m.z), tw = 0.6 + 0.4 * Math.sin(TAU * ph * 3 + m.tw);
        var r = m.r * S * p[2];
        var gg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 3);
        gg.addColorStop(0, rgba(th.mote, th.moteA * a * tw * introFade)); gg.addColorStop(1, rgba(th.mote, 0));
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p[0], p[1], r * 3, 0, TAU); ctx.fill();
      });
    }
    ctx.globalCompositeOperation = th.blend; drawMotes(false); ctx.globalCompositeOperation = "source-over";

    // --- bloom (quarter-res buffer)
    var gs = 5, gw = Math.ceil(W / gs), gh = Math.ceil(H / gs), G = buf("glow", gw, gh), gx = G.getContext("2d");
    gx.setTransform(1, 0, 0, 1, 0, 0); gx.clearRect(0, 0, gw, gh);
    gx.setTransform(1 / gs, 0, 0, 1 / gs, 0, 0);
    gx.lineCap = "round"; gx.lineJoin = "round";
    gx.strokeStyle = rgba(th.glow, th.glowA * introFade); gx.lineWidth = lw * 6; gx.beginPath();
    sheet.forEach(function (l) { polyPath(gx, l); }); polyPath(gx, spine); gx.stroke();
    gx.globalCompositeOperation = "lighter";
    sparkPass(gx, th.spark, 0.30 * th.haloA, lw * 9);
    var nodeP = NODES.map(function (ny) { var p = proj(0, ny, zFor(0, ny)); return [p[0], p[1], p[2], ny]; });
    nodeP.forEach(function (np) {
      var bloom = nodeBloom(np[3], tl, pulseY), r = S * (0.06 + 0.06 * bloom);
      var gg = gx.createRadialGradient(np[0], np[1], 0, np[0], np[1], r);
      gg.addColorStop(0, rgba(th.glow, (0.25 + 0.12 * breathe + 0.6 * bloom) * th.haloA * introFade)); gg.addColorStop(1, rgba(th.glow, 0));
      gx.fillStyle = gg; gx.beginPath(); gx.arc(np[0], np[1], r, 0, TAU); gx.fill();
    });
    var pulseP = null;
    if (pulseY !== null && tl.pulse <= 1.0) {
      pulseP = proj(0, pulseY, zFor(0, pulseY)).slice();
      var pr = S * 0.1, pg = gx.createRadialGradient(pulseP[0], pulseP[1], 0, pulseP[0], pulseP[1], pr);
      pg.addColorStop(0, rgba(th.spark, 0.9 * th.haloA)); pg.addColorStop(1, rgba(th.spark, 0));
      gx.fillStyle = pg; gx.beginPath(); gx.arc(pulseP[0], pulseP[1], pr, 0, TAU); gx.fill();
    }
    gx.globalCompositeOperation = "source-over";
    ctx.globalCompositeOperation = th.blend;
    ctx.drawImage(G, 0, 0, gw * gs, gh * gs);
    ctx.globalCompositeOperation = "source-over";

    // --- the sigil itself: one crisp path
    ctx.strokeStyle = rgba(th.ink, th.inkA); ctx.lineWidth = lw; ctx.beginPath();
    sheet.forEach(function (l) { polyPath(ctx, l); }); polyPath(ctx, spine); ctx.stroke();

    // light travelling along the lines
    if (sparks.length) {
      ctx.globalCompositeOperation = th.blend;
      sparkPass(ctx, o.theme === "dark" ? th.sparkCore : th.spark, th.sparkA, lw * 0.95);
      ctx.globalCompositeOperation = "source-over";
    }
    // bead on the spine with a soft tail
    if (pulseP) {
      var tailY = Math.min(spineBot, pulseY + 0.3), tp = proj(0, tailY, zFor(0, tailY));
      var lg = ctx.createLinearGradient(pulseP[0], pulseP[1], tp[0], tp[1]);
      lg.addColorStop(0, rgba(th.sparkCore, 1)); lg.addColorStop(0.3, rgba(th.spark, 0.75)); lg.addColorStop(1, rgba(th.spark, 0));
      ctx.globalCompositeOperation = th.blend; ctx.strokeStyle = lg; ctx.lineWidth = lw * 1.7; ctx.beginPath();
      var steps = 24; for (i = 0; i <= steps; i++) { var yb = pulseY + (tailY - pulseY) * i / steps; var pb = proj(0, yb, zFor(0, yb)); if (i) ctx.lineTo(pb[0], pb[1]); else ctx.moveTo(pb[0], pb[1]); }
      ctx.stroke(); ctx.globalCompositeOperation = "source-over";
    }
    // --- pearls
    nodeP.forEach(function (np) {
      var ny = np[3];
      if (tl.inIntro && rTop > ny + 0.005) return;
      var pop = tl.inIntro ? ease(clamp01((ny - rTop) / 0.06)) : 1;
      var bloom = nodeBloom(ny, tl, pulseY), r = NR * S * np[2] * (1 + 0.12 * bloom) * pop;
      ctx.fillStyle = rgba(th.pearl, 1); ctx.beginPath(); ctx.arc(np[0], np[1], r, 0, TAU); ctx.fill();
      if (bloom > 0.02) {
        ctx.globalCompositeOperation = th.blend;
        var hg = ctx.createRadialGradient(np[0] - r * 0.25, np[1] - r * 0.25, 0, np[0], np[1], r);
        hg.addColorStop(0, rgba(th.pearlLit, 0.95 * bloom)); hg.addColorStop(1, rgba(th.spark, 0.7 * bloom));
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(np[0], np[1], r, 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    });
    ctx.globalCompositeOperation = th.blend; drawMotes(true); ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }
  var DOME = 0.42;
  var axisTopY = 9, axisBotY = -9;
  axis.concat(shell).forEach(function (s) { for (var k = 0; k < s.n; k++) { if (Math.abs(s.pts[k * 4]) > 1e-3) continue; axisTopY = Math.min(axisTopY, s.pts[k * 4 + 1]); axisBotY = Math.max(axisBotY, s.pts[k * 4 + 1]); } });
  function nodeBloom(ny, tl, pulseY) {
    if (pulseY === null) return 0;
    var d = pulseY - ny;
    if (d > 0) return Math.exp(-(d * d) / 0.003) * 0.7;
    return Math.exp(d * 2.0);
  }

  // ---------- mounting ----------
  function mount(el, opts) {
    opts = opts || {};
    var theme = opts.theme || el.getAttribute("data-theme") || "light";
    var intro = (opts.intro !== undefined ? opts.intro : el.getAttribute("data-intro") !== "false");
    var period = parseFloat(opts.period || el.getAttribute("data-period") || 12);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", el.getAttribute("aria-label") || "Patricia Mou's sigil, slowly turning");
    cv.style.cssText = "display:block;width:100%;height:100%";
    if (!el.style.aspectRatio && !el.style.height) el.style.aspectRatio = "0.66";
    el.appendChild(cv);
    var ctx = cv.getContext("2d"), W = 0, H = 0, t0 = null, visible = true, raf = 0, last = 0;
    function size() {
      var r = el.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    }
    function draw(now) {
      raf = 0;
      if (t0 === null) t0 = now;
      var t = (now - t0) / 1000;
      if (reduce) t = intro ? INTRO + 0.04 * period : 0.04 * period; // a still frame of the front view
      frame(ctx, W, H, t, { theme: theme, period: period, intro: intro });
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(function () { size(); if (reduce) draw(performance.now()); }).observe(el);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    }).observe(el);
    raf = requestAnimationFrame(draw);
    return { canvas: cv };
  }
  function auto() {
    var els = document.querySelectorAll(".pm-sigil:not([data-mounted])");
    for (var i = 0; i < els.length; i++) { els[i].setAttribute("data-mounted", ""); mount(els[i]); }
  }
  if (typeof window !== "undefined") {
    window.PMSigil = { frame: frame, mount: mount, INTRO: INTRO };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
  }
})();
