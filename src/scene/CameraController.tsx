import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { CameraPreset } from '../state/simulation-store'

const FREE_CAMERA_POSITION = [-2, -18, 10] as const
const FREE_CAMERA_TARGET = [0, 0, 0] as const
const TOP_CAMERA_POSITION = [0, 0, 30] as const
const ECLIPTIC_NORTH_UP = [0, 0, 1] as const
const TOP_VIEW_UP = [0, 1, 0] as const

export function CameraController({ preset }: { preset: CameraPreset }) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (preset === 'top') {
      camera.position.set(...TOP_CAMERA_POSITION)
      camera.up.set(...TOP_VIEW_UP)
    } else {
      camera.position.set(...FREE_CAMERA_POSITION)
      camera.up.set(...ECLIPTIC_NORTH_UP)
    }

    camera.lookAt(...FREE_CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [camera, preset])

  return <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
}
