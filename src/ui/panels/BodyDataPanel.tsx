import { Body } from 'astronomy-engine'
import { useMemo } from 'react'
import { getEclipticReadout } from '../../astronomy/readouts'
import { READOUT_REFERENCE_FRAME_OPTIONS, SELECTABLE_BODIES, useSimulationStore } from '../../state/simulation-store'
import { formatDegrees, formatDistanceAu } from '../formatters'

export function BodyDataPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const setSelectedBody = useSimulationStore((state) => state.setSelectedBody)
  const setReadoutReferenceFrame = useSimulationStore((state) => state.setReadoutReferenceFrame)

  const selectedBodyReadout = useMemo(
    () => getEclipticReadout(selectedBody as Body, currentDate, readoutReferenceFrame),
    [selectedBody, currentDate, readoutReferenceFrame],
  )
  const activeFrame = READOUT_REFERENCE_FRAME_OPTIONS.find((option) => option.value === readoutReferenceFrame)
  const longitudeLabel = readoutReferenceFrame === 'geocentric-ecliptic-j2000' ? 'λ' : 'l'
  const latitudeLabel = readoutReferenceFrame === 'geocentric-ecliptic-j2000' ? 'β' : 'b'
  const distanceLabel = readoutReferenceFrame === 'geocentric-ecliptic-j2000' ? 'Δ' : 'r'

  return (
    <section>
      <h2>Body Data</h2>
      <p className="readout">Reference frame</p>
      <div className="button-row">
        {READOUT_REFERENCE_FRAME_OPTIONS.map((frame) => (
          <button
            key={frame.value}
            className={readoutReferenceFrame === frame.value ? 'active' : ''}
            onClick={() => setReadoutReferenceFrame(frame.value)}
          >
            {frame.shortLabel}
          </button>
        ))}
      </div>
      <p className="readout">Active frame: {activeFrame?.label}</p>
      <div className="button-row">
        {SELECTABLE_BODIES.map((body) => (
          <button key={body} className={selectedBody === body ? 'active' : ''} onClick={() => setSelectedBody(body)}>
            {body}
          </button>
        ))}
      </div>
      <p className="readout">Selected body: {selectedBody}</p>
      <p className="readout">{longitudeLabel}: {formatDegrees(selectedBodyReadout.longitudeDeg)}</p>
      <p className="readout">{latitudeLabel}: {formatDegrees(selectedBodyReadout.latitudeDeg)}</p>
      <p className="readout">{distanceLabel}: {formatDistanceAu(selectedBodyReadout.distanceAu)}</p>
    </section>
  )
}