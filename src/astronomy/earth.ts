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
