import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { getBodyPositions } from '../astronomy/positions'
import { useSimulationStore } from '../state/simulation-store'
import { Earth, Moon, Sun } from './bodies'
import { CameraController } from './CameraController'
import { EarthMoonLine, EarthOrbit, MoonTrack, SunEarthLine } from './guides'
import { EclipticReferenceOverlay } from './overlays'

export function SimulationScene() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
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
      <Sun isSelected={selectedBody === 'Sun'} />
      <Earth position={earthPosition} isSelected={selectedBody === 'Earth'} />
      <Moon position={moonDisplayPosition} isSelected={selectedBody === 'Moon'} />
    </>
  )
}