import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { Body } from 'astronomy-engine'
import * as THREE from 'three'
import { getObserverSurfacePosition, getTopocentricHorizontalAxes } from '../astronomy/earth'
import { getBodyPositions, toSceneVector } from '../astronomy/positions'
import { useSimulationStore } from '../state/simulation-store'
import { Earth, Jupiter, Mars, Mercury, Moon, Neptune, Saturn, Sun, Uranus, Venus } from './bodies'
import { CameraController } from './CameraController'
import {
  EarthOrbit,
  JupiterOrbit,
  MarsOrbit,
  MercuryOrbit,
  MoonTrack,
  NeptuneOrbit,
  SaturnOrbit,
  SelectedReferenceVector,
  UranusOrbit,
  VenusOrbit,
} from './guides'
import { EclipticReferenceOverlay, GeocentricEquatorialOverlay, TopocentricHorizontalOverlay } from './overlays'

const SUN_ORIGIN = new THREE.Vector3(0, 0, 0)
const EARTH_DISPLAY_RADIUS = 0.16

export function SimulationScene() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const cameraTrackingTarget = useSimulationStore((state) => state.cameraTrackingTarget)
  const interactionMode = useSimulationStore((state) => state.interactionMode)
  const showHeliocentricEcliptic = useSimulationStore((state) => state.showHeliocentricEcliptic)
  const showGeocentricEcliptic = useSimulationStore((state) => state.showGeocentricEcliptic)
  const showGeocentricEquatorial = useSimulationStore((state) => state.showGeocentricEquatorial)
  const showTopocentricHorizontal = useSimulationStore((state) => state.showTopocentricHorizontal)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const observerLatitude = useSimulationStore((state) => state.observerLatitude)
  const observerLongitude = useSimulationStore((state) => state.observerLongitude)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const setObserverLocation = useSimulationStore((state) => state.setObserverLocation)
  const tick = useSimulationStore((state) => state.tick)

  const { earthPosition, moonDisplayPosition } = useMemo(
    () => getBodyPositions(currentDate, moonDistanceExaggeration),
    [currentDate, moonDistanceExaggeration],
  )
  const mercuryPosition = useMemo(() => toSceneVector(Body.Mercury, currentDate), [currentDate])
  const venusPosition = useMemo(() => toSceneVector(Body.Venus, currentDate), [currentDate])
  const marsPosition = useMemo(() => toSceneVector(Body.Mars, currentDate), [currentDate])
  const jupiterPosition = useMemo(() => toSceneVector(Body.Jupiter, currentDate), [currentDate])
  const saturnPosition = useMemo(() => toSceneVector(Body.Saturn, currentDate), [currentDate])
  const uranusPosition = useMemo(() => toSceneVector(Body.Uranus, currentDate), [currentDate])
  const neptunePosition = useMemo(() => toSceneVector(Body.Neptune, currentDate), [currentDate])
  const observerPosition = useMemo(
    () => getObserverSurfacePosition(earthPosition, currentDate, observerLatitude, observerLongitude, EARTH_DISPLAY_RADIUS * 1.03),
    [currentDate, earthPosition, observerLatitude, observerLongitude],
  )
  const topocentricHorizontalOrientation = useMemo(() => {
    const { north, west, zenith } = getTopocentricHorizontalAxes(currentDate, observerLatitude, observerLongitude)
    const matrix = new THREE.Matrix4().makeBasis(north, west, zenith)
    const quaternion = new THREE.Quaternion()

    matrix.decompose(new THREE.Vector3(), quaternion, new THREE.Vector3())

    return quaternion
  }, [currentDate, observerLatitude, observerLongitude])
  const selectedBodyPosition = useMemo(() => {
    switch (selectedBody) {
      case 'Sun':
        return SUN_ORIGIN
      case 'Mercury':
        return mercuryPosition
      case 'Venus':
        return venusPosition
      case 'Earth':
        return earthPosition
      case 'Mars':
        return marsPosition
      case 'Jupiter':
        return jupiterPosition
      case 'Saturn':
        return saturnPosition
      case 'Uranus':
        return uranusPosition
      case 'Neptune':
        return neptunePosition
      case 'Moon':
        return moonDisplayPosition
    }
  }, [
    earthPosition,
    jupiterPosition,
    marsPosition,
    mercuryPosition,
    moonDisplayPosition,
    neptunePosition,
    saturnPosition,
    selectedBody,
    uranusPosition,
    venusPosition,
  ])
  const selectedFrameOrigin = readoutReferenceFrame === 'heliocentric-ecliptic-j2000' ? SUN_ORIGIN : earthPosition

  useFrame((_, delta) => {
    tick(delta)
  })

  return (
    <>
      <color attach="background" args={['#06111b']} />
      <fog attach="fog" args={['#06111b', 24, 60]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={900} decay={2} color="#fff1c1" />
      <CameraController
        preset={cameraPreset}
        trackingTarget={cameraTrackingTarget}
        selectedBodyPosition={selectedBodyPosition}
      />
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
      {showTopocentricHorizontal ? (
        <TopocentricHorizontalOverlay origin={observerPosition} orientation={topocentricHorizontalOrientation} />
      ) : null}
      <MercuryOrbit />
      <VenusOrbit />
      <EarthOrbit />
      <MarsOrbit />
      <JupiterOrbit />
      <SaturnOrbit />
      <UranusOrbit />
      <NeptuneOrbit />
      <MoonTrack date={currentDate} moonDistanceExaggeration={moonDistanceExaggeration} />
      <SelectedReferenceVector origin={selectedFrameOrigin} target={selectedBodyPosition} />
      <Sun isSelected={selectedBody === 'Sun'} />
      <Mercury position={mercuryPosition} isSelected={selectedBody === 'Mercury'} />
      <Venus position={venusPosition} isSelected={selectedBody === 'Venus'} />
      <Earth
        position={earthPosition}
        date={currentDate}
        interactionMode={interactionMode}
        observerLatitude={observerLatitude}
        observerLongitude={observerLongitude}
        isSelected={selectedBody === 'Earth'}
        onObserverLocationSelected={setObserverLocation}
      />
      <Mars position={marsPosition} isSelected={selectedBody === 'Mars'} />
      <Jupiter position={jupiterPosition} isSelected={selectedBody === 'Jupiter'} />
      <Saturn position={saturnPosition} isSelected={selectedBody === 'Saturn'} />
      <Uranus position={uranusPosition} isSelected={selectedBody === 'Uranus'} />
      <Neptune position={neptunePosition} isSelected={selectedBody === 'Neptune'} />
      <Moon position={moonDisplayPosition} isSelected={selectedBody === 'Moon'} />
    </>
  )
}
