# Astrolabium

Astrolabium is a web-based prototype for exploring the Solar System across time, viewpoints, and astronomical coordinate systems.

The current implementation is a first vertical slice:

- React + TypeScript + Vite frontend
- Three.js rendering via React Three Fiber
- Astronomy Engine for real heliocentric body positions
- Minimal Sun/Earth scene with time controls, camera presets, and a first ecliptic overlay

## Current Scope

This repository currently contains:

- the initial product/software specification in `docs/software-specification.md`
- a basic interactive 3D prototype in `src/`
- reversible time controls for a simple Sun/Earth scene
- free-camera and top-view presets
- a translucent ecliptic plane and labeled coordinate axes

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
- Earth position is derived from Astronomy Engine heliocentric vectors.
- The ecliptic plane is shown as a simple translucent heliocentric reference plane.
- Planet sizes and distances are visually scaled for usability, not strict realism.
- The current build is a prototype baseline, not yet optimized for bundle size.

## Next Likely Steps

- add additional bodies such as the Moon
- add overlay toggles and more coordinate-system guides
- start separating simulation logic from rendering components
- introduce the first Astronomy Mode vs. Navigation Mode UI distinctions