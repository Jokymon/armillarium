# Astrolabium

Astrolabium is a web-based prototype for exploring the Solar System across time, viewpoints, and astronomical coordinate systems.

The current implementation is a first vertical slice:

- React + TypeScript + Vite frontend
- Three.js rendering via React Three Fiber
- Astronomy Engine for real heliocentric body positions
- Solar System scene with Sun, Moon, and planets from Mercury through Neptune, plus time controls, camera presets, and reference-frame overlays

## Current Scope

This repository currently contains:

- the initial product/software specification in `docs/software-specification.md`
- a basic interactive 3D prototype in `src/`
- reversible time controls with preset step sizes and playback rates for a simple Sun/Earth/Moon scene
- free-camera and top-view presets, plus optional selected-body camera tracking
- independent overlay toggles for heliocentric ecliptic, geocentric ecliptic, geocentric equatorial J2000, and topocentric horizontal observer frames
- a canonical heliocentric internal frame where the renderer X-Y plane is the ecliptic plane
- a simplified Earth surface layer with a rotating geographic grid, rough continent outlines, and a pickable observer-location marker that appears when the camera is close to Earth
- a display-only Moon distance exaggeration control so the Moon remains visible next to the exaggerated Earth
- a body selector for the Sun, Moon, and planets from Mercury through Neptune with independent heliocentric ecliptic, geocentric ecliptic, or geocentric equatorial body-data readout in AU

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
src/
  App.tsx
  main.tsx
  styles.css
  astronomy/
  scene/
  state/
  ui/

docs/
  software-specification.md
```

## Notes

- The renderer stores the scene in heliocentric Ecliptic J2000.
- Earth and Moon positions are derived from Astronomy Engine heliocentric vectors converted from EQJ to Ecliptic J2000.
- The body-data panel reports physical ecliptic coordinates in AU.
- Heliocentric ecliptic readouts use `l`, `b`, and `r`.
- Geocentric ecliptic readouts use `λ`, `β`, and `Δ`.
- Geocentric equatorial readouts use `α`, `δ`, and `Δ`.
- Heliocentric and geocentric ecliptic overlays can be shown independently while the body-data readout frame is selected separately.
- `+X` points toward the J2000 vernal equinox.
- `+Z` points toward the north ecliptic pole.
- `+Y` is 90° counterclockwise from `+X` when viewed from ecliptic north.
- The sampled Earth orbit and Moon track are rendered in the same internal Ecliptic J2000 frame.
- The displayed Moon uses a visualization-only Earth-Moon distance exaggeration; the underlying ephemeris is unchanged.
- Planet sizes and some displayed distances are visually exaggerated for usability.
- Earth surface grid and continent outlines are simplified and become visible only when the camera is sufficiently close to Earth.
- The current build is a prototype baseline, not yet optimized for bundle size.

## Next Likely Steps

- add equatorial readout frames and overlays
- add more coordinate-system guides, overlays, and readout-frame options
- start Earth-surface observer views
- introduce the first Astronomy Mode vs. Navigation Mode UI distinctions