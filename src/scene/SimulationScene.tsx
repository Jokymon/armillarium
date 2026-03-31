import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { getBodyPositions } from '../astronomy/positions'
import { useSimulationStore } from '../state/simulation-store'
import { Earth, Moon, Sun } from './bodies'
import { CameraController } from './CameraController'
import { EarthMoonLine, EarthOrbit, MoonTrack, SunEarthLine } from './guides'
import { EclipticReferenceOverlay, GeocentricEquatorialOverlay } from './overlays'

const SUN_ORIGIN = new THREE.Vector3(0, 0, 0)

export function SimulationScene() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const showGeocentricEquatorial = useSimulationStore((state) => state.showGeocentricEquatorial)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const tick = useSimulationStore((state) => state.tick)

  const { earthPosition, moonDisplayPosition } = useMemo(
    () => getBodyPositions(currentDate, moonDistanceExaggeration),
    [currentDate, moonDistanceExaggeration],
  )
  const frameOrigin = readoutReferenceFrame === 'geocentric-ecliptic-j2000' ? earthPosition : SUN_ORIGIN
  const frameLabel =
    readoutReferenceFrame === 'geocentric-ecliptic-j2000'
      ? 'Geocentric Ecliptic J2000'
      : 'Heliocentric Ecliptic J2000'

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
      {showEclipticReference ? <EclipticReferenceOverlay origin={frameOrigin} frameLabel={frameLabel} /> : null}
      {showGeocentricEquatorial ? <GeocentricEquatorialOverlay origin={earthPosition} /> : null}
      <EarthOrbit />
      <MoonTrack date={currentDate} moonDistanceExaggeration={moonDistanceExaggeration} />
      <SunEarthLine earthPosition={earthPosition} />
      <EarthMoonLine earthPosition={earthPosition} moonPosition={moonDisplayPosition} />
      <Sun isSelected={selectedBody === 'Sun'} />
      <Earth position={earthPosition} isSelected={selectedBody === 'Earth'} />
      <Moon position={moonDisplayPosition} isSelected={selectedBody === 'Moon'} />
    </>
  )
}