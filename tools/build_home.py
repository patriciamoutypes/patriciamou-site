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
           '<div class="shelf-index">', f'<h2 id="h-{sid}">{e(title)}</h2>', f'<p class="shelf-note">{note}</p>',
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
    more = (f'<p class="more"><a class="ext" href="{e(th["more"]["url"])}" target="_blank" rel="noopener">{e(th["more"]["label"])}</a></p>'
            if th.get('more') else '')
    body = (f'<div class="panel-head"><h3>{e(th["name"])}</h3><span class="meta">{len(posts)} essays</span></div>'
            f'<ul class="posts">{"".join(lis)}</ul>{more}')
    panels.append((th['id'], body))
writing = shelf('writing', 'writing', 'from <a class="ext" href="https://templeuponahill.substack.com/" target="_blank" rel="noopener">temple upon a hill</a>', items, panels)

# projects
items, panels = [], []
for pr in data['projects']:
    items.append((pr['id'], pr['name'], None))
    links = ''.join(f'<a class="ext" href="{e(u)}" target="_blank" rel="noopener">{e(t)}</a>' for t, u in pr['links'])
    imgs = ''.join(f'<img src="/assets/{e(f)}" alt="{e(a)}" loading="lazy" decoding="async"/>' for f, a in pr['images'])
    body = (f'<div class="panel-head"><h3>{e(pr["name"])}</h3><span class="meta">{e(pr["role"])}</span></div>'
            f'<p class="project-desc">{e(pr["desc"])}</p><p class="project-links">{links}</p>'
            f'<div class="gallery">{imgs}</div>')
    panels.append((pr['id'], body))
projects = shelf('projects', 'projects', 'things I steward', items, panels)

# where i've been: no tabs, every piece shows at once
cards = []
for c in data['press']:
    pic = (f'<img class="card-img" src="/assets/{e(c["image"])}" alt="" loading="lazy" decoding="async"/>' if c.get('image')
           else f'<div class="card-type" aria-hidden="true">{e(c["title"])}</div>')
    cards.append(f'<a class="card" href="{e(c["url"])}" target="_blank" rel="noopener">{pic}'
                 f'<span class="card-source">{e(c["source"])}</span><span class="card-title">{e(c["title"])}</span></a>')
press = ('<section class="shelf" id="elsewhere" aria-labelledby="h-elsewhere"><div class="shelf-index">'
         '<h2 id="h-elsewhere">where I\'ve been</h2><p class="shelf-note">what others have written about the work</p></div>'
         f'<div class="press">{"".join(cards)}</div></section>')

page = tpl.replace('{{WRITING}}', writing).replace('{{PROJECTS}}', projects).replace('{{PRESS}}', press)
assert '{{' not in page
open(os.path.join(ROOT, 'public', 'index.html'), 'w', encoding='utf-8').write(page)
print('wrote public/index.html', len(page), 'bytes')
