import { Body } from 'astronomy-engine'
import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { getBodyPositions, toSceneVector } from '../astronomy/positions'
import { MS_PER_DAY } from '../state/simulation-store'

function PlanetOrbit({
  body,
  color,
  lineWidth,
}: {
  body: Body
  color: string
  lineWidth: number
}) {
  const points = useMemo(() => {
    const start = new Date('2026-01-01T00:00:00Z')
    return Array.from({ length: 361 }, (_, index) => {
      const sampleDate = new Date(start.getTime() + index * MS_PER_DAY)
      return toSceneVector(body, sampleDate)
    })
  }, [body])

  return <Line points={points} color={color} lineWidth={lineWidth} />
}

export function EarthOrbit() {
  return <PlanetOrbit body={Body.Earth} color="#3b6f9b" lineWidth={1} />
}

export function VenusOrbit() {
  return <PlanetOrbit body={Body.Venus} color="#8f7350" lineWidth={0.95} />
}

export function MarsOrbit() {
  return <PlanetOrbit body={Body.Mars} color="#8a4e39" lineWidth={0.95} />
}

export function JupiterOrbit() {
  return <PlanetOrbit body={Body.Jupiter} color="#8e6c52" lineWidth={1.05} />
}

export function MoonTrack({ date, moonDistanceExaggeration }: { date: Date; moonDistanceExaggeration: number }) {
  const points = useMemo(() => {
    const start = new Date(date.getTime() - 20 * MS_PER_DAY)
    return Array.from({ length: 161 }, (_, index) => {
      const sampleDate = new Date(start.getTime() + index * 0.25 * MS_PER_DAY)
      return getBodyPositions(sampleDate, moonDistanceExaggeration).moonDisplayPosition
    })
  }, [date, moonDistanceExaggeration])

  return <Line points={points} color="#c4d2ea" lineWidth={0.9} transparent opacity={0.8} />
}

export function SelectedReferenceVector({
  origin,
  target,
}: {
  origin: THREE.Vector3
  target: THREE.Vector3
}) {
  const points = useMemo(() => [origin, target], [origin, target])
  const isVisible = origin.distanceToSquared(target) > 0.000001

  if (!isVisible) {
    return null
  }

  return <Line points={points} color="#d8deea" lineWidth={1.15} transparent opacity={0.95} />
}
