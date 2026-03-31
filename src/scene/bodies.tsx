import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const EARTH_DISPLAY_RADIUS = 0.16
const DISPLAY_RADIUS_EXPONENT = 0.35
const MAX_PLANET_DISPLAY_RADIUS = 0.38
const EARTH_RADIUS_KM = 6371

function getPlanetDisplayRadius(physicalRadiusKm: number) {
  const physicalRatio = physicalRadiusKm / EARTH_RADIUS_KM
  return Math.min(EARTH_DISPLAY_RADIUS * Math.pow(physicalRatio, DISPLAY_RADIUS_EXPONENT), MAX_PLANET_DISPLAY_RADIUS)
}

function SelectionHalo({ position, radius, color }: { position: THREE.Vector3; radius: number; color: string }) {
  const haloRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    haloRef.current?.position.copy(position)
    ringRef.current?.position.copy(position)
  }, [position])

  useFrame(({ camera, clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 3.2) * 0.16

    if (haloRef.current) {
      haloRef.current.scale.setScalar(pulse)
    }

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3.2 + 0.7) * 0.1)
      ringRef.current.lookAt(camera.position)
    }
  })

  return (
    <group renderOrder={1000}>
      <mesh ref={haloRef} renderOrder={1000}>
        <sphereGeometry args={[radius, 28, 28]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.34}
          side={THREE.BackSide}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringRef} renderOrder={1001}>
        <ringGeometry args={[radius * 1.18, radius * 1.42, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export function Sun({ isSelected }: { isSelected: boolean }) {
  return (
    <group>
      {isSelected ? <SelectionHalo position={new THREE.Vector3(0, 0, 0)} radius={0.62} color="#ffe27b" /> : null}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#f7c651" />
      </mesh>
    </group>
  )
}

export function Earth({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  const earthRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    earthRef.current?.position.copy(position)
  }, [position])

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <group>
      {isSelected ? <SelectionHalo position={position} radius={0.23} color="#8dd3ff" /> : null}
      <mesh ref={earthRef}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#4ca7ff" emissive="#0c1f38" emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function Planet({
  position,
  radius,
  color,
  emissive,
  emissiveIntensity,
  rotationSpeed,
  isSelected,
  haloColor,
}: {
  position: THREE.Vector3
  radius: number
  color: string
  emissive: string
  emissiveIntensity: number
  rotationSpeed: number
  isSelected: boolean
  haloColor: string
}) {
  const planetRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    planetRef.current?.position.copy(position)
  }, [position])

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <group>
      {isSelected ? <SelectionHalo position={position} radius={radius * 1.45} color={haloColor} /> : null}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 28, 28]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} />
      </mesh>
    </group>
  )
}

export function Venus({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(6051.8)}
      color="#d6b37d"
      emissive="#4f3320"
      emissiveIntensity={0.14}
      rotationSpeed={0.18}
      isSelected={isSelected}
      haloColor="#efd0a0"
    />
  )
}

export function Mars({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(3389.5)}
      color="#c76441"
      emissive="#4f1e15"
      emissiveIntensity={0.15}
      rotationSpeed={0.4}
      isSelected={isSelected}
      haloColor="#f19976"
    />
  )
}

export function Jupiter({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(69911)}
      color="#d7ae83"
      emissive="#5b3827"
      emissiveIntensity={0.16}
      rotationSpeed={0.95}
      isSelected={isSelected}
      haloColor="#f0c7a1"
    />
  )
}

export function Moon({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  const moonRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    moonRef.current?.position.copy(position)
  }, [position])

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.35
    }
  })

  return (
    <group>
      {isSelected ? <SelectionHalo position={position} radius={0.095} color="#ffffff" /> : null}
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#d9dde6" emissive="#343740" emissiveIntensity={0.12} />
      </mesh>
      <Text position={[position.x + 0.18, position.y + 0.12, position.z + 0.06]} fontSize={0.22} color="#dce4f2">
        Moon
      </Text>
    </group>
  )
}
