import { READOUT_REFERENCE_FRAME_OPTIONS, useSimulationStore } from '../../state/simulation-store'

export function EclipticReferencePanel() {
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const showGeocentricEquatorial = useSimulationStore((state) => state.showGeocentricEquatorial)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const setShowEclipticReference = useSimulationStore((state) => state.setShowEclipticReference)
  const setShowGeocentricEquatorial = useSimulationStore((state) => state.setShowGeocentricEquatorial)
  const activeFrame = READOUT_REFERENCE_FRAME_OPTIONS.find((option) => option.value === readoutReferenceFrame)

  return (
    <section>
      <h2>Reference Overlays</h2>
      <label className="toggle-field compact-toggle">
        <input
          type="checkbox"
          checked={showEclipticReference}
          onChange={(event) => setShowEclipticReference(event.target.checked)}
        />
        <span>Show active ecliptic frame</span>
      </label>
      <p className="readout">Ecliptic overlay: {activeFrame?.label}</p>
      <label className="toggle-field second-toggle">
        <input
          type="checkbox"
          checked={showGeocentricEquatorial}
          onChange={(event) => setShowGeocentricEquatorial(event.target.checked)}
        />
        <span>Show geocentric equatorial J2000</span>
      </label>
    </section>
  )
}