import { READOUT_REFERENCE_FRAME_OPTIONS, useSimulationStore } from '../../state/simulation-store'

export function EclipticReferencePanel() {
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const readoutReferenceFrame = useSimulationStore((state) => state.readoutReferenceFrame)
  const setShowEclipticReference = useSimulationStore((state) => state.setShowEclipticReference)
  const activeFrame = READOUT_REFERENCE_FRAME_OPTIONS.find((option) => option.value === readoutReferenceFrame)

  return (
    <section>
      <h2>Ecliptic Reference</h2>
      <label className="toggle-field">
        <input
          type="checkbox"
          checked={showEclipticReference}
          onChange={(event) => setShowEclipticReference(event.target.checked)}
        />
        <span>Show active ecliptic reference frame</span>
      </label>
      <p className="readout">Overlay origin: {activeFrame?.label}</p>
      <ul>
        <li>The ecliptic plane keeps the same orientation in both available frames.</li>
        <li>Heliocentric ecliptic anchors the axes at the Sun.</li>
        <li>Geocentric ecliptic anchors the same parallel axes at the Earth.</li>
        <li>X points toward the vernal equinox.</li>
        <li>Y points 90° counterclockwise from X when viewed from ecliptic north.</li>
        <li>Z points toward the north ecliptic pole.</li>
      </ul>
    </section>
  )
}