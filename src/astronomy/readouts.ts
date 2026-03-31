import { Body } from 'astronomy-engine'
import * as THREE from 'three'
import type { ReadoutReferenceFrame } from '../state/simulation-store'
import { toEclipticVectorAu } from './coordinates'

export type EclipticReadout = {
  longitudeDeg: number | null
  latitudeDeg: number | null
  distanceAu: number
}

export function getEclipticVectorAuInFrame(body: Body, date: Date, frame: ReadoutReferenceFrame) {
  const bodyVector = toEclipticVectorAu(body, date)

  if (frame === 'heliocentric-ecliptic-j2000') {
    return bodyVector
  }

  const earthVector = toEclipticVectorAu(Body.Earth, date)
  return bodyVector.sub(earthVector)
}

export function getEclipticReadout(body: Body, date: Date, frame: ReadoutReferenceFrame): EclipticReadout {
  const vector = getEclipticVectorAuInFrame(body, date, frame)
  const distanceAu = vector.length()

  if (distanceAu === 0) {
    return {
      longitudeDeg: null,
      latitudeDeg: null,
      distanceAu: 0,
    }
  }

  const longitudeDeg = THREE.MathUtils.radToDeg(Math.atan2(vector.y, vector.x))
  const latitudeDeg = THREE.MathUtils.radToDeg(Math.atan2(vector.z, Math.hypot(vector.x, vector.y)))

  return {
    longitudeDeg: THREE.MathUtils.euclideanModulo(longitudeDeg, 360),
    latitudeDeg,
    distanceAu,
  }
}