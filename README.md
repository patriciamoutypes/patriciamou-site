# patriciamou.com

Static copy of www.patriciamou.com, moved off Webflow on 2026-11-03.
Every page, image, font file, stylesheet and script lives in this folder.
Google Fonts, the Substack embed and the MixItUp filter library still load
from their own CDNs, which is fine: none of them is Webflow.

## Layout

- `public/` — the live website. This is the only folder a host needs.
  Pages: home, about, bookshelf, subscribe, thank-you, newsletter-archive,
  wellness-wisdom-stack, amor-fati, rabbit-hole (and its old copies),
  old-home, style-guide, type/amor-fati, plus `404.html` for missing URLs.
  `assets/` holds 529 files, about 150 MB.
- `webflow-export/` — the raw zip Webflow produced, for reference only.
  Its CMS-driven pages are empty templates. Don't deploy this folder.
- `public/_headers` — Cloudflare Pages cache rules for the assets.

## Known gaps carried over from the live site

- `/writing` and `/wisdom-shelf-waitlist` were password-protected on Webflow,
  so they were not copied. The export has template versions if you ever want
  them back.
- The newsletter-archive page links to ~70 individual newsletter pages that
  already returned 404 on Webflow. They 404 here too.
- The Substack embed on newsletter-archive and wellness-wisdom-stack is
  blocked by Substack's own frame policy. Same on the live site.
- The old Google Analytics (UA) tag is left in place but its loader was
  removed; UA stopped collecting data in 2023.

## Preview locally

From the `Vibe Coding` folder the `patriciamou-site` entry in
`.claude/launch.json` starts a server on port 8790. Or:

```bash
npx --yes serve@14 public -l 8790
```

## Hosting (Cloudflare Pages, since 2026-11-04)

This repo is connected to Cloudflare Pages (project `patriciamou-site`, account
impatriciamou@gmail.com). Every push to `main` builds and goes live on
patriciamou.com in about a minute. Preview copy: https://patriciamou-site.pages.dev.
Settings: framework None, no build command, output directory `public`.
DNS for patriciamou.com is on Cloudflare too, so custom domains and HTTPS are
handled in Workers & Pages → patriciamou-site → Custom domains.

Deploys are free on Cloudflare (no credit meter), which is why the site
moved off Netlify. Pushes still deserve batching out of habit: one push
per round of changes.
