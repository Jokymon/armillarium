import { Body } from 'astronomy-engine'
import { useMemo } from 'react'
import { getBodyReadout } from '../../astronomy/readouts'
import { READOUT_REFERENCE_FRAME_OPTIONS, SELECTABLE_BODIES, useSimulationStore } from '../../state/simulation-store'
import { formatDegrees, formatDistanceAu, formatHours } from '../formatters'

export function BodyDataPanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const selectedBody = useSimulationStore((state) => state.selectedBody)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const showHeliocentricEcliptic = useSimulationStore((state) => state.showHeliocentricEcliptic)
  const showGeocentricEcliptic = useSimulationStore((state) => state.showGeocentricEcliptic)
  const showGeocentricEquatorial = useSimulationStore((state) => state.showGeocentricEquatorial)
  const setSelectedBody = useSimulationStore((state) => state.setSelectedBody)
  const setReadoutReferenceFrame = useSimulationStore((state) => state.setReadoutReferenceFrame)

  const selectedBodyReadout = useMemo(
    () => getBodyReadout(selectedBody as Body, currentDate, readoutReferenceFrame),
    [selectedBody, currentDate, readoutReferenceFrame],
  )
  const activeFrame = READOUT_REFERENCE_FRAME_OPTIONS.find((option) => option.value === readoutReferenceFrame)
  const isEquatorialFrame = readoutReferenceFrame === 'geocentric-equatorial-j2000'
  const primaryLabel = isEquatorialFrame ? 'α' : readoutReferenceFrame === 'geocentric-ecliptic-j2000' ? 'λ' : 'l'
  const secondaryLabel = isEquatorialFrame ? 'δ' : readoutReferenceFrame === 'geocentric-ecliptic-j2000' ? 'β' : 'b'
  const distanceLabel = readoutReferenceFrame === 'heliocentric-ecliptic-j2000' ? 'r' : 'Δ'
  const formattedPrimaryValue = isEquatorialFrame
    ? formatHours(selectedBodyReadout.primaryValue)
    : formatDegrees(selectedBodyReadout.primaryValue)
  const formattedSecondaryValue = formatDegrees(selectedBodyReadout.secondaryValue)
  const isActiveFrameVisible =
    readoutReferenceFrame === 'heliocentric-ecliptic-j2000'
      ? showHeliocentricEcliptic
      : readoutReferenceFrame === 'geocentric-ecliptic-j2000'
        ? showGeocentricEcliptic
        : showGeocentricEquatorial

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
      {!isActiveFrameVisible ? (
        <p className="readout subtle-readout">The active readout frame is currently hidden in the scene.</p>
      ) : null}
      <div className="button-row">
        {SELECTABLE_BODIES.map((body) => (
          <button key={body} className={selectedBody === body ? 'active' : ''} onClick={() => setSelectedBody(body)}>
            {body}
          </button>
        ))}
      </div>
      <p className="readout">Selected body: {selectedBody}</p>
      <p className="readout">{primaryLabel}: {formattedPrimaryValue}</p>
      <p className="readout">{secondaryLabel}: {formattedSecondaryValue}</p>
      <p className="readout">{distanceLabel}: {formatDistanceAu(selectedBodyReadout.distanceAu)}</p>
    </section>
  )
}
