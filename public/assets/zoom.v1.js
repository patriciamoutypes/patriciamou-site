/*!
 * Click-to-expand for images on patriciamou.com.
 * Any <img> that is not inside a link or button opens full screen; images in the
 * same gallery, slide strip or room grid can be stepped through with arrows,
 * keyboard (← → Esc) or a swipe. Skip an image with data-no-zoom.
 */
(function () {
  "use strict";
  var GROUP = ".gallery, .slides-track, .cx-rooms, .cx-photos, .cr-photos";
  var css = [
    "[data-zoomable]{cursor:zoom-in}",
    "[data-zoomable]:focus-visible{outline:2px solid #816061;outline-offset:3px}",
    ".zv{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(22,18,18,.93);opacity:0;transition:opacity .18s ease}",
    ".zv.on{opacity:1}",
    ".zv figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:14px;max-width:92vw}",
    ".zv img{display:block;max-width:min(92vw,1600px);max-height:82vh;width:auto;height:auto;object-fit:contain;border-radius:3px;box-shadow:0 12px 40px rgba(0,0,0,.45);background:#222}",
    ".zv figcaption{color:#ece5e3;font:400 14px/1.5 Inter,-apple-system,sans-serif;text-align:center;max-width:70ch}",
    ".zv-n{color:#a99c99;margin-left:10px;font-variant-numeric:tabular-nums}",
    ".zv button{position:absolute;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;font:400 20px/1 Inter,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center}",
    ".zv button:hover{background:rgba(255,255,255,.2)}",
    ".zv button:focus-visible{outline:2px solid #fff;outline-offset:2px}",
    ".zv-x{top:16px;right:16px}.zv-p{left:16px;top:50%;margin-top:-22px}.zv-f{right:16px;top:50%;margin-top:-22px}",
    "@media (max-width:640px){.zv-p,.zv-f{top:auto;bottom:18px;margin:0}.zv img{max-height:72vh}}",
    "@media (prefers-reduced-motion:reduce){.zv{transition:none}}",
    "html.zv-lock{overflow:hidden}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function eligible(img) {
    return !img.closest("a, button, .pm-sigil, [data-no-zoom], .zv") && !img.hasAttribute("data-no-zoom");
  }
  function members(img) {
    var g = img.closest(GROUP);
    if (!g) return [img];
    return Array.prototype.filter.call(g.querySelectorAll("img"), eligible);
  }

  var box = null, list = [], at = 0, back = null, sx = null;
  function build() {
    box = document.createElement("div");
    box.className = "zv"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "image viewer");
    box.innerHTML = '<figure><img alt=""/><figcaption></figcaption></figure>' +
      '<button type="button" class="zv-x" aria-label="close">✕</button>' +
      '<button type="button" class="zv-p" aria-label="previous image">←</button>' +
      '<button type="button" class="zv-f" aria-label="next image">→</button>';
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.tagName === "FIGURE") close();
    });
    box.querySelector(".zv-x").addEventListener("click", close);
    box.querySelector(".zv-p").addEventListener("click", function () { go(-1); });
    box.querySelector(".zv-f").addEventListener("click", function () { go(1); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "Tab") { // keep focus inside the viewer
        var f = Array.prototype.filter.call(box.querySelectorAll("button"), function (b) { return b.style.display !== "none"; });
        var i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    box.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    box.addEventListener("pointerup", function (e) {
      if (sx !== null && Math.abs(e.clientX - sx) > 50 && list.length > 1) go(e.clientX < sx ? 1 : -1);
      sx = null;
    });
    document.body.appendChild(box);
  }
  function show() {
    var src = list[at], img = box.querySelector("img");
    img.src = src.currentSrc || src.src; img.alt = src.alt || "";
    var cap = box.querySelector("figcaption");
    cap.textContent = src.alt || "";
    if (list.length > 1) { var n = document.createElement("span"); n.className = "zv-n"; n.textContent = (at + 1) + " / " + list.length; cap.appendChild(n); }
    var many = list.length > 1;
    box.querySelector(".zv-p").style.display = many ? "" : "none";
    box.querySelector(".zv-f").style.display = many ? "" : "none";
  }
  function go(d) { if (list.length < 2) return; at = (at + d + list.length) % list.length; show(); }
  function open(img) {
    if (!box) build();
    list = members(img); at = Math.max(0, list.indexOf(img)); back = img;
    show(); box.style.display = "flex"; document.documentElement.classList.add("zv-lock");
    requestAnimationFrame(function () { box.classList.add("on"); });
    box.querySelector(".zv-x").focus();
  }
  function close() {
    if (!box) return;
    box.classList.remove("on"); box.style.display = "none";
    document.documentElement.classList.remove("zv-lock");
    if (back) back.focus({ preventScroll: true });
  }

  function arm(img) {
    if (img.hasAttribute("data-zoomable") || !eligible(img)) return;
    img.setAttribute("data-zoomable", ""); img.tabIndex = 0; img.setAttribute("role", "button");
    img.setAttribute("aria-label", "expand image" + (img.alt ? ": " + img.alt : ""));
    img.addEventListener("click", function () { open(img); });
    img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); } });
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll("img"), arm); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
