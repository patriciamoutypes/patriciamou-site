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
- `netlify.toml` — publishes `public/` and sets long cache headers on assets.

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

## Go live

1. https://app.netlify.com/drop — drag the `public` folder in. You get a
   `something.netlify.app` address. Check it.
2. Netlify → Project configuration → General → turn off the
   "Powered by Netlify" badge.
3. Netlify → Domain management → Add a domain → `www.patriciamou.com`
   (Netlify adds `patriciamou.com` too).
4. The domain is registered at Squarespace Domains (formerly Google Domains)
   and currently points at Webflow. In Squarespace → Domains → patriciamou.com
   → DNS, delete the existing records that point to Webflow
   (`A @ 198.202.211.1` and `CNAME www cdn.webflow.com`) and add:
   - `A    @    75.2.60.5`
   - `CNAME www  <your-site>.netlify.app`
5. Wait up to an hour. Netlify issues HTTPS on its own. Then cancel the
   Webflow plan for this site.
