import { Body } from 'astronomy-engine'
import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { getBodyPositions, toSceneVector } from '../astronomy/positions'
import { MS_PER_DAY } from '../state/simulation-store'

export function EarthOrbit() {
  const points = useMemo(() => {
    const start = new Date('2026-01-01T00:00:00Z')
    return Array.from({ length: 361 }, (_, index) => {
      const sampleDate = new Date(start.getTime() + index * MS_PER_DAY)
      return toSceneVector(Body.Earth, sampleDate)
    })
  }, [])

  return <Line points={points} color="#3b6f9b" lineWidth={1} />
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

export function SunEarthLine({ earthPosition }: { earthPosition: THREE.Vector3 }) {
  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), earthPosition], [earthPosition])
  return <Line points={points} color="#88bdf0" lineWidth={1} />
}

export function EarthMoonLine({ earthPosition, moonPosition }: { earthPosition: THREE.Vector3; moonPosition: THREE.Vector3 }) {
  const points = useMemo(() => [earthPosition, moonPosition], [earthPosition, moonPosition])
  return <Line points={points} color="#d8deea" lineWidth={1.1} transparent opacity={0.95} />
}