# 3D Portfolio

An elite personal portfolio built with React, Vite, and Three.js for Md Sarfaraz Alam. It combines a cinematic 3D hero scene with a premium glassmorphism UI to present experience, achievements, skills, education, and certifications in a high-impact format.

## Features

- Immersive 3D hero section powered by Three.js via React Three Fiber
- Premium UI with layered glass cards, gradients, and responsive layout
- Resume content organized into highlights, experience timeline, achievements, and certifications
- Fast local development with Vite
- Production build output ready in `dist/`

## Tech Stack

- React
- TypeScript
- Vite
- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## Prerequisites

Install these first:

- Node.js 20+
- npm 10+

This project was built and verified with Node `v22.17.1` and npm `11.12.1`.

## Getting Started

### 1. Install dependencies

```bash
npm install --cache .npm-cache
```

Using the local `.npm-cache` folder is recommended in this repo because it avoids permission issues with the default global npm cache on some Windows setups.

### 2. Start the development server

```bash
npm run dev
```

Vite will print a local URL in the terminal, usually:

```bash
http://localhost:5173
```

Open that URL in your browser to view the portfolio.

## Production Build

Create an optimized production build:

```bash
npm run build
```

The compiled site will be generated in:

```bash
dist/
```

## Preview the Production Build

To serve the built app locally:

```bash
npm run preview
```

This starts a local preview server for the contents of `dist/`.

## Host on GitHub Pages

This project can be hosted on GitHub Pages because `vite.config.ts` already uses a relative base path:

```ts
base: "./"
```

That allows the built files to work correctly on GitHub Pages without hardcoding the repository name into the Vite config.

### Option 1. Deploy with GitHub Actions

1. Push this project to a GitHub repository.
2. In the repository, open `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Create `.github/workflows/deploy-pages.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Commit and push the workflow file.
6. Once the workflow succeeds, GitHub Pages will publish the contents of `dist/`.

### Option 2. Deploy the `dist` folder manually

1. Build the project locally:

```bash
npm install --cache .npm-cache
npm run build
```

2. Publish the contents of `dist/` using your preferred `gh-pages` flow or static publishing branch.
3. Make sure you publish the built output from `dist/`, not the source files from the root of the repo.

### GitHub Pages URL

Your site will usually be available at:

```text
https://<github-username>.github.io/<repository-name>/
```

If the repository itself is named `<github-username>.github.io`, then the URL becomes:

```text
https://<github-username>.github.io/
```

### Notes for this project

- Keep `vite.config.ts` using `base: "./"` unless you intentionally want a different deployment strategy.
- GitHub Pages serves static files only, which is perfect for this portfolio.
- After deployment, GitHub Pages can take a minute or two to refresh.

## Project Structure

```text
.
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tsconfig.app.json
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ styles.css
│  └─ components/
│     └─ hero-scene.tsx
└─ dist/
```

## Where to Edit

### Update portfolio content

Edit:

- `src/App.tsx`

This file contains the displayed content such as:

- name and intro copy
- contact info
- highlights
- work experience
- achievements
- education
- certifications

### Update 3D visuals

Edit:

- `src/App.tsx`
- `src/components/hero-scene.tsx`

These files contain the Three.js scene setup, animated objects, labels, lighting, and motion behavior.

### Update styling

Edit:

- `src/styles.css`

This file controls:

- color system
- spacing
- typography
- glass panels
- buttons
- responsive layout

## Available Scripts

### `npm run dev`

Runs the Vite development server.

### `npm run build`

Runs TypeScript checks and builds the production bundle.

### `npm run preview`

Serves the production build locally for testing.

## Notes

- The production build has already been verified successfully.
- Vite may show a chunk-size warning because Three.js and related helpers are relatively heavy. The app still builds correctly.
- If you want further optimization, the 3D scene can be split into a lazy-loaded chunk in a later pass.

## Customization Ideas

- Add LinkedIn and GitHub profile links
- Add a downloadable PDF resume button
- Add section transitions and scroll-triggered animations
- Add project case studies
- Add a contact form
- Add mobile-specific motion tuning

## Run Summary

If you just want the shortest path:

```bash
npm install --cache .npm-cache
npm run dev
```

Then open the local Vite URL shown in the terminal.
