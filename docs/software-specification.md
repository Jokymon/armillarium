# Astrolabium Software Specification

## 1. Purpose

Astrolabium is a web-based interactive astronomy application for exploring the Solar System across time and across reference frames. Its primary goal is educational: help users understand how celestial motion changes depending on coordinate system, observer location, and projection method.

The application must allow a user to:

- Move time freely forward and backward.
- Observe physically plausible motion of the Sun, planets, and Moon.
- Switch between viewpoints such as heliocentric external view, top-down ecliptic view, and Earth-surface view.
- Enable overlays for astronomical reference structures such as the ecliptic, equatorial plane, orbital planes, meridians, celestial sphere, horizon, and related guides.
- Draw projection lines from celestial bodies onto the Earth or celestial reference surfaces.

This document defines the first implementation target and the technology direction. It is intentionally detailed enough to drive architecture and backlog creation, but it does not prescribe exact UI layout or code structure yet.

## 2. Product Goals

### 2.1 Primary goals

- Make coordinate systems understandable through direct manipulation.
- Show relative motion of Solar System bodies over arbitrary timescales.
- Let users compare multiple reference frames without losing orientation.
- Provide scientifically defensible visualizations suitable for education.

### 2.2 Non-goals for the first release

- Professional observatory-grade astrometry.
- Space mission planning or spacecraft navigation.
- Full star-catalog simulation at planetarium scale.
- Photorealistic rendering as a primary objective.
- Native mobile apps.

## 3. Target Users

- Students learning astronomy fundamentals.
- Teachers demonstrating heliocentric, geocentric, equatorial, and ecliptic concepts.
- Amateur astronomers who want intuition for coordinate transforms.
- People learning celestial and astro-navigation concepts.
- Curious general users exploring planetary motion visually.

## 4. Core User Scenarios

### 4.1 Time exploration

- A user scrubs time continuously and sees planets move smoothly.
- A user jumps by hour, day, month, or year increments.
- A user plays animation forward or backward at adjustable rates.

### 4.2 Reference-frame learning

- A user switches between heliocentric and geocentric views.
- A user compares top-down ecliptic view and Earth-surface sky view.
- A user toggles coordinate axes and planes to understand how positions are expressed.

### 4.3 Earth-based observation

- A user selects an observer location on Earth.
- A user selects an observer location on Earth using a rough visual representation of continents and major land masses.
- A user sees the sky from that location at a chosen time.
- A user overlays local horizon, meridian, equator, ecliptic, and cardinal directions.

### 4.4 Projection understanding

- A user projects the subsolar point or subplanet point onto Earth.
- A user traces a line from Earth to a planet or the Sun.
- A user sees how apparent sky position relates to 3D geometry.

### 4.5 Astro-navigation learning

- A user learns how the visible sky relates to terrestrial position and time.
- A user inspects navigational quantities such as declination, hour angle, and altitude for selected bodies.
- A user visualizes meridian passage, local hour angle, and the relationship between celestial and terrestrial coordinate systems.
- A user uses overlays and guides to understand how celestial navigation observations map onto the Earth.

### 4.6 Mode-based workflows

- A user switches between Astronomy Mode and Navigation Mode without losing the current simulation time.
- A user switches modes without losing the selected observer location or selected celestial body where applicable.
- A user sees different default overlays, labels, and inspectors depending on the active mode, while the underlying simulation remains the same.

## 5. Functional Requirements

### 5.1 Time system

- FR-1: The system shall support continuous time navigation forward and backward.
- FR-2: The system shall support paused, stepwise, and animated time control.
- FR-3: The system shall support multiple time rates, from slow instructional stepping to accelerated multi-year playback.
- FR-4: The system shall expose the current simulation time in UTC and Julian date.
- FR-5: The system should later support other time standards where scientifically useful, such as TT/TDB, but UTC is sufficient for the first release UI.

### 5.2 Celestial bodies

- FR-6: The system shall include at minimum the Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto.
- FR-7: The system shall show body positions over time using real astronomical models or validated ephemerides.
- FR-8: The system shall support both heliocentric and geocentric position derivations.
- FR-9: The system should allow later extension to major moons, dwarf planets, and bright stars.

### 5.3 Views and cameras

- FR-10: The system shall support an external free camera around the Solar System.
- FR-11: The system shall support a top-down ecliptic-plane view.
- FR-12: The system shall support Earth-centered orbital space view.
- FR-13: The system shall support Earth-surface observer view using latitude, longitude, elevation, and time, with rough Earth surface context for orientation.
- FR-14: The system shall provide a simplified Earth globe or map view with visible major land masses to help users choose and recognize observer locations.
- FR-15: The system should support saved viewpoints and quick-reset camera presets.

### 5.4 Coordinate systems and overlays

- FR-16: The system shall provide visible coordinate axes for the active frame.
- FR-17: The system shall support overlays for:
- Ecliptic plane
- Earth equatorial plane
- Individual planetary orbital planes
- Celestial equator
- Local horizon plane
- Local meridian
- Zenith and nadir
- Cardinal directions
- Prime meridian and geographic reference grid
- Celestial meridians and hour circles
- Celestial poles
- FR-18: The system shall allow enabling multiple overlays simultaneously and independently of the currently selected body-data readout frame.
- FR-19: The system shall provide an explicit body-data readout frame selector and display coordinates for selected bodies in that chosen frame, including at least:
- Heliocentric Cartesian
- Geocentric Cartesian
- Right ascension / declination
- Altitude / azimuth for Earth observer mode
- Ecliptic longitude / latitude

### 5.5 Projection and tracing features

- FR-20: The system shall support drawing vector lines between bodies.
- FR-21: The system shall support projecting the direction of the Sun, Moon, and planets onto the Earth.
- FR-22: The system should support subsolar and sublunar point display in the first release.
- FR-23: The system should be designed so star projection can be added later without reworking the architecture.

### 5.6 UI and education support

- FR-24: The system shall support at least two explicit user-facing modes: Astronomy Mode and Navigation Mode.
- FR-25: The system shall preserve the current simulation time when switching between modes.
- FR-26: The system should preserve observer location, selected body, and other shared context when switching between modes where scientifically meaningful.
- FR-27: The system shall provide explanatory labels for active coordinate systems and overlays and should visually emphasize the currently active body-data readout frame when its overlay is visible.
- FR-28: The system should include contextual descriptions for major modes such as heliocentric, geocentric, equatorial, and horizontal.
- FR-29: The system should allow users to select a body and inspect its coordinates in the selected body-data readout frame, and it should indicate when that frame is currently hidden in the scene.

### 5.7 Astro-navigation features

- FR-30: The system shall support a Navigation Mode centered on Earth-surface observation.
- FR-31: The system shall display navigational readouts for selected bodies using the explicit terms GHA, LHA, and SHA, together with declination and observed altitude where applicable.
- FR-32: The system shall provide overlays for the celestial sphere, celestial poles, local zenith, local meridian, and hour circles in Navigation Mode.
- FR-33: The system should support showing the navigational triangle conceptually through highlighted relationships between zenith, celestial pole, and selected body.
- FR-34: The system should support demonstration of meridian transit and explain its significance for navigation.
- FR-35: The system should be structured so sextant-style angle measurement tools can be added later without major architectural changes.

## 6. Scientific and Accuracy Requirements

- SR-1: The system shall use a deterministic astronomy computation layer that is clearly separated from the rendering layer.
- SR-2: The system shall document the origin and expected accuracy of the astronomical data/model used.
- SR-3: The first release shall prioritize educational accuracy over observatory-grade precision.
- SR-4: Apparent topocentric coordinates in Earth-surface mode shall be computed from observer position and time, not approximated visually.
- SR-5: The system shall explicitly label reference frame, epoch, and time standard wherever relevant.
- SR-6: The system should define acceptable numeric error tolerances for each view mode before implementation begins.
- SR-7: Astro-navigation-oriented values such as declination, hour angle, and altitude shall be derived from the same canonical astronomy model used for the visual scene.
- SR-8: The definitions and calculations of GHA, LHA, and SHA shall be consistent with standard celestial-navigation convention and clearly associated with the selected body and time.
- SR-9: Mode switching shall not alter the underlying astronomical state; it shall only change presentation, defaults, and mode-specific tools.
- SR-10: Display-only exaggeration controls shall alter visualization only; they shall not modify the canonical astronomical positions used by calculations, transforms, or future readouts.

Recommended release-1 tolerance target:

- Planet and Moon positions: educationally accurate, approximately arcminute-class or better where feasible.
- Visualization scale: not physically literal across all zoom levels; scaling rules must be disclosed in the UI.
- Planet sizes and orbital distances may use separate visual exaggeration controls.

## 7. Non-Functional Requirements

### 7.1 Performance

- NFR-1: The application shall run in a modern desktop browser without plugins.
- NFR-2: Core interactions should remain smooth on current mainstream hardware.
- NFR-3: Time scrubbing should feel immediate, with rendering decoupled from heavy calculations where necessary.
- NFR-4: The architecture should support progressive quality degradation on weaker devices.

### 7.2 Usability

- NFR-5: A new user should be able to switch view mode and time control within the first minute.
- NFR-6: Overlays must be visually distinct and independently toggleable.
- NFR-7: Scientific labels should prefer clarity over jargon, while keeping correct terminology.
- NFR-8: Astro-navigation terminology shall be presented accurately and shall use the standard labels GHA, LHA, and SHA rather than simplified substitutes.
- NFR-9: Mode changes should be immediate and should not require users to rebuild their current context from scratch.

### 7.3 Maintainability

- NFR-10: Astronomy computation, coordinate transforms, rendering, and UI state management shall be modularized as separate subsystems.
- NFR-11: The system shall be testable with numeric validation tests independent of the renderer.
- NFR-12: The codebase should support incremental addition of new overlays and new coordinate systems.

## 8. Conceptual Architecture

The application should be split into four layers:

### 8.1 Astronomy engine layer

Responsibilities:

- Time conversions.
- Planet and Moon positions.
- Coordinate transforms between heliocentric, geocentric, equatorial, ecliptic, and horizontal systems.
- Observer-based calculations for Earth-surface mode.
- Navigation-oriented observer calculations such as hour angle and topocentric altitude/azimuth.

### 8.2 Domain model layer

Responsibilities:

- Canonical scene state.
- Selected time, observer, selected body-data readout frame, independently controlled active overlays, scaling options.
- Active product mode and mode-specific defaults.
- Body descriptors and derived vectors.
- A simplified Earth surface layer for continents and major land masses, sufficient for user orientation and location picking.

### 8.3 Rendering layer

Responsibilities:

- 3D scene graph.
- Simplified Earth globe or map surface for rough geographic orientation and observer selection.
- Camera presets and transitions.
- Overlay geometry, including simultaneous overlays with optional emphasis for the currently active body-data readout frame.
- Display-only exaggeration of selected relative vectors for visibility without changing the canonical simulation state.
- Projection lines.
- Labels and picking.

### 8.4 UI layer

Responsibilities:

- Timeline and playback controls.
- Mode switching.
- Location picking aided by visible continents or land-mass outlines.
- Overlay toggles that are independent from body-data readout frame selection.
- Coordinate inspector with an explicit body-data readout frame selector and a hidden-frame indication when needed.
- Educational annotation panels.
- Navigation-oriented explanatory readouts and mode-specific learning panels.
- Mode-aware overlay presets, inspectors, and panel composition.

## 9. Proposed Technology Stack

## 9.1 Recommended stack

### Frontend framework

- React + TypeScript

Rationale:

- Strong ecosystem for UI-heavy scientific tools.
- Clear state modeling for mode switches, inspectors, overlays, and educational panels.
- TypeScript is valuable for vector math, units, and frame identifiers.

### Build tool

- Vite

Rationale:

- Fast local iteration and straightforward static-web deployment.
- Good fit for a single-page application with modern TypeScript tooling.

### 3D rendering

- Three.js as the core 3D engine
- React Three Fiber as the React integration layer

Rationale:

- Three.js is mature and well suited to custom scientific visualization in the browser.
- React Three Fiber reduces integration friction between scene state and application UI.
- This problem needs custom geometry, labels, planes, vectors, and camera logic more than geospatial map primitives.

### Astronomy calculations

- Astronomy Engine as the initial browser-side astronomy library

Rationale:

- It already supports Sun, Moon, planets, observer-based coordinates, and multiple coordinate transforms in JavaScript.
- It is compact enough for browser use and explicitly targets astronomy calculations in web environments.
- Its accuracy profile is appropriate for an educational first release.

### State management

- Zustand or another lightweight client-state store

Rationale:

- Global simulation state is central and shared across renderer and UI.
- A lightweight store is simpler than a heavy enterprise state framework for this product.

### Testing

- Vitest for unit tests
- Playwright later for end-to-end interaction tests

Rationale:

- Numeric astronomy and transform logic need unit validation.
- Camera/view/overlay workflows later need browser automation tests.

## 9.2 Why this stack is the best fit

This application is primarily a custom scientific 3D visualization product, not a general GIS globe product and not a high-end game engine deployment. The recommended stack is strong because it balances:

- Browser compatibility
- Custom rendering flexibility
- UI complexity management
- Educational interactivity
- Moderate scientific accuracy
- Incremental implementation speed

The major architectural benefit is that the astronomy engine can be swapped or upgraded later without replacing the renderer or UI.

## 10. Technology Alternatives

### 10.1 CesiumJS

Strengths:

- Excellent 3D globe and geospatial capabilities.
- Strong time-dynamic visualization support.
- Very good when Earth surface, terrain, WGS84 precision, and geospatial workflows dominate.

Weaknesses for this project:

- The product focus is broader than Earth geospatial visualization.
- Solar System custom scenes, educational coordinate overlays, and non-Earth-centric views are likely more natural in a custom Three.js scene.
- It risks pushing the architecture toward globe/GIS concerns too early.

Conclusion:

- Use CesiumJS only if the Earth-observer and globe-projection side becomes the dominant product, or if terrain, map imagery, and geospatial datasets become central requirements.

### 10.2 Raw WebGL / WebGPU

Strengths:

- Maximum control and performance.

Weaknesses:

- Much higher implementation cost.
- Unnecessary complexity for a first product version.
- Slows down iteration on educational features.

Conclusion:

- Not recommended for v1. Consider only after proven renderer bottlenecks.

### 10.3 Game engines or WASM-heavy architecture

Examples:

- Unity WebGL
- Bevy/WASM
- custom Rust/WASM math engine

Strengths:

- Potentially strong rendering capabilities.

Weaknesses:

- Heavier deployment footprint.
- More friction for ordinary web UI, accessibility, and integration.
- Slower initial delivery for a browser-first educational product.

Conclusion:

- Not recommended for the first implementation.

### 10.4 NASA SPICE as the primary runtime engine

Strengths:

- Authoritative mission-grade data ecosystem.

Weaknesses:

- Operationally heavy for a browser-first educational app.
- Not optimized for compact client-side usage.
- Better suited as a validation/reference source or future server-side precision mode.

Conclusion:

- Use SPICE or JPL Horizons as validation/reference infrastructure, not as the first browser runtime engine.

## 11. Ephemeris and Data Strategy

### 11.1 Release-1 strategy

- Use browser-side astronomy calculations for the core interactive experience.
- Keep all calculations local once the app is loaded.
- Avoid server dependence for the base experience.

### 11.2 Validation strategy

- Cross-check selected positions and transforms against authoritative sources during development.
- Maintain test vectors for important dates and observer locations.
- Document which body positions are model-based and which are validated against external ephemerides.

### 11.3 Future precision strategy

- Optional server-backed high-precision mode can later be added using JPL Horizons or SPICE-derived data products.
- This should remain optional and not block the core browser experience.

## 12. Visual and Interaction Design Principles

- The UI should make frame changes explicit. Users must always know what they are looking at, and body-data readout frame selection must remain distinct from overlay visibility.
- Scale distortion must be transparent. If radii or distances are exaggerated, the user should be told.
- Close-range systems such as Earth-Moon may use display-only relative-distance exaggeration when needed for visibility, but the UI should make that exaggeration explicit.
- Earth land masses should be recognizable but do not need high-resolution political or coastline accuracy in v1.
- Overlays should use a consistent visual language, and the active body-data readout frame may be emphasized without muting other visible overlays:
- Planes: translucent surfaces
- Axes: thin colored lines
- Meridians and great circles: dashed arcs
- Projections: highlighted rays and surface markers
- Labels should favor scientific clarity over decorative design.
- The interface should support both exploratory play and guided learning.

## 13. Suggested Incremental Roadmap

### Milestone 1: Core simulation shell

- Project setup
- Time controls
- Mode switch between Astronomy Mode and Navigation Mode
- Sun, planets, Moon
- External free camera
- Heliocentric and geocentric views

### Milestone 2: Coordinate overlays

- Ecliptic plane
- Earth equatorial plane
- Orbital planes
- Coordinate axes
- Basic numeric inspector

### Milestone 3: Earth observer mode

- Observer location input
- Horizontal coordinates
- Horizon, zenith, meridian overlays
- Apparent sky rendering for Sun, Moon, planets
- Astro-navigation readouts for declination, hour angle, and altitude

### Milestone 4: Projection tools

- Subsolar and sublunar points
- Projection rays to Earth
- Surface markers and explanatory labels

### Milestone 5: Educational layer

- Guided explanations
- Preset demonstrations
- Comparison mode between coordinate systems

## 14. Key Risks

- Scientific confusion caused by hidden scale exaggeration.
- Mixing coordinate frames in the UI without explicit labels.
- Renderer complexity growing faster than the astronomy model.
- Performance issues if all overlays are recomputed every frame.
- Premature precision work displacing user-facing educational value.

## 15. Decisions for Next Specification Pass

These should be resolved before implementation begins:

- Exact list of supported coordinate systems for v1.
- Which overlays are mandatory for v1 versus deferred.
- Numeric tolerance targets per calculation type.
- Whether stars are included in v1 or deferred to v2.
- Whether Earth should be a textured globe in v1 or a simpler analytic sphere.
- Whether mobile support is first-class in v1 or desktop-first.
- Whether SHA is mandatory in every observer workflow in v1, or only when navigation mode is active.
- Exact defaults and preserved state across Astronomy Mode and Navigation Mode.

## 16. Recommended First Implementation Decision

Start with:

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Astronomy Engine
- Zustand
- Vitest

Use authoritative sources such as JPL Horizons and SPICE documentation only for validation and later precision upgrades, not for the initial runtime architecture.

This is the highest-leverage approach for a browser-based educational Solar System explorer because it preserves scientific credibility while keeping iteration speed high.

## 17. Source Notes for Technology Direction

The recommended stack is informed by the following primary sources reviewed during this specification pass:

- Three.js manual: https://threejs.org/manual/en/fundamentals.html
- Vite guide: https://vite.dev/guide/
- CesiumJS platform overview: https://cesium.com/platform/cesiumjs/
- Astronomy Engine repository and documentation overview: https://github.com/cosinekitty/astronomy
- JPL Horizons API documentation: https://ssd.jpl.nasa.gov/api/horizons.api and https://ssd-api.jpl.nasa.gov/doc/horizons.html
- NASA NAIF SPICE Toolkit overview: https://naif.jpl.nasa.gov/naif/toolkit.html





