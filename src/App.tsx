import { Canvas } from '@react-three/fiber'
import { SimulationScene } from './scene/SimulationScene'
import { ControlPanel } from './ui/ControlPanel'

export default function App() {
  return (
    <div className="app-shell">
      <ControlPanel />
      <main className="viewport">
        <Canvas camera={{ position: [16, 10, 16], fov: 45, near: 0.1, far: 200 }}>
          <SimulationScene />
        </Canvas>
      </main>
    </div>
  )
}
