import { Line, Text } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

const AXIS_LENGTH = 8
const ECLIPTIC_RADIUS = 15

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

export function EclipticReferenceOverlay({ origin, frameLabel }: { origin: THREE.Vector3; frameLabel: string }) {
  const outlinePoints = useMemo(() => {
    return Array.from({ length: 65 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * ECLIPTIC_RADIUS, Math.sin(angle) * ECLIPTIC_RADIUS, 0)
    })
  }, [])

  return (
    <group position={origin.toArray()}>
      {/* Astronomy convention for this prototype: the renderer X-Y plane is the ecliptic plane. */}
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