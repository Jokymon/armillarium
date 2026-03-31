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

export function EclipticReferenceOverlay({
  origin,
  frameLabel,
  highlighted,
}: {
  origin: THREE.Vector3
  frameLabel: string
  highlighted: boolean
}) {
  const outlinePoints = useMemo(() => {
    return Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * ECLIPTIC_RADIUS, Math.sin(angle) * ECLIPTIC_RADIUS, 0)
    })
  }, [])
  const planeOpacity = highlighted ? 0.1 : 0.12
  const outlineWidth = highlighted ? 1.5 : 1
  const axisWidth = highlighted ? 1.6 : 1.25
  const outlineColor = highlighted ? '#90daf8' : '#64b3d5'
  const xColor = highlighted ? '#ffb0b0' : '#ff8d8d'
  const yColor = highlighted ? '#b6f3a8' : '#8fe388'
  const zColor = highlighted ? '#aed2ff' : '#8cbcff'
  const labelColor = highlighted ? '#b6e6fb' : '#8ccae6'

  return (
    <group position={origin.toArray()}>
      <mesh>
        <circleGeometry args={[ECLIPTIC_RADIUS, 64]} />
        <meshBasicMaterial color="#1f5f7a" transparent opacity={planeOpacity} side={THREE.DoubleSide} />
      </mesh>
      <Line points={outlinePoints} color={outlineColor} lineWidth={outlineWidth} />
      <Line points={[[-AXIS_LENGTH, 0, 0], [AXIS_LENGTH, 0, 0]]} color={xColor} lineWidth={axisWidth} />
      <Line points={[[0, -AXIS_LENGTH, 0], [0, AXIS_LENGTH, 0]]} color={yColor} lineWidth={axisWidth} />
      <Line points={[[0, 0, -AXIS_LENGTH], [0, 0, AXIS_LENGTH]]} color={zColor} lineWidth={axisWidth} />
      <Text position={[6.2, -6.2, 0]} fontSize={0.34} color={labelColor}>
        {frameLabel}
      </Text>
      <AxisLabels />
    </group>
  )
}

export function GeocentricEquatorialOverlay({
  origin,
  highlighted,
}: {
  origin: THREE.Vector3
  highlighted: boolean
}) {
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
  const planeOpacity = highlighted ? 0.14 : 0.16
  const outlineWidth = highlighted ? 1.5 : 1
  const axisWidth = highlighted ? 1.45 : 1.15
  const outlineColor = highlighted ? '#ffbc93' : '#f09a6c'
  const xColor = highlighted ? '#ffd0b1' : '#ffb486'
  const yColor = highlighted ? '#ffe59b' : '#ffd37a'
  const zColor = highlighted ? '#ffb49f' : '#ff9f80'
  const labelColor = highlighted ? '#ffd1b5' : '#f6b18b'

  return (
    <group position={origin.toArray()} quaternion={orientation}>
      <mesh>
        <circleGeometry args={[EQUATORIAL_RADIUS, 64]} />
        <meshBasicMaterial color="#7d3f2a" transparent opacity={planeOpacity} side={THREE.DoubleSide} />
      </mesh>
      <Line points={outlinePoints} color={outlineColor} lineWidth={outlineWidth} />
      <Line points={[[-AXIS_LENGTH, 0, 0], [AXIS_LENGTH, 0, 0]]} color={xColor} lineWidth={axisWidth} />
      <Line points={[[0, -AXIS_LENGTH, 0], [0, AXIS_LENGTH, 0]]} color={yColor} lineWidth={axisWidth} />
      <Line points={[[0, 0, -AXIS_LENGTH], [0, 0, AXIS_LENGTH]]} color={zColor} lineWidth={axisWidth} />
      <Text position={[4.6, -4.8, 0]} fontSize={0.3} color={labelColor}>
        Geocentric Equatorial J2000
      </Text>
      <EquatorialAxisLabels />
    </group>
  )
}
