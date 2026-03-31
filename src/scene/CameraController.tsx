import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { CameraPreset } from '../state/simulation-store'

export function CameraController({ preset }: { preset: CameraPreset }) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (preset === 'top') {
      camera.position.set(0, 0, 24)
    } else {
      camera.position.set(16, 10, 16)
    }

    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, preset])

  return <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
}