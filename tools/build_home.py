"""Build public/index.html from tools/home.template.html and tools/home.json.

    python3 tools/build_home.py

Add a new Substack post by appending it to "posts" in home.json with the
theme id it belongs to, then run this again.
"""
import json, os, html
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
data = json.load(open(os.path.join(HERE, 'home.json'), encoding='utf-8'))
tpl = open(os.path.join(HERE, 'home.template.html'), encoding='utf-8').read()
e = lambda s: html.escape(s or '', quote=True)
MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split()

def when(d):
    y, m, _ = d.split('-'); return f'{MONTHS[int(m)-1]} {y}'

def shelf(sid, title, note, items, panels):
    tabs = []
    for i, (iid, label, count) in enumerate(items):
        on = i == 0
        tabs.append(
            f'<button class="tab" role="tab" id="tab-{sid}-{iid}" aria-controls="panel-{sid}-{iid}" '
            f'aria-selected="{"true" if on else "false"}" tabindex="{0 if on else -1}">'
            f'<span>{e(label)}</span><span class="leader"></span>'
            + (f'<span class="count">{count}</span>' if count is not None else '') + '</button>')
    out = [f'<section class="shelf" id="{sid}" data-shelf aria-labelledby="h-{sid}">',
           '<div class="shelf-index">', f'<h2 id="h-{sid}">{e(title)}</h2>', note,
           f'<div class="tabs" role="tablist" aria-label="{e(title)}" aria-orientation="vertical">', *tabs, '</div></div>',
           '<div class="shelf-panels">']
    for i, (iid, body) in enumerate(panels):
        out.append(f'<div class="panel" role="tabpanel" id="panel-{sid}-{iid}" aria-labelledby="tab-{sid}-{iid}" tabindex="0"'
                   + ('' if i == 0 else ' hidden') + f'>{body}</div>')
    out.append('</div></section>')
    return '\n'.join(out)

# writing
items, panels = [], []
for th in data['writing_themes']:
    posts = sorted([p for p in data['posts'] if p['theme'] == th['id']], key=lambda p: p['date'], reverse=True)
    items.append((th['id'], th['name'], len(posts)))
    lis = []
    for p in posts:
        img = (f'<img src="{e(p["thumb"])}" alt="" width="96" height="64" loading="lazy" decoding="async"/>'
               if p.get('thumb') else '<span></span>')
        sub = f'<span class="post-sub">{e(p["subtitle"])}</span>' if p.get('subtitle') else ''
        lis.append(f'<li class="post"><a href="{e(p["url"])}" target="_blank" rel="noopener">{img}'
                   f'<span><span class="post-title">{e(p["title"])}</span>{sub}</span>'
                   f'<span class="post-date">{when(p["date"])}</span></a></li>')
    meta = (f'<a class="meta ext" href="{e(th["more"]["url"])}" target="_blank" rel="noopener">{e(th["more"]["label"])}</a>'
            if th.get('more') else f'<span class="meta">{len(posts)} essays</span>')
    body = (f'<div class="panel-head"><h3>{e(th["name"])}</h3>{meta}</div>'
            f'<ul class="posts">{"".join(lis)}</ul>')
    panels.append((th['id'], body))
pubs = ''.join(f'<p class="pub"><a class="ext" href="{e(pb["url"])}" target="_blank" rel="noopener">{e(pb["name"])}</a>'
               f'<span>{e(pb["desc"])}</span></p>' for pb in data['publications'])
writing = shelf('writing', 'writing', f'<div class="pubs">{pubs}</div>', items, panels)

# projects
def ritual_items(items):
    """A list item is a string, {"q": "..."} for a question in italics,
    or {"text": "...", "items": [...]} for a line with its own sub-list."""
    lis = []
    for it in items:
        if isinstance(it, str):
            lis.append(f'<li>{e(it)}</li>')
        elif 'q' in it:
            lis.append(f'<li class="ask">{e(it["q"])}</li>')
        else:
            lis.append(f'<li>{e(it["text"])}{ritual_items(it.get("items", []))}</li>')
    return f'<ul>{"".join(lis)}</ul>' if lis else ''

def ritual(steps):
    out = []
    for st in steps:
        cls = 'step pause' if st.get('pause') else 'step'
        text = f'<p>{e(st["text"])}</p>' if st.get('text') else ''
        out.append(f'<li class="{cls}"><span class="step-time">{e(st["time"])}</span><div class="step-body">'
                   f'<p class="step-title">{e(st["title"])}</p>{text}{ritual_items(st.get("items", []))}</div></li>')
    return f'<ol class="ritual">{"".join(out)}</ol>'

items, panels = [], []
for pr in data['projects']:
    items.append((pr['id'], pr.get('tab', pr['name']), None))
    desc = pr.get('desc', [])
    desc = desc if isinstance(desc, list) else [desc]
    parts = [f'<div class="panel-head"><h3>{e(pr["name"])}</h3><span class="meta">{e(pr["role"])}</span></div>']
    if pr.get('tagline'):
        parts.append(f'<p class="project-tagline">{e(pr["tagline"])}</p>')
    parts += [f'<p class="project-desc">{e(d)}</p>' for d in desc]
    if pr.get('list'):
        L = pr['list']
        parts.append(f'<p class="project-desc">{e(L["intro"])}</p>' if L.get('intro') else '')
        parts.append('<ul class="project-list">' + ''.join(f'<li>{e(i)}</li>' for i in L['items']) + '</ul>')
    if pr.get('phases'):
        parts.append('<ol class="project-phases">' + ''.join(f'<li><b>{e(l)}</b> {e(t)}</li>' for l, t in pr['phases']) + '</ol>')
    if pr.get('figure'):  # one wide image between the main text and desc_after
        fg = pr['figure']
        parts.append(f'<figure class="project-figure"><img src="/assets/{e(fg[0])}" alt="{e(fg[1])}" loading="lazy" decoding="async"/></figure>')
    parts += [f'<p class="project-desc">{e(d)}</p>' for d in pr.get('desc_after', [])]
    links = ''.join(f'<a class="ext" href="{e(u)}" target="_blank" rel="noopener">{e(t)}</a>' for t, u in pr.get('links', []))
    parts.append(f'<p class="project-links">{links}</p>' if links else '<div class="project-gap"></div>')
    if pr.get('video'):
        v = pr['video']
        parts.append(f'<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/{e(v["id"])}" title="{e(v["title"])}" '
                     'loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
                     'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>')
    if pr.get('images'):
        tiles = []
        for it in pr['images']:
            if isinstance(it, dict):  # a short silent loop; the page script loads it when its panel is shown
                tiles.append(f'<video muted loop playsinline preload="none" poster="/assets/{e(it["poster"])}" '
                             f'data-src="/assets/{e(it["video"])}" aria-label="{e(it["alt"])}"></video>')
            else:
                tiles.append(f'<img src="/assets/{e(it[0])}" alt="{e(it[1])}" loading="lazy" decoding="async"/>')
        imgs = ''.join(tiles)
        cls = 'gallery gallery-masonry' if pr.get('layout') == 'masonry' else 'gallery'
        parts.append(f'<div class="{cls}">{imgs}</div>')
    for b in pr.get('blocks', []):  # hand-written sections in tools/partials/
        parts.append(open(os.path.join(HERE, 'partials', b), encoding='utf-8').read())
    if pr.get('slides'):
        sl = pr['slides']; n = len(sl['images'])
        frames = ''.join(f'<li><img src="/assets/{e(f)}" alt="{e(a)}" width="1280" height="720" loading="lazy" decoding="async"/></li>'
                         for f, a in sl['images'])
        parts.append(f'<div class="slides" data-slides><div class="slides-head"><h4 class="program-head">{e(sl["title"])}</h4>'
                     f'<div class="slides-nav"><button type="button" data-dir="-1" aria-label="previous slide">←</button>'
                     f'<span class="slides-count" aria-live="polite">1 / {n}</span>'
                     f'<button type="button" data-dir="1" aria-label="next slide">→</button></div></div>'
                     f'<ol class="slides-track" tabindex="0" aria-label="{e(sl["title"])}">{frames}</ol></div>')
    if pr.get('program'):
        parts.append(f'<h4 class="program-head">{e(pr["program"]["title"])}</h4>{ritual(pr["program"]["steps"])}')
    panels.append((pr['id'], ''.join(parts)))
projects = shelf('projects', 'projects', '<p class="shelf-note">community design, rituals, zines, and physical place-making</p>', items, panels)

# elsewhere: pieces written about the work, one tab each
items, panels = [], []
for c in data['press']:
    items.append((c['id'], c.get('tab', c['title']), None))
    pic = (f'<img class="press-img" src="/assets/{e(c["image"])}" alt="{e(c["title"])} on {e(c["source"])}" loading="lazy" decoding="async"/>'
           if c.get('image') else f'<div class="press-type" aria-hidden="true"><span>{e(c["title"])}</span><small>{e(c["source"])}</small></div>')
    meta = ' · '.join(x for x in [c.get('source'), c.get('date')] if x)
    body = (f'<div class="panel-head"><h3>{e(c["title"])}</h3><span class="meta">{e(meta)}</span></div>'
            f'{pic}<p class="project-desc">{e(c["desc"])}</p>'
            f'<p class="project-links"><a class="ext" href="{e(c["url"])}" target="_blank" rel="noopener">{e(c.get("cta", "read"))}</a></p>')
    panels.append((c['id'], body))
press = shelf('elsewhere', 'elsewhere', '<p class="shelf-note">on the internet</p>', items, panels)

page = tpl.replace('{{WRITING}}', writing).replace('{{PROJECTS}}', projects).replace('{{PRESS}}', press)
assert '{{' not in page
open(os.path.join(ROOT, 'public', 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote public/index.html', len(page), 'bytes')
