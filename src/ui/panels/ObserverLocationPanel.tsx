import { useSimulationStore } from '../../state/simulation-store'
import { formatLatitude, formatLongitude } from '../formatters'

export function ObserverLocationPanel() {
  const interactionMode = useSimulationStore((state) => state.interactionMode)
  const observerLatitude = useSimulationStore((state) => state.observerLatitude)
  const observerLongitude = useSimulationStore((state) => state.observerLongitude)
  const observerElevationMeters = useSimulationStore((state) => state.observerElevationMeters)
  const setInteractionMode = useSimulationStore((state) => state.setInteractionMode)

  return (
    <section>
      <h2>Observer Location</h2>
      <p className="readout">Latitude: {formatLatitude(observerLatitude)}</p>
      <p className="readout">Longitude: {formatLongitude(observerLongitude)}</p>
      <p className="readout">Elevation: {observerElevationMeters.toFixed(0)} m</p>
      <div className="button-row">
        <button
          className={interactionMode === 'pick-earth-location' ? 'active' : ''}
          onClick={() =>
            setInteractionMode(interactionMode === 'pick-earth-location' ? 'select-body' : 'pick-earth-location')
          }
        >
          Pick on Earth
        </button>
      </div>
      {interactionMode === 'pick-earth-location' ? (
        <p className="readout subtle-readout">Click the visible Earth surface to set the observer location.</p>
      ) : null}
    </section>
  )
}
