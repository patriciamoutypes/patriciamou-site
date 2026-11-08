/* veil, as music: a 963 Hz drone with slow chords and a glass-flute melody.
   Made in the page with the Web Audio API, so there is no audio file.
   Browsers only allow sound after a visitor interacts, so it starts softly on the
   first click, tap or key press anywhere, and pauses while the tab is hidden. */
(function () {
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  var F = 963, R = F / 2, ctx = null;

  function impulse(secs, decay) {
    var len = ctx.sampleRate * secs, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  function panner(v) { var p = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(); if (p.pan) p.pan.value = v; return p; }
  function swell(param, base, depth, period) {
    param.value = base;
    var l = ctx.createOscillator(), lg = ctx.createGain();
    l.frequency.value = 1 / period; lg.gain.value = depth;
    l.connect(lg).connect(param); l.start();
  }

  function start() {
    ctx = new AC();
    var master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    var out = ctx.createGain(), dry = ctx.createGain(), wet = ctx.createGain(), verb = ctx.createConvolver();
    dry.gain.value = .64; wet.gain.value = .6; verb.buffer = impulse(6, 3);
    out.connect(dry).connect(master); out.connect(verb).connect(wet).connect(master);
    master.gain.setValueAtTime(0, ctx.currentTime); master.gain.linearRampToValueAtTime(1, ctx.currentTime + 6);

    // the drone: 963 with its lower octave and fifth, each gently breathing
    [[R, .03, -.4], [R + .6, .022, .4], [F, .035, .2], [F + .7, .025, -.2], [F * 1.5, .009, .5]].forEach(function (v) {
      var o = ctx.createOscillator(), g = ctx.createGain(), p = panner(v[2]);
      o.frequency.value = v[0]; o.connect(g).connect(p).connect(out); o.start();
      swell(g.gain, v[1], v[1] * .5, 8 + Math.random() * 8);
    });

    var padBus = ctx.createBiquadFilter(); padBus.type = "lowpass"; padBus.frequency.value = 1500; padBus.Q.value = .3; padBus.connect(out);
    function pad(freqs, t, len, peak) {
      freqs.forEach(function (f, k) { [1, 1.0035].forEach(function (d) {
        var o = ctx.createOscillator(), g = ctx.createGain(), p = panner((k - 1) * .35 * (d > 1 ? -1 : 1));
        o.type = "triangle"; o.frequency.value = f * d;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 3.5);
        g.gain.setValueAtTime(peak, t + len); g.gain.linearRampToValueAtTime(0, t + len + 5);
        o.connect(g).connect(p).connect(padBus); o.start(t); o.stop(t + len + 5.2);
      }); });
    }
    // I, vi, IV, I, iv in just intonation; every chord holds the home note, so 963 rings through all of them
    var CH = [
      {bass: R / 2,      tones: [R, R * 5 / 4, R * 3 / 2],     mel: [1, 5 / 4, 3 / 2, 9 / 8, 2]},
      {bass: R * 5 / 12, tones: [R * 5 / 6, R, R * 5 / 4],     mel: [1, 5 / 4, 5 / 3, 5 / 3, 9 / 8]},
      {bass: R * 2 / 3,  tones: [R, R * 4 / 3, R * 5 / 3],     mel: [1, 4 / 3, 5 / 3, 2, 9 / 8]},
      {bass: R / 2,      tones: [R, R * 5 / 4, R * 3 / 2],     mel: [1, 5 / 4, 3 / 2, 15 / 8, 2]},
      {bass: R * 2 / 3,  tones: [R, R * 4 / 3, R * 8 / 5],     mel: [1, 4 / 3, 8 / 5, 2, 6 / 5]}
    ];
    var LEN = 11, ci = 0, mel = CH[0].mel, last = 0;
    function chord() {
      if (ctx.state === "running") {
        var c = CH[ci % CH.length], t = ctx.currentTime + .05; ci++; mel = c.mel;
        pad(c.tones, t, LEN, .016); pad([c.bass], t, LEN, .03);
      }
      setTimeout(chord, LEN * 1000);
    }
    function flute(f, t, dur) {
      var o = ctx.createOscillator(), g = ctx.createGain(), p = panner(Math.random() * .8 - .4);
      var v = ctx.createOscillator(), vg = ctx.createGain();
      o.frequency.value = f; v.frequency.value = 4.6;
      vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * .004, t + .8);
      v.connect(vg).connect(o.frequency);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.05, t + .35);
      g.gain.setValueAtTime(.05, t + dur * .4); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(p).connect(out); o.start(t); v.start(t); o.stop(t + dur + .1); v.stop(t + dur + .1);
    }
    function phrase() {
      var wait = 4000;
      if (ctx.state === "running") {
        var t = ctx.currentTime + .05, n = 2 + Math.floor(Math.random() * 3);
        for (var k = 0; k < n; k++) {
          var j = Math.max(0, Math.min(mel.length - 1, last + Math.floor(Math.random() * 3) - 1));
          if (k === n - 1 && Math.random() < .5) j = 0;   // phrases often come home to 963
          last = j;
          var step = .9 + Math.random() * .9;
          flute(F * mel[j], t, step + 2.2); t += step;
        }
        wait = (t - ctx.currentTime) * 1000 + 3000 + Math.random() * 5000;
      }
      setTimeout(phrase, wait);
    }
    chord(); setTimeout(phrase, 4000);

    document.addEventListener("visibilitychange", function () { document.hidden ? ctx.suspend() : ctx.resume(); });
  }

  var EVENTS = ["pointerdown", "touchend", "keydown", "click"];
  // keep listening until the browser lets the sound run (iPhones only unlock on touchend, not pointerdown)
  function begin() {
    if (!ctx) start();
    var done = function () { if (ctx.state === "running") EVENTS.forEach(function (e) { document.removeEventListener(e, begin, true); }); };
    if (ctx.state !== "running") { var p = ctx.resume(); if (p && p.then) p.then(done); } else done();
  }
  EVENTS.forEach(function (e) { document.addEventListener(e, begin, true); });
})();
