import { Body, HelioVector, RotateVector, Rotation_EQJ_ECL } from 'astronomy-engine'
import * as THREE from 'three'

const EQJ_TO_ECL = Rotation_EQJ_ECL()

export function toEclipticVectorAu(body: Body, date: Date) {
  const eqjVector = HelioVector(body, date)
  const eclVector = RotateVector(EQJ_TO_ECL, eqjVector)
  return new THREE.Vector3(eclVector.x, eclVector.y, eclVector.z)
}
