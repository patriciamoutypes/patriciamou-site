"""Build public/bookshelf/index.html from tools/books.json.

    python3 tools/build_bookshelf.py

Each book has a title, author, link, and an optional cover in
public/assets/books/. Books without a cover get a simple typographic one.
"""
import json, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
books = json.load(open(os.path.join(HERE, 'books.json'), encoding='utf-8'))
e = lambda s: html.escape(s or '', quote=True)

# muted cover colours for books without artwork, and a gentle height rhythm so the shelf looks lived in
FAUX = ['#2f4b52', '#7a5a44', '#87a083', '#4b4a7a', '#3f7a70', '#b07c6a']
HEIGHTS = [1.0, 0.92, 0.97, 0.88, 0.95, 0.9, 1.0, 0.86, 0.94]

items = []
for i, b in enumerate(books):
    h = HEIGHTS[i % len(HEIGHTS)]
    label = b['title'] + (f' by {b["author"]}' if b['author'] else '')
    tip = f'<span class="tip"><b>{e(b["title"])}</b>' + (f'<span>{e(b["author"])}</span>' if b['author'] else '') + '</span>'
    if b.get('cover'):
        face = (f'<img src="/assets/books/{e(b["cover"])}" alt="{e(label)}" loading="lazy" decoding="async" '
                f'style="aspect-ratio:{b["ratio"]}"/>')
    else:
        face = (f'<span class="faux" role="img" aria-label="{e(label)}" style="--c:{FAUX[i % len(FAUX)]}">'
                f'<span class="faux-title">{e(b["title"])}</span>'
                + (f'<span class="faux-author">{e(b["author"])}</span>' if b['author'] else '') + '</span>')
    inner = f'{face}{tip}'
    link = b.get('amazon') or b.get('url')   # Amazon with the patriciamou-20 associate tag
    if link:
        inner = f'<a href="{e(link)}" target="_blank" rel="sponsored noopener">{inner}</a>'
    else:
        inner = f'<span class="nolink" tabindex="0">{inner}</span>'
    items.append(f'<li class="book" style="--h:{h}">{inner}</li>')

SCRIPT = '''<script>
(function () {
  var f = document.getElementById("rec-form"); if (!f) return;
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = function (n) { return (f.elements[n].value || "").trim(); };
    var t = v("title"), a = v("author"), w = v("why"), who = v("from");
    var body = t + (a ? " by " + a : "") + (w ? "\\n\\n" + w : "") + (who ? "\\n\\n" + who : "");
    location.href = "mailto:impatriciamou@gmail.com?subject=" + encodeURIComponent("a book for your shelf: " + t) +
      "&body=" + encodeURIComponent(body);
  });
})();
</script>
<script>
(function () {
  var shelf = document.querySelector(".shelf"), layer = document.querySelector(".planks");
  if (!shelf || !layer) return;
  shelf.classList.add("js-planks");
  function lay() {
    var rows = [];
    Array.prototype.forEach.call(shelf.children, function (li) {
      var b = li.offsetTop + li.offsetHeight;
      if (rows.indexOf(b) < 0) rows.push(b);
    });
    layer.innerHTML = rows.map(function (b) {
      return '<div class="plank" style="top:' + (shelf.offsetTop + b) + 'px"></div>';
    }).join("");
  }
  var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(lay, 80); });
  lay();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lay);
})();
</script>
'''

page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>bookshelf · patricia mou</title>
<meta content="Books that moved me: {len(books)} books on Patricia Mou's shelf." name="description"/>
<meta content="bookshelf · patricia mou" property="og:title"/>
<meta content="Books that moved me: {len(books)} books on Patricia Mou's shelf." property="og:description"/>
<meta content="bookshelf · patricia mou" name="twitter:title"/>
<link href="/assets/5eab880b0556b29d7f262604_Screen-Shot-2020-04-30-at-7.18.48-PM.png" rel="shortcut icon" type="image/x-icon"/>
<link href="/assets/5eab87ea46d66a3036bdc28e_Screen-Shot-2020-04-30-at-7.18.48-PM.png" rel="apple-touch-icon"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:wght@500&family=Inter:wght@400;500&display=swap"/>
<style>
:root{{--ink:#1f1f1f;--muted:#6b6b6b;--faint:#9a9a9a;--rose:#816061;--line:#ece6e6;--serif:Cormorant,Georgia,serif;--sans:Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
  --bh:176px;--gap:46px;--plank:12px}}
*{{box-sizing:border-box}}
html,body{{overflow-x:clip}}
body{{margin:0;background:#fff;color:var(--ink);font:400 16px/1.7 var(--sans);-webkit-font-smoothing:antialiased}}
a{{color:var(--rose);text-decoration:none}}
.wrap{{max-width:1080px;margin:0 auto;padding:0 40px 96px}}
.nav{{position:sticky;top:0;z-index:50;display:flex;align-items:baseline;gap:30px;margin:10px -40px 0;padding:18px 40px 16px;font-size:15px;background:rgba(255,255,255,.92);-webkit-backdrop-filter:saturate(1.4) blur(8px);backdrop-filter:saturate(1.4) blur(8px);transition:box-shadow .2s}}
.nav.stuck{{box-shadow:0 1px 0 var(--line, #ece6e6)}}
/* same nav as the home page: a soft blue-grey underline under the current page, your name at the right */
.nav a{{position:relative;color:var(--muted);transition:color .2s}}
.nav a::after{{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;border-radius:1px;background:#bcc2cf;transform:scaleX(0);transform-origin:left;transition:transform .3s ease}}
.nav a[aria-current]{{color:var(--ink)}}
.nav a[aria-current]::after{{transform:scaleX(1)}}
.nav a:hover{{color:var(--ink)}}
.nav .nav-name{{margin-left:auto;font:500 20px/1 var(--serif);color:var(--ink)}}
.nav .nav-name::after{{display:none}}
h1{{font:500 38px/1.1 var(--serif);margin:56px 0 30px}}
.lede{{margin:0 0 34px;color:var(--muted);font-size:15px}}

/* the bookcase: white wall, a wooden plank under every row of books */
.case{{position:relative;padding:24px 0 0;background:#fff}}
.shelf{{list-style:none;margin:0;padding:0 0 var(--gap);display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:var(--gap) 14px;
  background:repeating-linear-gradient(180deg,
    transparent 0 var(--bh),
    #dcc7a6 var(--bh) calc(var(--bh) + 3px),
    #cdb28b calc(var(--bh) + 3px) calc(var(--bh) + var(--plank)),
    rgba(120,90,60,.16) calc(var(--bh) + var(--plank)) calc(var(--bh) + var(--plank) + 6px),
    transparent calc(var(--bh) + var(--plank) + 6px) calc(var(--bh) + var(--gap)))}}
/* real wooden planks with rounded ends, placed under each row by the script below */
.shelf.js-planks{{background:none;position:relative;z-index:1}}
.planks{{position:absolute;inset:0;pointer-events:none;z-index:0}}
.plank{{position:absolute;left:-14px;right:-14px;height:var(--plank);border-radius:7px;
  background:url(/assets/wood-plank.jpg) 0 0/auto 100% repeat-x;
  box-shadow:inset 0 2px 0 rgba(255,236,205,.45),inset 0 -2px 0 rgba(70,40,15,.22),0 7px 10px -5px rgba(60,35,12,.45),0 2px 2px rgba(60,35,12,.12)}}
.plank::after{{content:"";position:absolute;left:10px;right:10px;top:100%;height:10px;border-radius:0 0 50% 50%;
  background:radial-gradient(ellipse at top,rgba(60,35,12,.14),transparent 70%)}}
.book{{height:var(--bh);display:flex;align-items:flex-end;position:relative}}
.book a,.book .nolink{{display:block;position:relative;height:calc(var(--bh) * var(--h));transition:transform .25s ease;outline:none}}
.book img,.faux{{display:block;height:100%;width:auto;border-radius:2px 4px 4px 2px;
  box-shadow:0 1px 1px rgba(0,0,0,.08),5px 6px 12px -6px rgba(60,40,20,.45)}}
.book a::before,.book .nolink::before{{content:"";position:absolute;inset:0;border-radius:2px 4px 4px 2px;pointer-events:none;
  background:linear-gradient(90deg,rgba(0,0,0,.22),rgba(255,255,255,.18) 3px,rgba(0,0,0,.05) 6px,transparent 12px)}}
.book a:hover,.book a:focus-visible,.book .nolink:hover,.book .nolink:focus-visible{{transform:translateY(-8px)}}
.book a:focus-visible img,.book a:focus-visible .faux{{box-shadow:0 0 0 2px var(--rose)}}
.faux{{aspect-ratio:2/3;background:var(--c);color:#fff;padding:12px 10px;display:flex;flex-direction:column;justify-content:space-between}}
.faux-title{{font:500 15px/1.15 var(--serif)}}
.faux-author{{font-size:9px;letter-spacing:.06em;text-transform:uppercase;opacity:.8}}
.tip{{position:absolute;left:50%;bottom:calc(100% + 12px);transform:translate(-50%,4px);width:max-content;max-width:240px;padding:9px 14px;border-radius:10px;
  background:rgba(255,253,251,.97);color:#1f1f1f;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:2;
  box-shadow:0 0 0 1px rgba(60,50,60,.08),0 10px 24px -10px rgba(40,40,70,.35)}}
.note{{margin:40px 0 0;font-size:12px;color:var(--faint)}}
.tip b{{display:block;font:500 18px/1.2 var(--serif)}}
.tip span{{display:block;margin-top:3px;font-size:12px;letter-spacing:.03em;color:#7a7272}}
.book a:hover .tip,.book a:focus-visible .tip,.book .nolink:hover .tip,.book .nolink:focus-visible .tip{{opacity:1;transform:translate(-50%,0)}}
/* recommend a book: a lavender-linen card from the moodboard: a moon-phase orbit turning slowly,
   moon phases and a water swirl hanging off its corners; the button matches the home page */
.rec{{position:relative;max-width:580px;margin:110px auto 40px;padding:40px 44px 34px;border-radius:4px;text-align:center;isolation:isolate;
  background:
    repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 1px,transparent 1px 3px),
    repeating-linear-gradient(0deg,rgba(90,80,120,.018) 0 1px,transparent 1px 5px),
    radial-gradient(120% 70% at 50% 108%,#cbd5df 0%,rgba(203,213,223,0) 62%),
    linear-gradient(180deg,#ebe6ef,#e3dfea);
  box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 22px 50px -26px rgba(40,40,80,.45),0 2px 6px rgba(40,40,80,.08)}}
.rec-orbit{{display:block;width:96px;height:96px;margin:0 auto 12px}}
.rec-orbit .ring{{fill:none;stroke:#6f6884;stroke-width:.7}}
.rec-orbit .turn{{transform-origin:60px 60px;animation:orbit 80s linear infinite}}
.rec-orbit .ph{{fill:#f3f0f5;stroke:#6f6884;stroke-width:.5}}
.rec-orbit .dark{{fill:#3a3746}}
@keyframes orbit{{to{{transform:rotate(360deg)}}}}
.rec .cut{{position:absolute;z-index:2;pointer-events:none;border-radius:1px;box-shadow:0 12px 26px rgba(25,25,50,.28),0 2px 6px rgba(25,25,50,.12)}}
.rec .cut-a{{width:104px;left:-58px;top:-54px;transform:rotate(-6deg)}}
.rec .cut-b{{width:160px;right:-104px;bottom:-56px;transform:rotate(4deg)}}
.rec h2{{font:500 34px/1.1 var(--serif);margin:0 0 8px;color:#24222c}}
.rec p{{margin:0 0 24px;color:#5f5a6b;font-size:15px}}
.rec form{{display:grid;gap:10px;text-align:left}}
.rec .row{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}
.rec input,.rec textarea{{font:400 15px/1.5 var(--sans);color:var(--ink);background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  border:1px solid rgba(95,90,130,.16);border-radius:8px;padding:10px 12px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s,background-color .2s}}
.rec textarea{{min-height:84px;resize:vertical}}
.rec input:focus,.rec textarea:focus{{background:rgba(255,255,255,.85);border-color:#aab2c3;box-shadow:0 0 0 3px rgba(188,194,207,.4)}}
.rec ::placeholder{{color:#9a94a6}}
.rec button{{justify-self:center;margin-top:8px;display:inline-block;padding:8px 16px;border:1px solid var(--rose);border-radius:999px;background:none;color:var(--rose);font:400 14px/1.5 var(--sans);white-space:nowrap;cursor:pointer;transition:background-color .2s,color .2s}}
.rec button:hover{{background:var(--rose);color:#fff}}
.rec button:focus-visible{{outline:2px solid var(--rose);outline-offset:3px}}
@media (prefers-reduced-motion:reduce){{.rec-orbit .turn{{animation:none}}}}
@media (prefers-reduced-motion:reduce){{.book a,.book .nolink,.tip{{transition:none}}}}
@media (max-width:860px){{
  :root{{--bh:120px;--gap:34px;--plank:10px}}
  .wrap{{padding:0 20px 72px}}
  .nav{{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:22px;margin:4px -20px 0;padding:14px 20px 12px;white-space:nowrap}}
  .nav::-webkit-scrollbar{{display:none}}
  .nav .nav-name{{display:none}}
  .nav a::after{{bottom:-3px}}
  h1{{margin-top:40px}}
  .case{{padding:16px 0 0}}
  .shelf{{gap:var(--gap) 10px}}
  .faux{{padding:8px 7px}}
  .faux-title{{font-size:12px}}
  .faux-author{{font-size:8px}}
  .rec{{margin:84px 4px 70px;padding:34px 20px 34px}}
  .rec .row{{grid-template-columns:1fr}}
  .rec h2{{font-size:30px}}
  .rec .cut-a{{width:66px;left:-18px;top:-50px}}
  .rec .cut-b{{width:112px;right:-16px;bottom:-50px}}
}}
</style>
</head>
<body>
<div class="wrap">
<nav class="nav" aria-label="site">
  <a href="/">home</a>
  <a href="/#writing">writing</a>
  <a href="/#projects">projects</a>
  <a href="/bookshelf/" aria-current="page">bookshelf</a>
  <a href="https://www.therabbitholes.xyz/" target="_blank" rel="noopener">curations</a>
  <a class="nav-name" href="/">patricia mou</a>
</nav>
<script>(function () {{ var n = document.querySelector(".nav"); function f() {{ n.classList.toggle("stuck", window.scrollY > 4); }} f(); window.addEventListener("scroll", f, {{ passive: true }}); }})();</script>
<h1>books that moved me</h1>
<div class="case">
<ul class="shelf">
{chr(10).join(items)}
</ul>
<div class="planks" aria-hidden="true"></div>
</div>
<section class="rec" aria-labelledby="rec-h">
  
  <img class="cut cut-a" src="/assets/collage/moon-phases.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" data-no-zoom/><img class="cut cut-b" src="/assets/collage/flow-swirl.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" data-no-zoom/>
  <svg class="rec-orbit" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring" cx="60" cy="60" r="44"/><g class="turn"><g transform="translate(60.0 16.0) rotate(0)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(91.1 28.9) rotate(45)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(104.0 60.0) rotate(90)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(91.1 91.1) rotate(135)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(60.0 104.0) rotate(180)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(28.9 91.1) rotate(225)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(16.0 60.0) rotate(270)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g><g transform="translate(28.9 28.9) rotate(315)"><circle class="ph" r="6"/><path class="dark" d="M0,-6 A6,6 0 0,1 0,6 Z"/></g></g><circle cx="60" cy="60" r="13" class="ph"/><path class="dark" d="M47,60 A13,13 0 0,0 73,60 Z"/></svg>
  <h2 id="rec-h">recommend me a book</h2>
  <p>a book that cracked you open? i'd love to read it.</p>
  <form id="rec-form">
    <div class="row">
      <input name="title" placeholder="title" aria-label="book title" required/>
      <input name="author" placeholder="author" aria-label="author"/>
    </div>
    <textarea name="why" placeholder="why it moved you (optional)" aria-label="why it moved you"></textarea>
    <input name="from" placeholder="your name (optional)" aria-label="your name"/>
    <button type="submit">send 💌</button>
  </form>
</section>
</div>
{SCRIPT}
</body>
</html>
'''
open(os.path.join(ROOT, 'public', 'bookshelf', 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote public/bookshelf/index.html', len(page), 'bytes')
