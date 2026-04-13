import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CameraPreset, CameraTrackingTarget } from '../state/simulation-store'

const FREE_CAMERA_POSITION = [-2, -18, 10] as const
const FREE_CAMERA_TARGET = [0, 0, 0] as const
const TOP_CAMERA_POSITION = [0, 0, 30] as const
const ECLIPTIC_NORTH_UP = [0, 0, 1] as const
const TOP_VIEW_UP = [0, 1, 0] as const

export function CameraController({
  preset,
  trackingTarget,
  selectedBodyPosition,
}: {
  preset: CameraPreset
  trackingTarget: CameraTrackingTarget
  selectedBodyPosition: THREE.Vector3
}) {
  const camera = useThree((state) => state.camera)
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null)
  const lastTrackingTargetRef = useRef<CameraTrackingTarget>('none')
  const lastTrackedPositionRef = useRef<THREE.Vector3 | null>(null)

  useEffect(() => {
    const controls = controlsRef.current

    if (preset === 'top') {
      camera.position.set(...TOP_CAMERA_POSITION)
      camera.up.set(...TOP_VIEW_UP)
      controls?.target.set(...FREE_CAMERA_TARGET)
    } else {
      camera.position.set(...FREE_CAMERA_POSITION)
      camera.up.set(...ECLIPTIC_NORTH_UP)
      controls?.target.set(...FREE_CAMERA_TARGET)
    }

    camera.lookAt(...FREE_CAMERA_TARGET)
    camera.updateProjectionMatrix()
    controls?.update()
    lastTrackedPositionRef.current = null
  }, [camera, preset])

  useFrame(() => {
    const controls = controlsRef.current

    if (!controls) {
      return
    }

    if (trackingTarget === 'none') {
      lastTrackingTargetRef.current = 'none'
      lastTrackedPositionRef.current = null
      return
    }

    if (lastTrackingTargetRef.current !== trackingTarget || !lastTrackedPositionRef.current) {
      const cameraOffset = camera.position.clone().sub(controls.target)

      controls.target.copy(selectedBodyPosition)
      camera.position.copy(selectedBodyPosition).add(cameraOffset)
      lastTrackingTargetRef.current = trackingTarget
      lastTrackedPositionRef.current = selectedBodyPosition.clone()
      controls.update()
      return
    }

    const targetDelta = selectedBodyPosition.clone().sub(lastTrackedPositionRef.current)

    if (targetDelta.lengthSq() > 0) {
      controls.target.add(targetDelta)
      camera.position.add(targetDelta)
      lastTrackedPositionRef.current.copy(selectedBodyPosition)
      controls.update()
    }
  })

  return <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.08} />
}
