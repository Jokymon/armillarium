import { Text } from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getEarthSurfaceQuaternion } from '../astronomy/earth'
import { EarthSurface } from './earth-surface'
import type { InteractionMode } from '../state/simulation-store'

const EARTH_DISPLAY_RADIUS = 0.16
const DISPLAY_RADIUS_EXPONENT = 0.35
const MAX_PLANET_DISPLAY_RADIUS = 0.38
const EARTH_RADIUS_KM = 6371
const SUN_ORIGIN = new THREE.Vector3(0, 0, 0)

function getPlanetDisplayRadius(physicalRadiusKm: number) {
  const physicalRatio = physicalRadiusKm / EARTH_RADIUS_KM
  return Math.min(EARTH_DISPLAY_RADIUS * Math.pow(physicalRatio, DISPLAY_RADIUS_EXPONENT), MAX_PLANET_DISPLAY_RADIUS)
}

function BodyLabel({
  position,
  radius,
  label,
  color = '#dce4f2',
}: {
  position: THREE.Vector3
  radius: number
  label: string
  color?: string
}) {
  const labelRef = useRef<THREE.Group>(null)

  function applyOverlayTextMaterial(textMesh: THREE.Mesh) {
    textMesh.renderOrder = 1200
    const materials = Array.isArray(textMesh.material) ? textMesh.material : [textMesh.material]

    materials.forEach((material) => {
      material.depthTest = false
      material.depthWrite = false
      material.toneMapped = false
      material.needsUpdate = true
    })
  }

  useFrame(({ camera }) => {
    if (!labelRef.current) {
      return
    }

    const distance = camera.position.distanceTo(position)
    const labelScale = THREE.MathUtils.clamp(distance * 0.018, 0.12, 0.72)
    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
    const labelPosition = position
      .clone()
      .add(cameraRight.multiplyScalar(radius + labelScale * 1.05))
      .add(cameraUp.multiplyScalar(radius + labelScale * 0.4))

    labelRef.current.position.copy(labelPosition)
    labelRef.current.quaternion.copy(camera.quaternion)
    labelRef.current.scale.setScalar(labelScale)
  })

  return (
    <group ref={labelRef} renderOrder={900}>
      <Text
        renderOrder={1200}
        fontSize={1}
        color={color}
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.045}
        outlineColor="#06111b"
        material-depthTest={false}
        material-depthWrite={false}
        material-toneMapped={false}
        onSync={applyOverlayTextMaterial}
      >
        {label}
      </Text>
    </group>
  )
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
      {isSelected ? <SelectionHalo position={SUN_ORIGIN} radius={0.62} color="#ffe27b" /> : null}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#f7c651" />
      </mesh>
      <BodyLabel position={SUN_ORIGIN} radius={0.45} label="Sun" color="#ffe27b" />
    </group>
  )
}

export function Earth({
  position,
  date,
  interactionMode,
  observerLatitude,
  observerLongitude,
  isSelected,
  onObserverLocationSelected,
}: {
  position: THREE.Vector3
  date: Date
  interactionMode: InteractionMode
  observerLatitude: number
  observerLongitude: number
  isSelected: boolean
  onObserverLocationSelected: (latitude: number, longitude: number) => void
}) {
  const earthGroupRef = useRef<THREE.Group>(null)
  const surfaceQuaternion = getEarthSurfaceQuaternion(date)

  useEffect(() => {
    if (earthGroupRef.current) {
      earthGroupRef.current.position.copy(position)
      earthGroupRef.current.quaternion.copy(surfaceQuaternion)
    }
  }, [position, surfaceQuaternion])

  function handleEarthClick(event: ThreeEvent<MouseEvent>) {
    if (interactionMode !== 'pick-earth-location' || !earthGroupRef.current) {
      return
    }

    event.stopPropagation()

    const localPoint = earthGroupRef.current.worldToLocal(event.point.clone()).normalize()
    const latitude = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(localPoint.z, -1, 1)))
    const longitude = THREE.MathUtils.euclideanModulo(THREE.MathUtils.radToDeg(Math.atan2(localPoint.y, localPoint.x)) + 180, 360) - 180

    onObserverLocationSelected(latitude, longitude)
  }

  return (
    <group>
      {isSelected ? <SelectionHalo position={position} radius={0.23} color="#8dd3ff" /> : null}
      <group ref={earthGroupRef}>
        <mesh onClick={handleEarthClick}>
          <sphereGeometry args={[EARTH_DISPLAY_RADIUS, 32, 32]} />
          <meshStandardMaterial color="#4ca7ff" emissive="#0c1f38" emissiveIntensity={0.35} />
        </mesh>
        <EarthSurface
          earthPosition={position}
          radius={EARTH_DISPLAY_RADIUS}
          observerLatitude={observerLatitude}
          observerLongitude={observerLongitude}
        />
      </group>
      <BodyLabel position={position} radius={EARTH_DISPLAY_RADIUS} label="Earth" color="#8dd3ff" />
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
  label,
}: {
  position: THREE.Vector3
  radius: number
  color: string
  emissive: string
  emissiveIntensity: number
  rotationSpeed: number
  isSelected: boolean
  haloColor: string
  label: string
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
      <BodyLabel position={position} radius={radius} label={label} color={haloColor} />
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
      label="Venus"
    />
  )
}

export function Mercury({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(2439.7)}
      color="#9f9386"
      emissive="#2c2926"
      emissiveIntensity={0.12}
      rotationSpeed={0.22}
      isSelected={isSelected}
      haloColor="#c9b8a7"
      label="Mercury"
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
      label="Mars"
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
      label="Jupiter"
    />
  )
}

export function Saturn({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(58232)}
      color="#d7bd86"
      emissive="#4d3d26"
      emissiveIntensity={0.15}
      rotationSpeed={0.85}
      isSelected={isSelected}
      haloColor="#ecd099"
      label="Saturn"
    />
  )
}

export function Uranus({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(25362)}
      color="#9ad6d9"
      emissive="#1b4a50"
      emissiveIntensity={0.14}
      rotationSpeed={0.5}
      isSelected={isSelected}
      haloColor="#b6edf0"
      label="Uranus"
    />
  )
}

export function Neptune({ position, isSelected }: { position: THREE.Vector3; isSelected: boolean }) {
  return (
    <Planet
      position={position}
      radius={getPlanetDisplayRadius(24622)}
      color="#5976d6"
      emissive="#182c66"
      emissiveIntensity={0.16}
      rotationSpeed={0.55}
      isSelected={isSelected}
      haloColor="#8fa8ff"
      label="Neptune"
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
      <BodyLabel position={position} radius={0.055} label="Moon" />
    </group>
  )
}
