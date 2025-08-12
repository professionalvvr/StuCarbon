# StuCarbon — Student Carbon Footprint Calculator

Ready-to-run Vite + React app with TailwindCSS, personalized tips, and AdSense-ready pages.

## Quick Start

```bash
npm install
npm run dev
```

Visit the URL printed in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

- `src/App.jsx` — full app UI (calculator, results with personalized tips, About, Privacy, Terms, Contact, FAQ, Sitemap, cookie banner)
- `src/components/ui/*` — minimal UI primitives (Button, Card, Progress)
- `public/robots.txt`, `public/sitemap.xml`, `public/ads.txt` — AdSense/SEO helpers
- `index.html` — add AdSense script (after approval)

## Configure for Production

1. Replace `YOUR_DOMAIN` in `public/sitemap.xml` and `public/robots.txt`.
2. Replace the publisher id in `public/ads.txt` after AdSense approval.
3. (Optional) Add your AdSense script to `index.html` head:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-REPLACE_ME" crossorigin="anonymous"></script>
   ```

## Deploy to GitHub Pages

- Create a repo and push this project.
- In GitHub, enable **Pages** from the `gh-pages` branch or use your host (Netlify/Vercel).
- For Netlify: just drag-drop the `dist/` or connect the repo (build command: `npm run build`, publish dir: `dist`).

## License

MIT © 2025 StuCarbon
