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
- generated live-data fallback for GitHub rate limits
- GitHub Pages CI/CD pipeline
- optional Docker image build in CI

## Live Sources

### GitHub

- username hardcoded in `src/App.tsx`
- graph uses `react-github-calendar`
- latest push + commit use public GitHub REST API
- fallback snapshot generated into `public/generated/live-data.json`

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

- `scripts/generate-live-data.mjs`
  builds live GitHub snapshot JSON for CI/CD and fallback rendering

- `.github/workflows/ci-cd.yml`
  validate, build, deploy Pages, release artifact, optional Docker push

## Project Structure

```text
.
├─ DESIGN.md
├─ DESIGN1.md
├─ Dockerfile
├─ IMG_5287.PNG
├─ SRE-Sarfaraz.pdf
├─ public/
│  └─ generated/
│     └─ live-data.json
├─ scripts/
│  └─ generate-live-data.mjs
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
- resume link now expects `public/resume.pdf` by default
- or set `VITE_RESUME_URL` for hosted resume PDF
- GitHub REST API can rate-limit in browser, fallback snapshot now covers that
- Docker push runs only if `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets exist

## CI/CD

- triggers:
  - push to `main`
  - pull request to `main`
  - release published
  - daily at `00:00 UTC`
  - manual `workflow_dispatch`

- pipeline:
  - install deps
  - run `npm run test`
  - run `npm run generate:live-data`
  - run `npm run build`
  - deploy `dist` to GitHub Pages
  - attach build tarball on GitHub releases
  - optionally build and push Docker image

## Quick Start

```bash
npm install --cache .npm-cache
npm run dev
```
