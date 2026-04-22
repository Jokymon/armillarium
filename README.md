# Armillarium

Armillarium is an interactive 3D prototype for exploring celestial mechanics and the reference frames used to describe the motion of celestial bodies.

It is intended as an educational tool: something you can use to inspect positions, switch between frames, and build intuition for how different astronomical viewpoints relate to one another.

You can try the current prototype here: [GitHub Pages deployment](https://jokymon.github.io/armillarium/).

## What you can do right now

- Step time forward and backward manually or let it run automatically at different speeds.
- Move the camera freely through the planetary system.
- Inspect readouts for a selected celestial body.
- Toggle the visualization of different astronomical reference planes.

## Current Scope

This repository currently contains:

- the initial product/software specification in `docs/software-specification.md`
- a basic interactive 3D prototype in `src/`
- reversible time controls with preset step sizes and playback rates for a simple Sun/Earth/Moon scene
- a manual `Set Now / Home` dialog for debugging and validation that can override the simulation reference time in UTC or Julian date and set the observer latitude/longitude numerically
- free-camera and top-view presets, plus optional selected-body camera tracking
- independent overlay toggles for heliocentric ecliptic, geocentric ecliptic, geocentric equatorial J2000, and topocentric horizontal observer frames
- a canonical heliocentric internal frame where the renderer X-Y plane is the ecliptic plane
- a simplified Earth surface layer with a rotating geographic grid, rough continent outlines, and a pickable observer-location marker that appears when the camera is close to Earth
- a display-only Moon distance exaggeration control so the Moon remains visible next to the exaggerated Earth
- a body selector for the Sun, Moon, and planets from Mercury through Neptune with independent heliocentric ecliptic, geocentric ecliptic, geocentric equatorial, or topocentric horizontal body-data readouts in AU

## Status

This is intentionally an early prototype. Visual scale, UI structure, overlays, and educational workflows will evolve from here.

## Disclaimer

This application is meant as an instructional tool to improve understanding of these mechanics. It is **not suitable for navigational purposes**. Do not use the data obtained from this tool to plan your trips or any other safety-relevant purposes.

The calculations are intended to be as close to reality as is practical, but they may not be precise enough for your purposes. Sizes and distances are exaggerated in places to improve usability.

## Roadmap

The following features are planned for future additions, in no particular order.

- Visualize the angles corresponding to the current readout values directly in the rendered view.
- Display angles relevant to celestial navigation in the rendered view, such as GHA, LHA, Az, and `h`.
- Add more ways to lock the camera to a position and follow a celestial body or viewing direction.
- Toggle the display of the GP of a celestial body on the surface of the Earth together with the relevant angles.

## The name

The name of this project, Armillarium, is derived from ancient devices used to better understand celestial
mechanics. Some of those devices were called armillary spheres. Armillarium is a latinized and shortened version of
that name, intended as a small homage to those beautiful and delicate instruments.

## Tech Stack

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- Zustand
- Astronomy Engine

This application is licensed under the GNU General Public License v3.0 or later. See `LICENSE`.

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
- The `Set Now / Home` UTC input uses the browser's native date/time picker. It is interpreted as UTC even if the browser displays the field in a localized date/time format.
- Earth and Moon positions are derived from Astronomy Engine heliocentric vectors converted from EQJ to Ecliptic J2000.
- The body-data panel reports physical ecliptic coordinates in AU.
- Heliocentric ecliptic readouts use `l`, `b`, and `r`.
- Geocentric ecliptic readouts use `λ`, `β`, and `Δ`.
- Geocentric equatorial readouts use `α`, `δ`, and `Δ`.
- Topocentric horizontal readouts use `Az`, `h`, and `ρ`.
- Heliocentric and geocentric ecliptic overlays can be shown independently while the body-data readout frame is selected separately.
- `+X` points toward the J2000 vernal equinox.
- `+Z` points toward the north ecliptic pole.
- `+Y` is 90° counterclockwise from `+X` when viewed from ecliptic north.
- The sampled Earth orbit and Moon track are rendered in the same internal Ecliptic J2000 frame.
- The displayed Moon uses a visualization-only Earth-Moon distance exaggeration; the underlying ephemeris is unchanged.
- Planet sizes and some displayed distances are visually exaggerated for usability.
- Earth surface grid and continent outlines are simplified and become visible only when the camera is sufficiently close to Earth.
- The current build is a prototype baseline, not yet optimized for bundle size.
