import { useMemo } from 'react'
import { getBodyPositions } from '../../astronomy/positions'
import { useSimulationStore } from '../../state/simulation-store'

export function ViewPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const cameraPreset = useSimulationStore((state) => state.cameraPreset)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)
  const setCameraPreset = useSimulationStore((state) => state.setCameraPreset)
  const setMoonDistanceExaggeration = useSimulationStore((state) => state.setMoonDistanceExaggeration)

  const { earthPosition, moonPhysicalPosition, moonDisplayPosition } = useMemo(
    () => getBodyPositions(currentDate, moonDistanceExaggeration),
    [currentDate, moonDistanceExaggeration],
  )
  const physicalEarthMoonDistance = useMemo(
    () => earthPosition.distanceTo(moonPhysicalPosition),
    [earthPosition, moonPhysicalPosition],
  )
  const displayEarthMoonDistance = useMemo(
    () => earthPosition.distanceTo(moonDisplayPosition),
    [earthPosition, moonDisplayPosition],
  )

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
      <p className="readout">Earth heliocentric position (scene units)</p>
      <code>
        x {earthPosition.x.toFixed(2)} | y {earthPosition.y.toFixed(2)} | z {earthPosition.z.toFixed(2)}
      </code>
      <p className="readout">Physical Earth-Moon separation: {physicalEarthMoonDistance.toFixed(3)} scene units</p>
      <p className="readout">Displayed Earth-Moon separation: {displayEarthMoonDistance.toFixed(3)} scene units</p>
    </section>
  )
}