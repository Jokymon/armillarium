import { useSimulationStore } from '../../state/simulation-store'

export function EclipticReferencePanel() {
  const showEclipticReference = useSimulationStore((state) => state.showEclipticReference)
  const setShowEclipticReference = useSimulationStore((state) => state.setShowEclipticReference)

  return (
    <section>
      <h2>Ecliptic Reference</h2>
      <label className="toggle-field">
        <input
          type="checkbox"
          checked={showEclipticReference}
          onChange={(event) => setShowEclipticReference(event.target.checked)}
        />
        <span>Show ecliptic reference frame</span>
      </label>
      <ul>
        <li>The renderer X-Y plane is the ecliptic plane.</li>
        <li>X points toward the vernal equinox.</li>
        <li>Y points 90° counterclockwise from X when viewed from ecliptic north.</li>
        <li>Z points toward the north ecliptic pole.</li>
        <li>The toggle controls the plane, axes, and axis labels together.</li>
      </ul>
    </section>
  )
}