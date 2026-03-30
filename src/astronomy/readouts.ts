import { Body } from 'astronomy-engine'
import * as THREE from 'three'
import { toEclipticVectorAu } from './coordinates'

export type EclipticReadout = {
  longitudeDeg: number | null
  latitudeDeg: number | null
  distanceAu: number
}

export function getEclipticReadout(body: Body, date: Date): EclipticReadout {
  const vector = toEclipticVectorAu(body, date)
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
