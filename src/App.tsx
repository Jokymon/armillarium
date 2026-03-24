import { Body, HelioVector, RotateVector, Rotation_EQJ_ECL } from 'astronomy-engine'
import { Line, OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { create } from 'zustand'

type CameraPreset = 'free' | 'top'

type SimulationState = {
  baseDate: Date
  currentDate: Date
  sliderDays: number
  playing: boolean
  speedDaysPerSecond: number
  cameraPreset: CameraPreset
  showEclipticReference: boolean
  moonDistanceExaggeration: number
  setSliderDays: (days: number) => void
  setPlaying: (playing: boolean) => void
  setSpeedDaysPerSecond: (speed: number) => void
  setCameraPreset: (preset: CameraPreset) => void
  setShowEclipticReference: (show: boolean) => void
  setMoonDistanceExaggeration: (factor: number) => void
  stepDays: (days: number) => void
  tick: (deltaSeconds: number) => void
  resetNow: () => void
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const AU_TO_SCENE = 12
const AXIS_LENGTH = 8
const ECLIPTIC_RADIUS = 15
const EQJ_TO_ECL = Rotation_EQJ_ECL()

const useSimulationStore = create<SimulationState>((set) => {
  const baseDate = new Date()

  return {
    baseDate,
    currentDate: baseDate,
    sliderDays: 0,
    playing: false,
    speedDaysPerSecond: 20,
    cameraPreset: 'free',
    showEclipticReference: true,
    moonDistanceExaggeration: 14,
    setSliderDays: (days) =>
      set((state) => ({
        sliderDays: days,
        currentDate: new Date(state.baseDate.getTime() + days * MS_PER_DAY),
      })),
    setPlaying: (playing) => set({ playing }),
    setSpeedDaysPerSecond: (speedDaysPerSecond) => set({ speedDaysPerSecond }),
    setCameraPreset: (cameraPreset) => set({ cameraPreset }),
    setShowEclipticReference: (showEclipticReference) => set({ showEclipticReference }),
    setMoonDistanceExaggeration: (moonDistanceExaggeration) => set({ moonDistanceExaggeration }),
    stepDays: (days) =>
      set((state) => {
        const sliderDays = state.sliderDays + days
        return {
          sliderDays,
          currentDate: new Date(state.baseDate.getTime() + sliderDays * MS_PER_DAY),
        }
      }),
    tick: (deltaSeconds) =>
      set((state) => {
        if (!state.playing) {
          return state
        }

        const sliderDays = state.sliderDays + deltaSeconds * state.speedDaysPerSecond
        return {
          sliderDays,
          currentDate: new Date(state.baseDate.getTime() + sliderDays * MS_PER_DAY),
        }
      }),
    resetNow: () => {
      const nextBaseDate = new Date()
      set({
        baseDate: nextBaseDate,
        currentDate: nextBaseDate,
        sliderDays: 0,
        playing: false,
      })
    },
  }
})

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

function toSceneVector(body: Body, date: Date) {
  const eqjVector = HelioVector(body, date)
  const eclVector = RotateVector(EQJ_TO_ECL, eqjVector)
  return new THREE.Vector3(eclVector.x, eclVector.y, eclVector.z).multiplyScalar(AU_TO_SCENE)
}

function getBodyPositions(date: Date, moonDistanceExaggeration: number) {
  const earthPosition = toSceneVector(Body.Earth, date)
  const moonPhysicalPosition = toSceneVector(Body.Moon, date)
  const earthToMoon = moonPhysicalPosition.clone().sub(earthPosition)
  const moonDisplayPosition = earthPosition.clone().add(earthToMoon.multiplyScalar(moonDistanceExaggeration))

  return {
    earthPosition,
    moonPhysicalPosition,
    moonDisplayPosition,
  }
}

function CameraController({ preset }: { preset: CameraPreset }) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (preset === 'top') {
      camera.position.set(0, 0, 24)
    } else {
      camera.position.set(16, 10, 16)
    }

    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, preset])

  return <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
}

function AxisLabels() {
  return (
    <group>
      <Text position={[AXIS_LENGTH + 1.1, 0, 0]} fontSize={0.34} color="#ff8d8d">
        X / Vernal Equinox
      </Text>
      <Text position={[0, AXIS_LENGTH + 1.1, 0]} fontSize={0.34} color="#8fe388">
        Y / +90° Ecliptic Longitude
      </Text>
      <Text position={[0, 0, AXIS_LENGTH + 1.1]} fontSize={0.34} color="#8cbcff">
        Z / North Ecliptic Pole
      </Text>
    </group>
  )
}

function EclipticReferenceOverlay() {
  const outlinePoints = useMemo(() => {
    return Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * ECLIPTIC_RADIUS, Math.sin(angle) * ECLIPTIC_RADIUS, 0)
    })
  }, [])

  return (
    <group>
      {/* Astronomy convention for this prototype: the renderer X-Y plane is the ecliptic plane. */}
      <mesh>
        <circleGeometry args={[ECLIPTIC_RADIUS, 64]} />
        <meshBasicMaterial color="#1f5f7a" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <Line points={outlinePoints} color="#64b3d5" lineWidth={1} />
      <Line points={[[-AXIS_LENGTH, 0, 0], [AXIS_LENGTH, 0, 0]]} color="#ff8d8d" lineWidth={1.25} />
      <Line points={[[0, -AXIS_LENGTH, 0], [0, AXIS_LENGTH, 0]]} color="#8fe388" lineWidth={1.25} />
      <Line points={[[0, 0, -AXIS_LENGTH], [0, 0, AXIS_LENGTH]]} color="#8cbcff" lineWidth={1.25} />
      <Text position={[6.2, -6.2, 0]} fontSize={0.34} color="#8ccae6">
        Ecliptic Reference Frame
      </Text>
      <AxisLabels />
    </group>
  )
}

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.45, 32, 32]} />
      <meshBasicMaterial color="#f7c651" />
    </mesh>
  )
}

function Earth({ position }: { position: THREE.Vector3 }) {
  const earthRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    earthRef.current?.position.copy(position)
  }, [position])

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial color="#4ca7ff" emissive="#0c1f38" emissiveIntensity={0.35} />
    </mesh>
  )
}

function Moon({ position }: { position: THREE.Vector3 }) {
  const moonRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    moonRef.current?.position.copy(position)
  }, [position])

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.35
    }
  })

  return (
    <group>
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#d9dde6" emissive="#343740" emissiveIntensity={0.12} />
      </mesh>
      <Text position={[position.x + 0.18, position.y + 0.12, position.z + 0.06]} fontSize={0.22} color="#dce4f2">
        Moon
      </Text>
    </group>
  )
}

function EarthOrbit() {
  const points = useMemo(() => {
    const start = new Date('2026-01-01T00:00:00Z')
    return Array.from({ length: 361 }, (_, index) => {
      const sampleDate = new Date(start.getTime() + index * MS_PER_DAY)
      return toSceneVector(Body.Earth, sampleDate)
    })
  }, [])

  return <Line points={points} color="#3b6f9b" lineWidth={1} />
}

function MoonTrack({ date, moonDistanceExaggeration }: { date: Date; moonDistanceExaggeration: number }) {
  const points = useMemo(() => {
    const start = new Date(date.getTime() - 20 * MS_PER_DAY)
    return Array.from({ length: 161 }, (_, index) => {
      const sampleDate = new Date(start.getTime() + index * 0.25 * MS_PER_DAY)
      return getBodyPositions(sampleDate, moonDistanceExaggeration).moonDisplayPosition
    })
  }, [date, moonDistanceExaggeration])

  return <Line points={points} color="#c4d2ea" lineWidth={0.9} transparent opacity={0.8} />
}

function SunEarthLine({ earthPosition }: { earthPosition: THREE.Vector3 }) {
  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), earthPosition], [earthPosition])
  return <Line points={points} color="#88bdf0" lineWidth={1} />
}

function EarthMoonLine({ earthPosition, moonPosition }: { earthPosition: THREE.Vector3; moonPosition: THREE.Vector3 }) {
  const points = useMemo(() => [earthPosition, moonPosition], [earthPosition, moonPosition])
  return <Line points={points} color="#d8deea" lineWidth={1.1} transparent opacity={0.95} />
}

function SimulationScene() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const tick = useSimulationStore((state) => state.tick)

  const { earthPosition, moonDisplayPosition } = useMemo(
    () => getBodyPositions(currentDate, moonDistanceExaggeration),
    [currentDate, moonDistanceExaggeration],
  )

  useFrame((_, delta) => {
    tick(delta)
  })

  return (
    <>
      <color attach="background" args={['#06111b']} />
      <fog attach="fog" args={['#06111b', 24, 60]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={900} decay={2} color="#fff1c1" />
      <CameraController preset={cameraPreset} />
      {showEclipticReference ? <EclipticReferenceOverlay /> : null}
      <EarthOrbit />
      <MoonTrack date={currentDate} moonDistanceExaggeration={moonDistanceExaggeration} />
      <SunEarthLine earthPosition={earthPosition} />
      <EarthMoonLine earthPosition={earthPosition} moonPosition={moonDisplayPosition} />
      <Sun />
      <Earth position={earthPosition} />
      <Moon position={moonDisplayPosition} />
    </>
  )
}

function ControlPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const sliderDays = useSimulationStore((state) => state.sliderDays)
  const playing = useSimulationStore((state) => state.playing)
  const speedDaysPerSecond = useSimulationStore((state) => state.speedDaysPerSecond)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const setSliderDays = useSimulationStore((state) => state.setSliderDays)
  const setPlaying = useSimulationStore((state) => state.setPlaying)
  const setSpeedDaysPerSecond = useSimulationStore((state) => state.setSpeedDaysPerSecond)
  const setCameraPreset = useSimulationStore((state) => state.setCameraPreset)
  const setShowEclipticReference = useSimulationStore((state) => state.setShowEclipticReference)
  const setMoonDistanceExaggeration = useSimulationStore((state) => state.setMoonDistanceExaggeration)
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