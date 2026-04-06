# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio static site for "Jhop" — a Full Stack Developer, Designer, and Video Editor. Hosted on GitHub Pages at `cyberjhop.github.io`. No build process, no framework, no dependencies.

## Development

To preview locally, use any static server:
```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Architecture

**Three core files drive the entire site:**
- `index.html` — single-page app structure; all sections (hero, about, skills, tools, projects, contact) are in one file
- `res/css/main.css` — all styling via CSS custom properties; design tokens at the top (`:root`)
- `res/js/main.js` — all interactivity: carousel, lightbox, skill bar animations, mobile nav, filter grid

**Content assets live in `projects/`:**
- `projects/graphic/` — design work (emails, Meta ads, product showcases)
- `projects/logo/` — logo designs
- `projects/video/horizontal/` and `vertical/` — video portfolio
- `projects/landing-page/` — web development screenshots
- `projects/web_development_sessions/` — dev session recordings

**Large video files** (`projects/video/vertical/4.mp4`, `mavelle.mp4`) are hosted on Google Drive and embedded via iframe — they are gitignored. When adding new large videos, host on Google Drive and embed with the existing iframe pattern in `index.html`.

## Key JS Patterns

- **Lightbox**: handles images, local `.mp4` files, and Google Drive iframes (detected by `drive.google.com` in URL)
- **Project filter**: buttons with `data-filter` attribute toggle `.active` on `.project-card` elements
- **Skill bars**: animated via `IntersectionObserver` on `.skills-section`
- **Carousel**: auto-rotates featured projects; supports keyboard arrows and touch swipe
