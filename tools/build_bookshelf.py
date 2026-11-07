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
.nav{{position:sticky;top:0;z-index:50;display:flex;gap:30px;margin-top:10px;padding:18px 0 16px;font-size:15px;background:rgba(255,255,255,.94);-webkit-backdrop-filter:saturate(1.4) blur(8px);backdrop-filter:saturate(1.4) blur(8px);transition:box-shadow .2s}}
.nav.stuck{{box-shadow:0 1px 0 var(--line, #ece6e6)}}
.nav a{{color:var(--muted)}}
.nav a[aria-current]{{color:#000}}
.nav a:hover{{color:#000}}
h1{{font:500 38px/1.1 var(--serif);margin:56px 0 30px}}
.lede{{margin:0 0 34px;color:var(--muted);font-size:15px}}

/* the bookcase: white wall, a wooden plank under every row of books */
.case{{position:relative;padding:24px 0 0;background:#fff}}
.shelf{{list-style:none;margin:0;padding:0 0 var(--gap);display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--gap) 14px;
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
.tip{{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translate(-50%,4px);width:max-content;max-width:220px;padding:7px 10px;border-radius:5px;
  background:#1f1f1f;color:#fff;font-size:12px;line-height:1.35;text-align:center;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;z-index:2}}
.note{{margin:40px 0 0;font-size:12px;color:var(--faint)}}
.tip b{{display:block;font-weight:500}}
.tip span{{color:#c9c9c9}}
.book a:hover .tip,.book a:focus-visible .tip,.book .nolink:hover .tip,.book .nolink:focus-visible .tip{{opacity:1;transform:translate(-50%,0)}}
@media (prefers-reduced-motion:reduce){{.book a,.book .nolink,.tip{{transition:none}}}}
@media (max-width:860px){{
  :root{{--bh:120px;--gap:34px;--plank:10px}}
  .wrap{{padding:0 20px 72px}}
  .nav{{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:22px;margin:4px -20px 0;padding:14px 20px 12px;white-space:nowrap}}
  .nav::-webkit-scrollbar{{display:none}}
  h1{{margin-top:40px}}
  .case{{padding:16px 0 0}}
  .shelf{{gap:var(--gap) 10px}}
  .faux{{padding:8px 7px}}
  .faux-title{{font-size:12px}}
  .faux-author{{font-size:8px}}
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
</nav>
<script>(function () {{ var n = document.querySelector(".nav"); function f() {{ n.classList.toggle("stuck", window.scrollY > 4); }} f(); window.addEventListener("scroll", f, {{ passive: true }}); }})();</script>
<h1>books that moved me</h1>
<div class="case">
<ul class="shelf">
{chr(10).join(items)}
</ul>
<div class="planks" aria-hidden="true"></div>
</div>
</div>
{SCRIPT}
<script src="/assets/spirals.v2.js" defer></script>
</body>
</html>
'''
open(os.path.join(ROOT, 'public', 'bookshelf', 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote public/bookshelf/index.html', len(page), 'bytes')
