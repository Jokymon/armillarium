import { Body } from 'astronomy-engine'
import { useMemo } from 'react'
import { getEclipticReadout } from '../../astronomy/readouts'
import { SELECTABLE_BODIES, useSimulationStore } from '../../state/simulation-store'
import { formatDegrees, formatDistanceAu } from '../formatters'

export function BodyDataPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const setSelectedBody = useSimulationStore((state) => state.setSelectedBody)

  const selectedBodyReadout = useMemo(
    () => getEclipticReadout(selectedBody as Body, currentDate),
    [selectedBody, currentDate],
  )

  return (
    <section>
      <h2>Body Data</h2>
      <div className="button-row">
        {SELECTABLE_BODIES.map((body) => (
          <button key={body} className={selectedBody === body ? 'active' : ''} onClick={() => setSelectedBody(body)}>
            {body}
          </button>
        ))}
      </div>
      <p className="readout">Selected body: {selectedBody}</p>
      <p className="readout">l: {formatDegrees(selectedBodyReadout.longitudeDeg)}</p>
      <p className="readout">b: {formatDegrees(selectedBodyReadout.latitudeDeg)}</p>
      <p className="readout">Δ: {formatDistanceAu(selectedBodyReadout.distanceAu)}</p>
    </section>
  )
}