import { Body } from 'astronomy-engine'
import { toEclipticVectorAu } from './coordinates'

export const AU_TO_SCENE = 12

export function toSceneVector(body: Body, date: Date) {
  return toEclipticVectorAu(body, date).multiplyScalar(AU_TO_SCENE)
}

export function getBodyPositions(date: Date, moonDistanceExaggeration: number) {
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
