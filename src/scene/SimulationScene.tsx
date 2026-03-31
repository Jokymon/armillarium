import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { Body } from 'astronomy-engine'
import * as THREE from 'three'
import { getBodyPositions, toSceneVector } from '../astronomy/positions'
import { useSimulationStore } from '../state/simulation-store'
import { Earth, Jupiter, Mars, Moon, Sun, Venus } from './bodies'
import { CameraController } from './CameraController'
import { EarthMoonLine, EarthOrbit, JupiterOrbit, MarsOrbit, MoonTrack, SunEarthLine, VenusOrbit } from './guides'
import { EclipticReferenceOverlay, GeocentricEquatorialOverlay } from './overlays'

const SUN_ORIGIN = new THREE.Vector3(0, 0, 0)

export function SimulationScene() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const showHeliocentricEcliptic = useSimulationStore((state) => state.showHeliocentricEcliptic)
  const showGeocentricEcliptic = useSimulationStore((state) => state.showGeocentricEcliptic)
  const showGeocentricEquatorial = useSimulationStore((state) => state.showGeocentricEquatorial)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const tick = useSimulationStore((state) => state.tick)

  const { earthPosition, moonDisplayPosition } = useMemo(
    () => getBodyPositions(currentDate, moonDistanceExaggeration),
    [currentDate, moonDistanceExaggeration],
  )
  const venusPosition = useMemo(() => toSceneVector(Body.Venus, currentDate), [currentDate])
  const marsPosition = useMemo(() => toSceneVector(Body.Mars, currentDate), [currentDate])
  const jupiterPosition = useMemo(() => toSceneVector(Body.Jupiter, currentDate), [currentDate])

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
      {showHeliocentricEcliptic ? (
        <EclipticReferenceOverlay
          origin={SUN_ORIGIN}
          frameLabel="Heliocentric Ecliptic J2000"
          highlighted={readoutReferenceFrame === 'heliocentric-ecliptic-j2000'}
        />
      ) : null}
      {showGeocentricEcliptic ? (
        <EclipticReferenceOverlay
          origin={earthPosition}
          frameLabel="Geocentric Ecliptic J2000"
          highlighted={readoutReferenceFrame === 'geocentric-ecliptic-j2000'}
        />
      ) : null}
      {showGeocentricEquatorial ? (
        <GeocentricEquatorialOverlay
          origin={earthPosition}
          highlighted={readoutReferenceFrame === 'geocentric-equatorial-j2000'}
        />
      ) : null}
      <VenusOrbit />
      <EarthOrbit />
      <MarsOrbit />
      <JupiterOrbit />
      <MoonTrack date={currentDate} moonDistanceExaggeration={moonDistanceExaggeration} />
      <SunEarthLine earthPosition={earthPosition} />
      <EarthMoonLine earthPosition={earthPosition} moonPosition={moonDisplayPosition} />
      <Sun isSelected={selectedBody === 'Sun'} />
      <Venus position={venusPosition} isSelected={selectedBody === 'Venus'} />
      <Earth position={earthPosition} isSelected={selectedBody === 'Earth'} />
      <Mars position={marsPosition} isSelected={selectedBody === 'Mars'} />
      <Jupiter position={jupiterPosition} isSelected={selectedBody === 'Jupiter'} />
      <Moon position={moonDisplayPosition} isSelected={selectedBody === 'Moon'} />
    </>
  )
}
