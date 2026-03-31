import { useSimulationStore } from '../../state/simulation-store'

export function ViewPanel() {
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const setCameraPreset = useSimulationStore((state) => state.setCameraPreset)
  const setMoonDistanceExaggeration = useSimulationStore((state) => state.setMoonDistanceExaggeration)

  return (
    <section>
      <h2>View</h2>
      <div className="button-row">
        <button className={cameraPreset === 'free' ? 'active' : ''} onClick={() => setCameraPreset('free')}>
          Free Camera
        </button>
        <button className={cameraPreset === 'top' ? 'active' : ''} onClick={() => setCameraPreset('top')}>
          Top View
        </button>
      </div>
      <label className="range-field">
        <span>Moon distance exaggeration: {moonDistanceExaggeration.toFixed(0)}x</span>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={moonDistanceExaggeration}
          onChange={(event) => setMoonDistanceExaggeration(Number(event.target.value))}
        />
      </label>
    </section>
  )
}