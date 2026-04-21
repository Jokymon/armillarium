import { Observer, ObserverVector, RotateVector, Rotation_EQJ_ECL, Vector } from 'astronomy-engine'
import * as THREE from 'three'

const EQJ_TO_ECL = Rotation_EQJ_ECL()
const GREENWICH_OBSERVER = new Observer(0, 0, 0)
const EAST_OBSERVER = new Observer(0, 90, 0)
const NORTH_POLE_OBSERVER = new Observer(90, 0, 0)

function rotateEqjVectorToEcliptic(vector: Vector) {
  const eclipticVector = RotateVector(EQJ_TO_ECL, vector)
  return new THREE.Vector3(eclipticVector.x, eclipticVector.y, eclipticVector.z).normalize()
}

export function observerVectorToEclipticAu(date: Date, latitude: number, longitude: number, heightMeters = 0) {
  const observer = new Observer(latitude, longitude, heightMeters)
  const observerVectorEqj = ObserverVector(date, observer, false)
  const eclipticVector = RotateVector(EQJ_TO_ECL, observerVectorEqj)
  return new THREE.Vector3(eclipticVector.x, eclipticVector.y, eclipticVector.z)
}

export function getEarthFixedAxes(date: Date) {
  const primeMeridianEqj = ObserverVector(date, GREENWICH_OBSERVER, false)
  const eastAxisEqj = ObserverVector(date, EAST_OBSERVER, false)
  const northPoleEqj = ObserverVector(date, NORTH_POLE_OBSERVER, false)

  return {
    primeMeridian: rotateEqjVectorToEcliptic(primeMeridianEqj),
    eastAxis: rotateEqjVectorToEcliptic(eastAxisEqj),
    northPole: rotateEqjVectorToEcliptic(northPoleEqj),
  }
}

export function getEarthSurfaceQuaternion(date: Date) {
  const { primeMeridian, eastAxis, northPole } = getEarthFixedAxes(date)
  const orientationMatrix = new THREE.Matrix4().makeBasis(primeMeridian, eastAxis, northPole)
  const quaternion = new THREE.Quaternion()

  orientationMatrix.decompose(new THREE.Vector3(), quaternion, new THREE.Vector3())

  return quaternion
}

export function latLonToEarthLocalVector(latitude: number, longitude: number, radius = 1) {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)
  const cosLat = Math.cos(lat)

  return new THREE.Vector3(
    radius * cosLat * Math.cos(lon),
    radius * cosLat * Math.sin(lon),
    radius * Math.sin(lat),
  )
}

export function getObserverSurfacePosition(
  earthPosition: THREE.Vector3,
  date: Date,
  latitude: number,
  longitude: number,
  radius: number,
) {
  const surfaceQuaternion = getEarthSurfaceQuaternion(date)
  const localSurfacePoint = latLonToEarthLocalVector(latitude, longitude, radius)

  return localSurfacePoint.applyQuaternion(surfaceQuaternion).add(earthPosition)
}

export function getTopocentricHorizontalAxes(date: Date, latitude: number, longitude: number) {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)
  const surfaceQuaternion = getEarthSurfaceQuaternion(date)

  const zenith = latLonToEarthLocalVector(latitude, longitude).applyQuaternion(surfaceQuaternion).normalize()
  const north = new THREE.Vector3(-Math.sin(lat) * Math.cos(lon), -Math.sin(lat) * Math.sin(lon), Math.cos(lat))
    .applyQuaternion(surfaceQuaternion)
    .normalize()
  const east = new THREE.Vector3(-Math.sin(lon), Math.cos(lon), 0).applyQuaternion(surfaceQuaternion).normalize()
  const west = east.multiplyScalar(-1)

  return {
    north,
    west,
    zenith,
  }
}
