import { Body } from 'astronomy-engine'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { getBodyPositions } from './astronomy/positions'
import { getEclipticReadout } from './astronomy/readouts'
import { SELECTABLE_BODIES, useSimulationStore } from './state/simulation-store'
import { SimulationScene } from './scene/SimulationScene'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date)
}

function formatDegrees(value: number | null) {
  return value === null ? 'n/a' : `${value.toFixed(3)}°`
}

function formatDistanceAu(value: number) {
  return `${value.toFixed(6)} AU`
}

function ControlPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const sliderDays = useSimulationStore((state) => state.sliderDays)
  const playing = useSimulationStore((state) => state.playing)
  const speedDaysPerSecond = useSimulationStore((state) => state.speedDaysPerSecond)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const setSliderDays = useSimulationStore((state) => state.setSliderDays)
  const setPlaying = useSimulationStore((state) => state.setPlaying)
  const setSpeedDaysPerSecond = useSimulationStore((state) => state.setSpeedDaysPerSecond)
  const setCameraPreset = useSimulationStore((state) => state.setCameraPreset)
  const setShowEclipticReference = useSimulationStore((state) => state.setShowEclipticReference)
  const setMoonDistanceExaggeration = useSimulationStore((state) => state.setMoonDistanceExaggeration)
  const setSelectedBody = useSimulationStore((state) => state.setSelectedBody)
  const stepDays = useSimulationStore((state) => state.stepDays)
  const resetNow = useSimulationStore((state) => state.resetNow)

  const { earthPosition, moonPhysicalPosition, moonDisplayPosition } = useMemo(
    () => getBodyPositions(currentDate, moonDistanceExaggeration),
    [currentDate, moonDistanceExaggeration],
  )
  const physicalEarthMoonDistance = useMemo(
    () => earthPosition.distanceTo(moonPhysicalPosition),
    [earthPosition, moonPhysicalPosition],
  )
  const displayEarthMoonDistance = useMemo(
    () => earthPosition.distanceTo(moonDisplayPosition),
    [earthPosition, moonDisplayPosition],
  )
  const selectedBodyReadout = useMemo(() => getEclipticReadout(selectedBody as Body, currentDate), [selectedBody, currentDate])

  return (
    <aside className="control-panel">
      <div>
        <p className="eyebrow">Astrolabium Prototype</p>
        <h1>Sun-Earth-Moon Slice</h1>
        <p className="lede">
          The current MVP slice uses sampled ephemeris positions in Ecliptic J2000 for the Sun, Earth, and Moon while keeping the UI deliberately light.
        </p>
      </div>

      <section>
        <h2>Time</h2>
        <div className="button-row">
          <button onClick={() => stepDays(-5)}>Back 5d</button>
          <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
          <button onClick={() => stepDays(5)}>Forward 5d</button>
          <button onClick={resetNow}>Reset</button>
        </div>
        <label className="range-field">
          <span>Days from now: {sliderDays.toFixed(1)}</span>
          <input
            type="range"
            min={-365}
            max={365}
            step={0.5}
            value={sliderDays}
            onChange={(event) => setSliderDays(Number(event.target.value))}
          />
        </label>
        <label className="range-field">
          <span>Playback speed: {speedDaysPerSecond.toFixed(0)} days/sec</span>
          <input
            type="range"
            min={-120}
            max={120}
            step={5}
            value={speedDaysPerSecond}
            onChange={(event) => setSpeedDaysPerSecond(Number(event.target.value))}
          />
        </label>
        <p className="readout">Current UTC: {formatDate(currentDate)}</p>
      </section>

      <section>
        <h2>View</h2>
        <div className="button-row">
          <button className={cameraPreset === 'free' ? 'active' : ''} onClick={() => setCameraPreset('free')}>
            Free Camera
          </button>
          <button className={cameraPreset === 'top' ? 'active' : ''} onClick={() => setCameraPreset('top')}>
            Top View
          </button>
        </div>
        <label className="range-field">
          <span>Moon distance exaggeration: {moonDistanceExaggeration.toFixed(0)}x</span>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={moonDistanceExaggeration}
            onChange={(event) => setMoonDistanceExaggeration(Number(event.target.value))}
          />
        </label>
        <p className="readout">Earth heliocentric position (scene units)</p>
        <code>
          x {earthPosition.x.toFixed(2)} | y {earthPosition.y.toFixed(2)} | z {earthPosition.z.toFixed(2)}
        </code>
        <p className="readout">Physical Earth-Moon separation: {physicalEarthMoonDistance.toFixed(3)} scene units</p>
        <p className="readout">Displayed Earth-Moon separation: {displayEarthMoonDistance.toFixed(3)} scene units</p>
      </section>

      <section>
        <h2>Body Data</h2>
        <div className="button-row">
          {SELECTABLE_BODIES.map((body) => (
            <button key={body} className={selectedBody === body ? 'active' : ''} onClick={() => setSelectedBody(body)}>
              {body}
            </button>
          ))}
        </div>
        <p className="readout">Selected body: {selectedBody}</p>
        <p className="readout">l: {formatDegrees(selectedBodyReadout.longitudeDeg)}</p>
        <p className="readout">b: {formatDegrees(selectedBodyReadout.latitudeDeg)}</p>
        <p className="readout">Δ: {formatDistanceAu(selectedBodyReadout.distanceAu)}</p>
      </section>

      <section>
        <h2>Ecliptic Reference</h2>
        <label className="toggle-field">
          <input
            type="checkbox"
            checked={showEclipticReference}
            onChange={(event) => setShowEclipticReference(event.target.checked)}
          />
          <span>Show ecliptic reference frame</span>
        </label>
        <ul>
          <li>The renderer X-Y plane is the ecliptic plane.</li>
          <li>X points toward the vernal equinox.</li>
          <li>Y points 90° counterclockwise from X when viewed from ecliptic north.</li>
          <li>Z points toward the north ecliptic pole.</li>
          <li>The toggle controls the plane, axes, and axis labels together.</li>
        </ul>
      </section>

      <section>
        <h2>Notes</h2>
        <ul>
          <li>The Sun is fixed at the origin.</li>
          <li>Earth and Moon positions come from Astronomy Engine heliocentric vectors converted from EQJ to Ecliptic J2000.</li>
          <li>The Body Data panel uses the physical ecliptic coordinates, not the exaggerated Moon display position.</li>
          <li>The Moon uses display-only Earth-Moon distance exaggeration so the underlying ephemeris remains unchanged.</li>
          <li>Earth orbit and Moon track are sampled from the ephemeris and rendered in the same Ecliptic J2000 reference frame.</li>
          <li>Visual sizes and some displayed distances are exaggerated for readability.</li>
        </ul>
      </section>
    </aside>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <ControlPanel />
      <main className="viewport">
        <Canvas camera={{ position: [16, 10, 16], fov: 45, near: 0.1, far: 200 }}>
          <SimulationScene />
        </Canvas>
      </main>
    </div>
  )
}
