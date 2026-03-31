import { useMemo } from 'react'
import { getBodyPositions } from '../../astronomy/positions'
import { useSimulationStore } from '../../state/simulation-store'

export function DebugPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const moonDistanceExaggeration = useSimulationStore((state) => state.moonDistanceExaggeration)

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
    <details className="debug-panel">
      <summary>Debug</summary>
      <div className="debug-content">
        <p className="readout">Earth heliocentric position (scene units)</p>
        <code>
          x {earthPosition.x.toFixed(2)} | y {earthPosition.y.toFixed(2)} | z {earthPosition.z.toFixed(2)}
        </code>
        <p className="readout">Physical Earth-Moon separation: {physicalEarthMoonDistance.toFixed(3)} scene units</p>
        <p className="readout">Displayed Earth-Moon separation: {displayEarthMoonDistance.toFixed(3)} scene units</p>
      </div>
    </details>
  )
}