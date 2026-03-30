# Astrolabium

Astrolabium is a web-based prototype for exploring the Solar System across time, viewpoints, and astronomical coordinate systems.

The current implementation is a first vertical slice:

- React + TypeScript + Vite frontend
- Three.js rendering via React Three Fiber
- Astronomy Engine for real heliocentric body positions
- Minimal Sun/Earth/Moon scene with time controls, camera presets, and a canonical ecliptic reference frame

## Current Scope

This repository currently contains:

- the initial product/software specification in `docs/software-specification.md`
- a basic interactive 3D prototype in `src/`
- reversible time controls for a simple Sun/Earth/Moon scene
- free-camera and top-view presets
- a master toggle for the ecliptic reference frame
- a canonical heliocentric frame where the renderer `X-Y` plane is the ecliptic plane
- a display-only Moon distance exaggeration control so the Moon remains visible next to the exaggerated Earth
- a simple body selector with heliocentric ecliptic readout for l, b, and Δ in AU

This is intentionally an early prototype. Visual scale, UI structure, overlays, and educational workflows will evolve from here.

## Tech Stack

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- Zustand
- Astronomy Engine

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

The project has been tested in this workspace with:

- Node.js 25.4.0
- npm 11.8.0

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open the local URL printed by Vite in your browser.

### Create a production build

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

## Project Structure

```text
src/                    Application source code
  App.tsx               Main prototype UI, scene, and overlays
  main.tsx              React entry point
  styles.css            Basic application styling

docs/
  software-specification.md
```

## Notes

- The Sun is currently fixed at the scene origin.
- Earth and Moon positions are derived from Astronomy Engine heliocentric vectors converted from EQJ to Ecliptic J2000.
- The body-data panel reports physical ecliptic longitude l, latitude b, and distance Δ in AU for Sun, Earth, and Moon.
- The renderer `X-Y` plane is the Ecliptic J2000 plane.
- `+X` points toward the J2000 vernal equinox.
- `+Z` points toward the north ecliptic pole.
- `+Y` is 90° counterclockwise from `+X` when viewed from ecliptic north.
- The sampled Earth orbit and Moon track are also converted into Ecliptic J2000 before rendering.
- The displayed Moon uses a visualization-only Earth-Moon distance exaggeration; the underlying ephemeris is unchanged.
- Planet sizes and some displayed distances are visually exaggerated for usability.
- The current build is a prototype baseline, not yet optimized for bundle size.

## Next Likely Steps

- add lightweight body selection and highlighting
- add more coordinate-system guides and overlays
- start separating simulation logic from rendering components
- introduce the first Astronomy Mode vs. Navigation Mode UI distinctions
