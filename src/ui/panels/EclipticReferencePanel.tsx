import { READOUT_REFERENCE_FRAME_OPTIONS, useSimulationStore } from '../../state/simulation-store'

export function EclipticReferencePanel() {
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const setShowEclipticReference = useSimulationStore((state) => state.setShowEclipticReference)
  const activeFrame = READOUT_REFERENCE_FRAME_OPTIONS.find((option) => option.value === readoutReferenceFrame)

  return (
    <section>
      <h2>Ecliptic Reference</h2>
      <label className="toggle-field compact-toggle">
        <input
          type="checkbox"
          checked={showEclipticReference}
          onChange={(event) => setShowEclipticReference(event.target.checked)}
        />
        <span>Show active frame overlay</span>
      </label>
      <p className="readout">Active overlay: {activeFrame?.label}</p>
    </section>
  )
}