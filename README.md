# 3D Portfolio

Interactive portfolio for **Md Sarfaraz Alam**.

## Stack

- React
- TypeScript
- Vite
- Three.js
- GSAP
- Lenis
- `react-github-calendar`

## Current Experience

- motion-first hero
- smooth scrolling
- 3D hero scene
- floating profile image
- custom cursor
- reactive background particles
- live GitHub push + commit card
- futuristic Spotify widget
- GitHub graph at bottom

## Live Sources

### GitHub

- username hardcoded in `src/App.tsx`
- graph uses `react-github-calendar`
- latest push + commit use public GitHub REST API

### Spotify

- uses image widget API, not JSON
- current source:

```text
https://spotify-recently-played-readme.vercel.app/api?user=oj1xerhb9fby7dckdhp0yw3no&unique=true
```

- profile link also set in `src/App.tsx`

## Run

Install:

```bash
npm install --cache .npm-cache
```

Dev:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Main Files

- `src/App.tsx`
  content, live widgets, GSAP, Lenis, cursor, particles

- `src/styles.css`
  layout, typography, live cards, cursor, particles, glassmorphism

- `src/components/hero-scene.tsx`
  3D hero visual

## Project Structure

```text
.
├─ DESIGN.md
├─ DESIGN1.md
├─ IMG_5287.PNG
├─ SRE-Sarfaraz.pdf
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ styles.css
│  └─ components/
│     └─ hero-scene.tsx
├─ package.json
└─ vite.config.ts
```

## Notes

- no env vars needed right now
- `IMG_5287.PNG` still heavy
- Three.js chunk still large
- Vite shows warning for resume PDF runtime resolution

## Quick Start

```bash
npm install --cache .npm-cache
npm run dev
```
