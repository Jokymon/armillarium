import { AstroTime, RotateVector, Rotation_EQJ_ECL, Vector } from 'astronomy-engine'
import { Line, Text } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

const AXIS_LENGTH = 8
const ECLIPTIC_RADIUS = 15
const EQUATORIAL_RADIUS = 7.5
const EQJ_TO_ECL = Rotation_EQJ_ECL()

function AxisLabels() {
  return (
    <group>
      <Text position={[AXIS_LENGTH + 1.1, 0, 0]} fontSize={0.34} color="#ff8d8d">
        X / Vernal Equinox
      </Text>
      <Text position={[0, AXIS_LENGTH + 1.1, 0]} fontSize={0.34} color="#8fe388">
        Y / +90° Ecliptic Longitude
      </Text>
      <Text position={[0, 0, AXIS_LENGTH + 1.1]} fontSize={0.34} color="#8cbcff">
        Z / North Ecliptic Pole
      </Text>
    </group>
  )
}

function EquatorialAxisLabels() {
  return (
    <group>
      <Text position={[AXIS_LENGTH + 0.95, 0, 0]} fontSize={0.3} color="#ffb486">
        X / Vernal Equinox
      </Text>
      <Text position={[0, AXIS_LENGTH + 0.95, 0]} fontSize={0.3} color="#ffd37a">
        Y / +6h Right Ascension
      </Text>
      <Text position={[0, 0, AXIS_LENGTH + 0.95]} fontSize={0.3} color="#ff9f80">
        Z / North Celestial Pole
      </Text>
    </group>
  )
}

export function EclipticReferenceOverlay({ origin, frameLabel }: { origin: THREE.Vector3; frameLabel: string }) {
  const outlinePoints = useMemo(() => {
    return Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * ECLIPTIC_RADIUS, Math.sin(angle) * ECLIPTIC_RADIUS, 0)
    })
  }, [])

  return (
    <group position={origin.toArray()}>
      <mesh>
        <circleGeometry args={[ECLIPTIC_RADIUS, 64]} />
        <meshBasicMaterial color="#1f5f7a" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <Line points={outlinePoints} color="#64b3d5" lineWidth={1} />
      <Line points={[[-AXIS_LENGTH, 0, 0], [AXIS_LENGTH, 0, 0]]} color="#ff8d8d" lineWidth={1.25} />
      <Line points={[[0, -AXIS_LENGTH, 0], [0, AXIS_LENGTH, 0]]} color="#8fe388" lineWidth={1.25} />
      <Line points={[[0, 0, -AXIS_LENGTH], [0, 0, AXIS_LENGTH]]} color="#8cbcff" lineWidth={1.25} />
      <Text position={[6.2, -6.2, 0]} fontSize={0.34} color="#8ccae6">
        {frameLabel}
      </Text>
      <AxisLabels />
    </group>
  )
}

export function GeocentricEquatorialOverlay({ origin }: { origin: THREE.Vector3 }) {
  const orientation = useMemo(() => {
    const xAxis = new THREE.Vector3(1, 0, 0)
    const epoch = new AstroTime(0)
    const yEqj = RotateVector(EQJ_TO_ECL, new Vector(0, 1, 0, epoch))
    const yAxis = new THREE.Vector3(yEqj.x, yEqj.y, yEqj.z)
    const zEqj = RotateVector(EQJ_TO_ECL, new Vector(0, 0, 1, epoch))
    const zAxis = new THREE.Vector3(zEqj.x, zEqj.y, zEqj.z)
    const matrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis)
    const quaternion = new THREE.Quaternion()
    matrix.decompose(new THREE.Vector3(), quaternion, new THREE.Vector3())
    return quaternion
  }, [])
  const outlinePoints = useMemo(() => {
    return Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * EQUATORIAL_RADIUS, Math.sin(angle) * EQUATORIAL_RADIUS, 0)
    })
  }, [])

  return (
    <group position={origin.toArray()} quaternion={orientation}>
      <mesh>
        <circleGeometry args={[EQUATORIAL_RADIUS, 64]} />
        <meshBasicMaterial color="#7d3f2a" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
      <Line points={outlinePoints} color="#f09a6c" lineWidth={1} />
      <Line points={[[-AXIS_LENGTH, 0, 0], [AXIS_LENGTH, 0, 0]]} color="#ffb486" lineWidth={1.15} />
      <Line points={[[0, -AXIS_LENGTH, 0], [0, AXIS_LENGTH, 0]]} color="#ffd37a" lineWidth={1.15} />
      <Line points={[[0, 0, -AXIS_LENGTH], [0, 0, AXIS_LENGTH]]} color="#ff9f80" lineWidth={1.15} />
      <Text position={[4.6, -4.8, 0]} fontSize={0.3} color="#f6b18b">
        Geocentric Equatorial J2000
      </Text>
      <EquatorialAxisLabels />
    </group>
  )
}
