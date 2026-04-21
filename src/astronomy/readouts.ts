import { AstroTime, Body, RotateVector, Rotation_ECL_EQJ, Vector } from 'astronomy-engine'
import * as THREE from 'three'
import type { ReadoutReferenceFrame } from '../state/simulation-store'
import { toEclipticVectorAu } from './coordinates'
import { getTopocentricHorizontalAxes, observerVectorToEclipticAu } from './earth'

export type BodyReadout = {
  primaryValue: number | null
  secondaryValue: number | null
  distanceAu: number
}

const ECL_TO_EQJ = Rotation_ECL_EQJ()

function getGeocentricEclipticVectorAu(body: Body, date: Date) {
  const bodyVector = toEclipticVectorAu(body, date)
  const earthVector = toEclipticVectorAu(Body.Earth, date)
  return bodyVector.sub(earthVector)
}

function getReadoutVectorAu(body: Body, date: Date, frame: ReadoutReferenceFrame) {
  if (frame === 'heliocentric-ecliptic-j2000') {
    return toEclipticVectorAu(body, date)
  }

  const geocentricEclipticVector = getGeocentricEclipticVectorAu(body, date)

  if (frame === 'topocentric-horizontal') {
    return geocentricEclipticVector
  }

  if (frame === 'geocentric-equatorial-j2000') {
    const epoch = new AstroTime(0)
    const eqjVector = RotateVector(
      ECL_TO_EQJ,
      new Vector(geocentricEclipticVector.x, geocentricEclipticVector.y, geocentricEclipticVector.z, epoch),
    )
    return new THREE.Vector3(eqjVector.x, eqjVector.y, eqjVector.z)
  }

  return geocentricEclipticVector
}

export function getBodyReadout(
  body: Body,
  date: Date,
  frame: ReadoutReferenceFrame,
  observerLatitude = 0,
  observerLongitude = 0,
  observerElevationMeters = 0,
): BodyReadout {
  const vector =
    frame === 'topocentric-horizontal'
      ? getGeocentricEclipticVectorAu(body, date).sub(
          observerVectorToEclipticAu(date, observerLatitude, observerLongitude, observerElevationMeters),
        )
      : getReadoutVectorAu(body, date, frame)
  const distanceAu = vector.length()

  if (distanceAu === 0) {
    return {
      primaryValue: null,
      secondaryValue: null,
      distanceAu: 0,
    }
  }

  if (frame === 'geocentric-equatorial-j2000') {
    const rightAscensionHours = THREE.MathUtils.euclideanModulo(
      THREE.MathUtils.radToDeg(Math.atan2(vector.y, vector.x)) / 15,
      24,
    )
    const declinationDeg = THREE.MathUtils.radToDeg(Math.atan2(vector.z, Math.hypot(vector.x, vector.y)))

    return {
      primaryValue: rightAscensionHours,
      secondaryValue: declinationDeg,
      distanceAu,
    }
  }

  if (frame === 'topocentric-horizontal') {
    const { north, west, zenith } = getTopocentricHorizontalAxes(date, observerLatitude, observerLongitude)
    const northComponent = vector.dot(north)
    const westComponent = vector.dot(west)
    const zenithComponent = vector.dot(zenith)
    const azimuthDeg = THREE.MathUtils.euclideanModulo(
      THREE.MathUtils.radToDeg(Math.atan2(westComponent, northComponent)),
      360,
    )
    const altitudeDeg = THREE.MathUtils.radToDeg(
      Math.atan2(zenithComponent, Math.hypot(northComponent, westComponent)),
    )

    return {
      primaryValue: azimuthDeg,
      secondaryValue: altitudeDeg,
      distanceAu,
    }
  }

  const longitudeDeg = THREE.MathUtils.euclideanModulo(THREE.MathUtils.radToDeg(Math.atan2(vector.y, vector.x)), 360)
  const latitudeDeg = THREE.MathUtils.radToDeg(Math.atan2(vector.z, Math.hypot(vector.x, vector.y)))

  return {
    primaryValue: longitudeDeg,
    secondaryValue: latitudeDeg,
    distanceAu,
  }
}
