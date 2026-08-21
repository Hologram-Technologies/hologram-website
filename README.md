![Hologram](docs/cover.png)

# Hologram

**Reimagining compute for fast, energy-efficient and verifiable AI.**

The source of [gethologram.ai](https://gethologram.ai).

## Stack

React 19 · TanStack Router · Tailwind CSS 4 · Vite — built to static files, served from GitHub Pages.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

Output lands in `dist/`. `npm run preview` serves it locally.

## Deploy

Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes to GitHub Pages at the domain in [`public/CNAME`](public/CNAME).

## Layout

```
index.html          document shell and social metadata
src/routes/         one file per page
src/components/     site chrome, thesis, careers
src/styles.css      design tokens
public/             static files copied verbatim
```

---

© 2026 Hologram Technologies Inc.
