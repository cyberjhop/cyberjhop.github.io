# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio for "Jhop" (Jofil Consulta), a Full Stack Developer, Designer and Video Editor, presented as a dashboard-style single-page app. It's hosted on GitHub Pages at `cyberjhop.github.io`. There's no build process, no framework and no dependencies (vanilla HTML/CSS/JS).

## Development

To preview locally, use any static server:
```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Architecture

**Four files drive the entire site:**
- `index.html`: the app shell (sidebar, topbar, overlays) plus one `<section data-view>` per route. Each section holds static headings and intro text for SEO. It also contains the SVG icon sprite (`<use href="#i-name">`), JSON-LD, and an inline pre-paint script for theme and sidebar state.
- `res/js/data.js`: **all portfolio content** as `window.PORTFOLIO`. That covers profile, stats, socials, experience, education, skill groups, tools, services, values, process, projects, media and channels. Edit content here, not in the HTML.
- `res/js/main.js`: renders every view from the data. It handles the hash router, sidebar (mobile drawer and desktop icon rail), theme toggle, charts, project drawer, lightbox, ⌘K command palette and contact form (mailto fallback).
- `res/css/main.css`: design tokens on `:root` (dark default, light theme via `[data-theme]` and `prefers-color-scheme`), shell, components, views and breakpoints (1280 / 1024 / 768).

**Routes** are hash-based: `#overview`, `#about`, `#experience`, `#skills`, `#projects`, `#media`, `#services` and `#contact`. Deep links look like `#projects/<project-id>` and `#media/<category>`. Anchors from the old scrolling site (`#home`, `#tools`, `#reel`, `#youtube`, `#values`, `#process`) are aliased in `ALIASES` in main.js.

**Content assets live in `projects/`:**
- `projects/graphic/`: design work (emails, Meta ads 1:1 / 16:9 / 9:16, product showcases)
- `projects/video/horizontal/` and `vertical/`: video portfolio. `projects/video/posters/` holds a JPEG poster frame for each local mp4.
- `projects/landing-page/` and `projects/web_development_sessions/`: web development screenshots (used as project galleries)

## Adding content

- **Media item:** add an object to `media` in data.js with `category` (`graphic` | `video` | `ai-video` | `reel`), `format`, `type`, `title` and `kind`:
  - `image`: set `src`.
  - `video`: set `src` and `poster`. Generate the poster with `ffmpeg -ss 1 -i in.mp4 -frames:v 1 -vf "scale='min(640,iw)':-2" -q:v 5 projects/video/posters/<name>.jpg`.
  - `drive`: set `driveId`.
  
  Counts, charts, filters and search all update automatically.
- **Project:** add to `projects`. Set `discipline` (`dev` | `design` | `video` | `ai`) and `media`. You can also add a `gallery` of image paths, `related` (a library filter link), `links` or `showChannels`.
- **Large videos** are hosted on Google Drive (they're gitignored locally). Use `kind: "drive"` with the file id. The grid shows a Drive thumbnail, and the `/preview` iframe loads only in the lightbox or drawer.

## Rules

- Charts and KPIs must be derived from the data or be figures the owner stated (`stats`, skill `progress`). Don't invent metrics.
- Chart colors use the `--series-N` tokens, which were validated for colorblind safety in both themes. Assign them in order.
